const multer = require("multer");
const path = require("path");
const fs = require("fs");

const UPLOAD_DIR = path.join(__dirname, "../../uploads/pdf");

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

function cleanText(text) {
  return text?.replace(/[^a-zA-Z0-9]/g, "") || "file";
}

function getExtension(name) {
  return name.split(/[#?]/)[0].split(".").pop().trim();
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),

  filename: (req, file, cb) => {
    const userId = cleanText(req.body.nom_legal || "entreprise");
    const field = file.fieldname; // 👈 ifu_doc ou rccm
    const timestamp = Date.now();
    const ext = getExtension(file.originalname);

    const filename = `${userId}_${field}_${timestamp}.${ext}`;

    // stocker dans body pour DB
    if (!req.body.files) req.body.files = {};
    req.body.files[field] = filename;

    cb(null, filename);
  },
});

const uploadPDF = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Seuls les PDF sont acceptés"));
  },
});

module.exports = uploadPDF;
