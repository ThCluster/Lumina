from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

try:
    from .avis import deposer_avis
    from .commandes import historique, passer_commande
    from .paniers import ajouter_au_panier, voir_panier
    from .produits import lister_catalogue, rechercher_produit
    from .utilisateurs import authentifier, creer_compte
except ImportError:  # Allow running this file directly as a script
    from avis import deposer_avis
    from commandes import historique, passer_commande
    from paniers import ajouter_au_panier, voir_panier
    from produits import lister_catalogue, rechercher_produit
    from utilisateurs import authentifier, creer_compte

app = FastAPI(title="Lumina API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class UtilisateurCreerRequest(BaseModel):
    email: str
    mot_de_passe: str
    nom: str = ""


class UtilisateurLoginRequest(BaseModel):
    email: str
    mot_de_passe: str


class RechercheRequest(BaseModel):
    recherche: str


class PanierAjoutRequest(BaseModel):
    user_id: str
    produit_id: str
    quantite: int = 1


class CommandeRequest(BaseModel):
    user_id: str
    adresse_livraison: str = ""


class AvisRequest(BaseModel):
    user_id: str
    produit_id: str
    note: int
    commentaire: str = ""


@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "lumina"}


@app.get("/api/produits")
def api_lister_catalogue():
    return lister_catalogue()


@app.post("/api/produits/rechercher")
def api_rechercher_produit(payload: RechercheRequest):
    return rechercher_produit(payload.recherche)


@app.post("/api/utilisateurs/creer-compte")
def api_creer_compte(payload: UtilisateurCreerRequest):
    try:
        compte_id = creer_compte(payload.email, payload.mot_de_passe, payload.nom)
        return {"message": "Compte créé avec succès", "id": compte_id}
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@app.post("/api/utilisateurs/connexion")
def api_authentifier(payload: UtilisateurLoginRequest):
    utilisateur = authentifier(payload.email, payload.mot_de_passe)
    if not utilisateur:
        raise HTTPException(status_code=401, detail="Identifiants invalides")
    return utilisateur


@app.post("/api/paniers/ajouter")
def api_ajouter_au_panier(payload: PanierAjoutRequest):
    return ajouter_au_panier(payload.user_id, payload.produit_id, payload.quantite)


@app.get("/api/paniers/{user_id}")
def api_voir_panier(user_id: str):
    return voir_panier(user_id)


@app.post("/api/commandes")
def api_passer_commande(payload: CommandeRequest):
    panier = voir_panier(payload.user_id)
    try:
        commande_id = passer_commande(payload.user_id, panier, payload.adresse_livraison)
        return {"message": "Commande passée avec succès", "commande_id": commande_id}
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@app.get("/api/commandes/{user_id}")
def api_historique(user_id: str):
    return historique(user_id)


@app.post("/api/avis")
def api_deposer_avis(payload: AvisRequest):
    if not 1 <= payload.note <= 5:
        raise HTTPException(status_code=400, detail="La note doit être comprise entre 1 et 5.")

    avis_id = deposer_avis(payload.user_id, payload.produit_id, payload.note, payload.commentaire)
    return {"message": "Avis ajouté", "avis_id": avis_id}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
