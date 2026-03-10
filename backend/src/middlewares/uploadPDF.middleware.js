const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Dossier uploads global
const UPLOAD_DIR = path.join(__dirname, "../../uploads/pdf");

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

function cleanText(text) {
  return text?.replace(/[^a-zA-Z0-9]/g, "").replace(/\s/g, "") || "file";
}

function getExtension(name) {
  return name.split(/[#?]/)[0].split(".").pop().trim();
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const userId = cleanText(req.body.titre || "anonymous");
    const field = file.fieldname;
    const timestamp = Date.now();
    const ext = getExtension(file.originalname);
    const filename = `${userId}_${field}_${timestamp}.${ext}`;
    req.body.filenameBase = filename;
    cb(null, filename);
  },
});

const uploadPDF = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Seuls les fichiers PDF sont acceptés !"));
  },
});

// Exporter directement Multer
module.exports = uploadPDF;
