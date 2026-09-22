from datetime import datetime

try:
    from .database import get_db
except ImportError:  # direct script execution fallback
    from database import get_db


def passer_commande(user_id, panier, adresse_livraison=""):
    """Passe une commande à partir d'un panier donné."""
    db = get_db()

    if not panier or not panier.get("items"):
        raise ValueError("Le panier est vide.")

    commande = {
        "user_id": user_id,
        "items": panier["items"],
        "adresse_livraison": adresse_livraison,
        "date": datetime.utcnow(),
        "statut": "en_attente",
    }

    with db.client.start_session() as session:
        with session.start_transaction():
            commande_id = db.commandes.insert_one(commande, session=session).inserted_id
            db.paniers.update_one(
                {"user_id": user_id},
                {"$set": {"items": []}},
                session=session,
            )

    return str(commande_id)


def historique(user_id):
    """Retourne les commandes passées par un utilisateur."""
    db = get_db()
    commandes = list(db.commandes.find({"user_id": user_id}))
    for commande in commandes:
        commande["_id"] = str(commande["_id"])
    return commandes
