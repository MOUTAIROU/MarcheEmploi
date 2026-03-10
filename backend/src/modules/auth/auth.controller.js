const AuthService = require("./auth.service");

exports.register = async (req, res) => {
  try {
    const userData = req.body; // les données du frontend

    
    const result = await AuthService.register({...userData,candidate_type:"entreprise"});
    // 3️⃣ Met le refreshToken dans un cookie HttpOnly

    res.cookie("refreshToken", result.accessToken, {
      httpOnly: true,      // impossible à lire côté JS
      secure: true,        // uniquement https (en prod)
      sameSite: "strict",  // sécurité cross-site
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 jours
    });

    res.status(201).json(result);
    
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await AuthService.login({ email, password });

    // 3️⃣ Met le refreshToken dans un cookie HttpOnly

    res.cookie("refreshToken", result.accessToken, {
      httpOnly: true,      // impossible à lire côté JS
      secure: true,        // uniquement https (en prod)
      sameSite: "strict",  // sécurité cross-site
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 jours
    });

    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.refreshToken = async (req, res) => {
  try {

    const { refreshToken } = req.body;
    const result = await AuthService.refresh(refreshToken);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { code } = req.body;
    const result = await AuthService.verifyEmail(code);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
