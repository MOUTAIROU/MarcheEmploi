import pdfplumber
from PIL import Image
import pytesseract
import io
import json


def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extraire le texte d'un PDF. Si PDF scanné, retournera vide."""
    text = ""
    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        for page in pdf.pages:
           # print(page.extract_text())
            text += page.extract_text() or ""
    return text

def extract_text_from_image(file_bytes: bytes) -> str:
    """Extraire le texte d'une image via OCR."""
    image = Image.open(io.BytesIO(file_bytes))
    text = pytesseract.image_to_string(image, lang='fra+eng')
    return text

def detect_file_type(file_name: str) -> str:
    """Retourne le type du fichier selon l'extension."""
    ext = file_name.lower().split('.')[-1]
    if ext in ['pdf']:
        return 'pdf'
    elif ext in ['jpg', 'jpeg', 'png', 'bmp', 'tiff']:
        return 'image'
    else:
        return 'unknown'


