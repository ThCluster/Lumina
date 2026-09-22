try:
    from .database import get_db
except ImportError:  # direct script execution fallback
    from database import get_db


def ajouter_au_panier(user_id, produit_id, quantite=1):
    """Ajoute un produit au panier de l'utilisateur."""
    db = get_db()
    panier = db.paniers.find_one({"user_id": user_id})

    if not panier:
        panier = {"user_id": user_id, "items": []}

    nouvel_item = {"produit_id": produit_id, "quantite": quantite}
    item_existant = next((item for item in panier["items"] if item["produit_id"] == produit_id), None)

    if item_existant:
        item_existant["quantite"] += quantite
    else:
        panier["items"].append(nouvel_item)

    if not db.paniers.find_one({"user_id": user_id}):
        db.paniers.insert_one(panier)
    else:
        db.paniers.update_one({"user_id": user_id}, {"$set": {"items": panier["items"]}})

    return db.paniers.find_one({"user_id": user_id})


def voir_panier(user_id):
    """Retourne le contenu du panier d'un utilisateur."""
    db = get_db()
    panier = db.paniers.find_one({"user_id": user_id})
    return panier or {"user_id": user_id, "items": []}
