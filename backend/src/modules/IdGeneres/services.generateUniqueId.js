const { Console } = require("console");
const IdRepository = require("./idGeneres.repository");

async function generateUniqueId(type, codePays = "BJ") {
    // Préfixe selon type
    let prefix = "";
    switch (type) {
        case "offre_emploi":
            prefix = "OFF";
            break;

        case "appel_offre":
            prefix = "AOF";
            break;

        case "entretien":
            prefix = "ENT";
            break;

        case "qcm":                      // ✅ AJOUT POUR QCM
        case "examen_qcm":              // si tu veux appeler différemment
            prefix = "QCM";
            break;

        default:
            throw new Error("Type invalide !");
    }

    // Date
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    const dateCode = `${year}${month}${day}`;

    // Numéro initial
    let numero = 1000;

    while (true) {
        const code = `${prefix}-${codePays}-${year}-${dateCode}-${numero}`;

       

        // Vérification disponibilité
        const exist = await IdRepository.findByCode(code);

        

        if (!exist) {
            // Sauvegarde
            await IdRepository.save(prefix, code);
            return code;
        }

        // Incrémentation si existe déjà
        numero++;
    }
}

module.exports = generateUniqueId;
