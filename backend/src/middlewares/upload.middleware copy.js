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

    req.body.filenameBase = filename;

    cb(null, filename);
  },
});

// Types autorisés
const allowedTypes = ["image/png", "image/jpg", "image/jpeg", "image/webp", "image/avif"];

// Middleware Multer
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Formats autorisés : png, jpg, jpeg, webp, avif"));
  },
});

// Conversion automatique en WebP
async function convertToWebP(files) {
  const convertedFiles = [];

  for (const key in files) {
    for (const file of files[key]) {
      const original = file.path;
      const webpPath = original.replace(/\.[^.]+$/, ".webp");

      await sharp(original).webp({ quality: 80 }).toFile(webpPath);

      fs.unlinkSync(original); // supprimer original

      file.filename = path.basename(webpPath);
      file.path = webpPath;

      convertedFiles.push(file);
    }
  }

  return convertedFiles;
}

module.exports = {
  upload: upload.fields([
    { name: "photo_profil", maxCount: 1 },
    { name: "photo_couverture", maxCount: 1 },
    { name: "photos", maxCount: 12 },
  ]),
  convertToWebP,
};
