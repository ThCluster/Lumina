from datetime import datetime

try:
    from .database import get_db
except ImportError:  # direct script execution fallback
    from database import get_db


def deposer_avis(user_id, produit_id, note, commentaire=""):
    """Dépose un avis pour un produit."""
    db = get_db()
    avis = {
        "user_id": user_id,
        "produit_id": produit_id,
        "note": note,
        "commentaire": commentaire,
        "date": datetime.utcnow(),
    }
    result = db.avis.insert_one(avis)
    return str(result.inserted_id)
