import os
from pymongo import MongoClient

try:
    from .mock_data import MOCK_PRODUCTS
except ImportError:  # direct script execution fallback
    from mock_data import MOCK_PRODUCTS


MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
DB_NAME = os.getenv("MONGO_DB_NAME", "lumina")

client = MongoClient(MONGO_URI)
db = client[DB_NAME]


def get_db():
    """Retourne l'objet de base de données MongoDB."""
    if "produits" not in db.list_collection_names():
        db.produits.insert_many(MOCK_PRODUCTS)
    return db


__all__ = ["get_db", "client", "db"]
