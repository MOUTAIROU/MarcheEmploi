const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

// Dossier uploads global
const UPLOAD_DIR = path.join(__dirname, "../../uploads");

// Créer le dossier si inexistant
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Nettoyer les chaînes
function cleanText(text) {
  return text?.replace(/[^a-zA-Z0-9]/g, "").replace(/\s/g, "") || "file";
}

// Récup extension fichier
function getExtension(name) {
  return name.split(/[#?]/)[0].split(".").pop().trim();
}

// Storage Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },

  /*filename: function (req, file, cb) {
        const nameFromFront = req.body.filenameBase;

        if (!nameFromFront) {
            return cb(new Error("filenameBase manquant dans FormData"));
        }

        // On nettoie juste pour éviter caractères interdits
        const cleanName = nameFromFront.replace(/[^a-zA-Z0-9._-]/g, "");

        cb(null, cleanName);
    },*/

  filename: function (req, file, cb) {
    const userId = cleanText(req.body.tel || "anonymous");
    const field = file.fieldname;
    const timestamp = Date.now();
    const ext = getExtension(file.originalname);

    const filename = `${userId}_${field}_${timestamp}.${ext}`;

    // Stocker dans un objet avec le field comme clé
    if (!req.body.filenameBase) req.body.filenameBase = {};
    req.body.filenameBase[field] = filename;

    cb(null, filename);
  },
});

// Types autorisés
const allowedTypes = ["image/png", "image/jpg", "image/jpeg", "image/webp", "image/avif"];

// Middleware Multer
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.size === 0) {
      // accepter les fichiers vides
      cb(null, true);
    } else if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Formats autorisés : png, jpg, jpeg, webp, avif"));
    }

  },
});

// Conversion automatique en WebP
async function convertToWebP(files, req) {
  for (const key in files) {
    for (const file of files[key]) {

      if (file.size === 0) continue;


      const original = file.path;
      const ext = path.extname(original).toLowerCase();

      // ✅ Déjà en webp → juste synchroniser filenameBase
      if (ext === ".webp") {
        if (req.body.filenameBase?.[file.fieldname]) {
          req.body.filenameBase[file.fieldname] = file.filename;
        }
        continue;
      }

      const webpPath = original.replace(ext, ".webp");

      await sharp(original)
        .webp({ quality: 80 })
        .toFile(webpPath);


      // fs.unlinkSync(original);

      // 🔹 Renommer au lieu de supprimer
      // 🔹 Supprimer après 200ms (ou plus si besoin)
      /*setTimeout(() => {
        fs.unlink(original, (err) => {
          if (err) {
            console.error("Impossible de supprimer le fichier :", err);
          } else {
            console.log("Fichier original supprimé :", original);
          }
        });
      }, 1000);*/

      const newFilename = path.basename(webpPath);

      // 🔥 Mettre à jour le fichier multer
      file.filename = newFilename;
      file.path = webpPath;

      // 🔥 Mettre à jour filenameBase
      if (req.body.filenameBase?.[file.fieldname]) {
        req.body.filenameBase[file.fieldname] = newFilename;
      }
    }
  }
}


module.exports = {
  upload: upload.fields([
    { name: "photo_profil", maxCount: 1 },
    { name: "photo_couverture", maxCount: 1 },
    { name: "photos", maxCount: 12 },
  ]),
  convertToWebP,
};
