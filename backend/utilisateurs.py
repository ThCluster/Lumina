try:
    from .database import get_db
except ImportError:  # direct script execution fallback
    from database import get_db


def creer_compte(email, mot_de_passe, nom=""):
    """Crée un compte utilisateur s'il n'existe pas déjà."""
    db = get_db()

    if db.utilisateurs.find_one({"email": email}):
        raise ValueError("Un compte avec cet email existe déjà.")

    utilisateur = {
        "email": email,
        "mot_de_passe": mot_de_passe,
        "nom": nom,
    }

    result = db.utilisateurs.insert_one(utilisateur)
    return str(result.inserted_id)


def authentifier(email, mot_de_passe):
    """Vérifie les identifiants d'un utilisateur."""
    db = get_db()
    utilisateur = db.utilisateurs.find_one({
        "email": email,
        "mot_de_passe": mot_de_passe,
    })

    if utilisateur:
        utilisateur["_id"] = str(utilisateur["_id"])
        return utilisateur
    return None
