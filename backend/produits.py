try:
    from .database import get_db
except ImportError:  # direct script execution fallback
    from database import get_db


def lister_catalogue():
    """Retourne la liste complète des produits."""
    db = get_db()
    produits = list(db.produits.find({}))
    for produit in produits:
        produit["_id"] = str(produit["_id"])
    return produits


def rechercher_produit(recherche):
    """Recherche les produits par nom ou catégorie."""
    db = get_db()
    filtre = {
        "$or": [
            {"nom": {"$regex": recherche, "$options": "i"}},
            {"categorie": {"$regex": recherche, "$options": "i"}},
        ]
    }

    produits = list(db.produits.find(filtre))
    for produit in produits:
        produit["_id"] = str(produit["_id"])
    return produits
