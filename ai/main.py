from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from utils import extract_text_from_pdf, extract_text_from_image, detect_file_type
from resume_parser import parse_resume_from_text

app = FastAPI(title="CV Extractor API")

# Autoriser le frontend
origins = [
    "http://192.168.100.7:3500",
    "http://localhost:3500",
    "http://127.0.0.1:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/extract_cv")
async def extract_cv(file: UploadFile = File(...)):
    print('file_bytes')

    print('file')
    # 1️⃣ Détecter le type de fichier
    file_type = detect_file_type(file.filename)

    # 2️⃣ Lire le contenu en bytes
    file_bytes = await file.read()

  
    # 3️⃣ Extraire le texte
    if file_type == "pdf":
        text = extract_text_from_pdf(file_bytes)
        if not text.strip():  # PDF scanné ?
            text = extract_text_from_image(file_bytes)
    elif file_type == "image":
        text = extract_text_from_image(file_bytes)
    else:
        return JSONResponse(status_code=400, content={"error": "Format non supporté"})

    # 4️⃣ Parse le texte du CV avec ton modèle
    json_cv = parse_resume_from_text(text)

    # 5️⃣ Retourner JSON
    return {"text": text, "json": json_cv}
