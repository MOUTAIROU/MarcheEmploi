



// ================= STATUS → NOTIFICATION =================
const STATUS_NOTIFICATION_MAP = {
    ACCEPTE: {
        type: "APPLICATION",
        message_type: "SUCCESS",
        action_type: "NONE",
        title: "Candidature acceptée",
        message: "Félicitations 🎉 Votre candidature a été acceptée.",
    },

    WAITING_EXAM: {
        type: "EXAM",
        message_type: "ACTION",
        action_type: "START_QCM",
        title: "Invitation à un test",
        message:
            "Votre candidature a été retenue. Vous êtes invité(e) à passer un QCM.",
    },

    PENDING: {
        type: "APPLICATION",
        message_type: "INFO",
        action_type: "NONE",
        title: "Candidature en attente de décision",
        message: "Votre candidature est en attente de décision.",
    },

    REJETE: {
        type: "APPLICATION",
        message_type: "ALERT",
        action_type: "NONE",
        title: "Candidature non retenue",
        message:
            "Nous regrettons de vous informer que votre candidature n’a pas été retenue.",
    },

    DELETED_BY_COMPANY: {
        type: "APPLICATION",
        message_type: "ALERT",
        action_type: "NONE",
        title: "Candidature clôturée",
        message:
            "Votre candidature a été clôturée par l’entreprise.",
    },

    DELETED_BY_CANDIDAT: {
        type: "APPLICATION",
        message_type: "INFO",
        action_type: "NONE",
        title: "Candidature retirée",
        message:
            "Vous avez retiré votre candidature pour cette annonce.",
    },

    // ===== STATUTS ANNONCE (GLOBAL) =====

    OFFER_PAUSED: {
        type: "ANNONCE",
        message_type: "INFO",
        action_type: "NONE",
        title: "Annonce temporairement suspendue",
        message:
            "L’annonce à laquelle vous avez postulé est temporairement mise hors ligne. " +
            "Votre candidature reste enregistrée et sera traitée dès la reprise.",
    },

    OFFER_REPUBLISHED: {
        type: "ANNONCE",
        message_type: "SUCCESS",
        action_type: "NONE",
        title: "Annonce de nouveau active",
        message:
            "Bonne nouvelle 🎉 L’annonce à laquelle vous avez postulé est de nouveau en ligne. " +
            "Votre candidature est toujours prise en compte.",
    },

    OFFER_CLOSED: {
        type: "ANNONCE",
        message_type: "ALERT",
        action_type: "NONE",
        title: "Annonce clôturée",
        message:
            "Le recrutement pour cette annonce est désormais clôturé. " +
            "Vous serez contacté(e) si une suite est donnée à votre candidature.",
    },
};




// ================= PAYS → CODE =================
const PAYS_CODE_MAP = {
    "Bénin": "BJ",
    "Togo": "TG",
    "Côte d’Ivoire": "CI", // correction orthographe
    "Sénégal": "SN",
    "Cameroun": "CM",
};


// ================= TABLES À PARCOURIR =================
const tablesToQuery = [
    "OffreEmploi",
    "AppelOffre",
    "AppelOffreAmi",
    "AppelOffreConsultation",
    "AppelOffreRecrutementConsultant",
];

// ================= EXPORTS =================
module.exports = {
    STATUS_NOTIFICATION_MAP,
    PAYS_CODE_MAP,
    tablesToQuery,
};
