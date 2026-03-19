
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const repository = require("./auth.repository");
const workflow = require("./auth.workflow");
const RefreshToken = require('./refreshToken.model'); // modèle ci-dessus
const User = require("../models/User");
const { JWT_EXPIRES, REFRESH_EXPIRES, JWT_SECRET, REFRESH_SECRET } = require("../../../utils/constants");


exports.register = async ({ role, email, password, nom, pays, codePays, candidate_type }) => {

    // Vérifier si l'email existe
    const existing = await repository.findUserByEmail(email);


    if (existing) throw new Error("Email already exists");



    // Hash du mot de passe
    const hashed = await bcrypt.hash(password, 10);
    const id = Date.now().toString();



    // Création de l'utilisateur
    const newUser = await repository.createUser({
        id,
        nom,
        email: email.toLowerCase().trim(),
        password: hashed,
        role,
        pays,
        candidate_type,
        codePays
    });



    // Générer JWT

    let accessToken, refreshToken;

    try {
        accessToken = jwt.sign({ userId: id, email, role }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
        refreshToken = jwt.sign({ userId: id }, JWT_SECRET, { expiresIn: REFRESH_EXPIRES });
    } catch (err) {
        console.error("JWT generation error:", err);
        throw err;
    }

    // Sauvegarder refreshToken en DB
    await RefreshToken.create({
        token: refreshToken,
        userId: id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 jours
    });


    // Émettre l'événement workflow
    workflow.emit("USER_REGISTERED", { user: newUser });




    return {
        message: "User registered successfully",
        user: { id: newUser.id, nom: newUser.nom, email: newUser.email, role: newUser.role, pays: newUser.pays },
        accessToken,
        refreshToken
    };

};

const getCandidatinfo = async (user_id) => {

    if (!user_id) {
        return 'indisponible'
    }


    try {

        const user_info = await User.findOne({
            where: { id: user_id },
            raw: true
        })

        return user_info;

    } catch (err) {
        console.error("Erreur saveAppelOffre:", err);
        throw err;
    }


};
exports.login = async ({ email, password }) => {



    const user = await repository.findUserByEmail(email);

    if (!user) throw new Error("Invalid email or password");


    // 🔥 Vérification globale du status
    if (user.status !== "active") {

        if (user.status === "delete_by_user") {
            throw new Error("Votre compte a été désactivé");
        }

        if (user.status === "desativer_by_systeme") {
            throw new Error("Votre compte a été désactivé par le système");
        }

        throw new Error("Compte non actif");
    }


    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Invalid email or password");


    const { id, nom, email: userEmail, role, pays, isInvited, user_id } = user;


    if (isInvited) {


        if (user.status !== "actif" && user.status !== true) {

            console.log("Vous n'êtes pas autorisé")
            throw new Error("Vous n'êtes pas autorisé");
        }

    }


    // 🔹 Si invite_token existe, utiliser user_id comme identifiant principal

    let userData = {}
    const mainId = isInvited == true ? user_id : id;
    if (isInvited) {


        let info = await getCandidatinfo(mainId)

        userData = { id: mainId, nom, email: userEmail, role, pays: info.pays };
    } else {
        userData = { id: mainId, nom, email: userEmail, role, pays }
    }

    let accessToken, refreshToken;

    try {
        accessToken = jwt.sign({ userId: mainId, email, role }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
        refreshToken = jwt.sign({ userId: mainId }, JWT_SECRET, { expiresIn: REFRESH_EXPIRES });
    } catch (err) {
        console.error("JWT generation error:", err);
        throw err;
    }

    // Émettre l'événement workflow
    workflow.emit("USER_LOGGED_IN", { user: userData });

    return {
        message: "User login successfully",
        user: { id: userData.id, nom: userData.nom, email: userData.email, role: userData.role, pays: userData.pays, isInvited },
        accessToken,
        refreshToken
    };



};

exports.refresh = async (refreshToken) => {

    try {


        try {

            payload = jwt.verify(refreshToken, JWT_SECRET);



            const existing = await repository.findUserByID(payload.userId);


            if (!existing) throw new Error("User not exists");

            const { email, role } = existing.dataValues;


            accessToken = jwt.sign({ userId: payload.userId, email, role }, JWT_SECRET, { expiresIn: JWT_EXPIRES });


        } catch (err) {
            console.error("JWT generation error:", err);
            throw err;
        }

        return { accessToken };
    } catch (err) {
        throw new Error("Invalid refresh token");
    }
};

exports.verifyEmail = async (code) => {
    // Implémentation temporaire
    return { message: `Email verified with code ${code}` };
};

