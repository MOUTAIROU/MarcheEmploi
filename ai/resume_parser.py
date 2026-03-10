# resume_parser.py
from pydantic import BaseModel, Field
from typing import List, Optional, Union

from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from langchain.chat_models import init_chat_model
from langchain_community.document_loaders import PyPDFLoader

from dotenv import load_dotenv
import os

load_dotenv()  # charge le .env dans l'environnement Python


# Helper type
DateType = Optional[Union[str, int]]


# ---------------------------
# Pydantic Data Models
# ---------------------------


class Informations(BaseModel):
    prenom: Optional[str]
    nom_de_famille: Optional[str]
    emploi_recherche: Optional[str]
    adresse_email: Optional[str]
    numero_telephone: Optional[str]
    adresse: Optional[str]
    ville: Optional[str]
    date_de_naissance: Optional[str]
    nationalite: Optional[str]
    autre: Optional[str]
    champs_personnel: Optional[str]



class Formation(BaseModel):
    id: float
    titre: Optional[str]
    etablissement: Optional[str]
    ville: Optional[str]
    debutMois: DateType = None
    debutAnnee: DateType = None
    finMois: DateType = None
    finAnnee: DateType = None
    enCours: Optional[bool] = False
    description: Optional[str]


class Experience(BaseModel):
    id: float
    titre: Optional[str]
    etablissement: Optional[str]
    ville: Optional[str]
    debutMois: DateType = None
    debutAnnee: DateType = None
    finMois: DateType = None
    finAnnee: DateType = None
    enCours: Optional[bool] = False
    description: Optional[str]


class Competence(BaseModel):
    nom: Optional[str]
    niveau: Optional[str]


class Langue(BaseModel):
    nom: Optional[str]
    niveau: Optional[str]



class Cours(BaseModel):
    id: float
    titre: Optional[str]
    mois: Optional[str]
    annee: DateType = None
    description: Optional[str]
    enCours: Optional[bool] = False


class Stage(BaseModel):
    id: float
    titre: Optional[str]
    etablissement: Optional[str]
    ville: Optional[str]
    debutMois: DateType
    debutAnnee: DateType
    finMois: DateType
    finAnnee: DateType
    enCours: Optional[bool] = False
    description: Optional[str]



class Activite(BaseModel):
    id: float
    titre: Optional[str]
    etablissement: Optional[str]
    ville: Optional[str]
    debutMois: DateType
    debutAnnee: DateType
    finMois: DateType
    finAnnee: DateType
    enCours: Optional[bool] = False
    description: Optional[str]

class Reference(BaseModel):
    id: float
    nom: Optional[str]
    entreprise: Optional[str]
    ville: Optional[str]
    telephone: Optional[str]
    email: Optional[str]


class Certificat(BaseModel):
    id: float
    titre: Optional[str]
    mois: DateType
    annee: DateType = None
    description: Optional[str]
    enCours: Optional[bool] = False


class RubriquePersonnalisee(BaseModel):
    id: float
    titre: Optional[str]
    description: Optional[str]
    lien: Optional[str]
    date: DateType


class Signature(BaseModel):
    nom: Optional[str]
    ville: Optional[str]
    date: DateType
    consentement: Optional[str]


class Resume(BaseModel):
    profile: Optional[str] = Field(None, description="Description ou profil du candidat")
    informations: Optional[Informations]
    formations: Optional[List[Formation]] = None
    experiences: Optional[List[Experience]] = None
    competences: Optional[List[Competence]] = None
    langues: Optional[List[Langue]] = None
    centres: Optional[List[str]] = None
    cours: Optional[List[Cours]] = None
    stages: Optional[List[Stage]] = None
    activites: Optional[List[Activite]] = None
    references: Optional[List[Reference]] = Field(None, alias="References")
    qualites: Optional[List[str]] = None
    certificats: Optional[List[Certificat]] = None
    realisations: Optional[List[str]] = None
    signature: Optional[Signature] = None
    rubriquesPersonnalisees: Optional[List[RubriquePersonnalisee]] = None





# ---------------------------
# Prompt Template
# ---------------------------

resume_template = """
You are an AI assistant tasked with extracting structured information from a resume.

Extract ONLY the information defined in the Resume class.

Resume Content:
{resume_text}
"""

prompt_template = PromptTemplate(
    template=resume_template,
    input_variables=['resume_text']
)


# ---------------------------
# Resume Parsing Function
# ---------------------------




def parse_resume(file_path: str):
    # Load PDF
    loader = PyPDFLoader(file_path)
    docs = loader.load()
    resume_text = "\n".join([doc.page_content for doc in docs])

    # Réutiliser la nouvelle fonction
    return parse_resume_from_text(resume_text)


def parse_resume_from_text(resume_text: str):
    """
    Parse le CV à partir d'une chaîne de texte directement.
    """
    # Initialize the OpenAI model
    model = init_chat_model(
        model='gpt-4o-mini',
        model_provider='openai'
    ).with_structured_output(Resume, method="function_calling")

    # Prepare prompt
    prompt = prompt_template.invoke({"resume_text": resume_text})

    # Call model
    result = model.invoke(prompt)

    return result.model_dump()


