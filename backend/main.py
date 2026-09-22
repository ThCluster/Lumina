from .utilisateurs import authentifier, creer_compte
from .produits import lister_catalogue, rechercher_produit
from .paniers import ajouter_au_panier, voir_panier
from .commandes import passer_commande, historique
from .avis import deposer_avis


def menu():
    """Menu CLI simple pour gérer le magasin."""
    utilisateur = None

    while True:
        print("\n=== Lumina ===")
        print("1. Créer un compte")
        print("2. Se connecter")
        print("3. Voir le catalogue")
        print("4. Rechercher un produit")
        print("5. Ajouter au panier")
        print("6. Voir mon panier")
        print("7. Passer une commande")
        print("8. Voir l'historique")
        print("9. Déposer un avis")
        print("0. Quitter")

        choix = input("Votre choix: ")

        if choix == "1":
            email = input("Email: ")
            mot_de_passe = input("Mot de passe: ")
            nom = input("Nom (optionnel): ")
            try:
                compte = creer_compte(email, mot_de_passe, nom)
                print("Compte créé:", compte)
            except ValueError as exc:
                print("Erreur:", exc)

        elif choix == "2":
            email = input("Email: ")
            mot_de_passe = input("Mot de passe: ")
            utilisateur = authentifier(email, mot_de_passe)
            if utilisateur:
                print("Connexion réussie pour:", utilisateur.get("email"))
            else:
                print("Identifiants invalides.")

        elif choix == "3":
            produits = lister_catalogue()
            print(produits)

        elif choix == "4":
            terme = input("Terme de recherche: ")
            produits = rechercher_produit(terme)
            print(produits)

        elif choix == "5":
            if not utilisateur:
                print("Veuillez vous connecter d'abord.")
                continue
            produit_id = input("ID du produit: ")
            quantite = int(input("Quantité: ") or "1")
            result = ajouter_au_panier(utilisateur["_id"], produit_id, quantite)
            print("Panier mis à jour:", result)

        elif choix == "6":
            if not utilisateur:
                print("Veuillez vous connecter d'abord.")
                continue
            print(voir_panier(utilisateur["_id"]))

        elif choix == "7":
            if not utilisateur:
                print("Veuillez vous connecter d'abord.")
                continue
            panier = voir_panier(utilisateur["_id"])
            adresse = input("Adresse de livraison: ")
            try:
                commande_id = passer_commande(utilisateur["_id"], panier, adresse)
                print("Commande passée avec succès:", commande_id)
            except ValueError as exc:
                print("Erreur:", exc)

        elif choix == "8":
            if not utilisateur:
                print("Veuillez vous connecter d'abord.")
                continue
            print(historique(utilisateur["_id"]))

        elif choix == "9":
            if not utilisateur:
                print("Veuillez vous connecter d'abord.")
                continue
            produit_id = input("ID du produit: ")
            note = int(input("Note (1-5): "))
            commentaire = input("Commentaire: ")
            avis_id = deposer_avis(utilisateur["_id"], produit_id, note, commentaire)
            print("Avis ajouté:", avis_id)

        elif choix == "0":
            print("Au revoir !")
            break

        else:
            print("Choix invalide.")


if __name__ == "__main__":
    menu()
