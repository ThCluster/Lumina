# Lumina

Application e-commerce de démonstration avec frontend React + backend FastAPI + base MongoDB.

## 1. Prérequis

Avant de lancer le projet, vérifie que tu as installé :

- Python 3.10+
- Node.js 18+
- MongoDB local
- npm

## 2. Démarrer MongoDB

Assure-toi que MongoDB est bien lancé localement.

Par défaut, le projet utilise :

- host : localhost
- port : 27017
- base : lumina

URL de connexion :

mongodb://localhost:27017/

## 3. Installer les dépendances backend

Depuis le dossier racine du projet :

```bash
cd backend
pip install -r requirements.txt
```

Si `requirements.txt` n’existe pas dans ce dossier, installe au moins les paquets suivants :

```bash
pip install fastapi uvicorn pymongo python-dotenv
```

## 4. Lancer le backend

Depuis la racine du projet :

```bash
python -m uvicorn backend.app:app --host 0.0.0.0 --port 8000
```

Le backend sera accessible ici :

http://localhost:8000

Vérification rapide :

```bash
curl http://localhost:8000/api/produits
```

Tu devrais voir une liste JSON de produits.

## 5. Installer les dépendances frontend

Ouvre un autre terminal et lance :

```bash
cd frontend
npm install
```

## 6. Lancer le frontend

Toujours dans le dossier frontend :

```bash
npm run dev -- --host 0.0.0.0 --port 3000
```

Le frontend sera accessible ici :

http://localhost:3000

## 7. Vérification rapide du projet

### Backend

```bash
curl http://localhost:8000/api/health
```

Réponse attendue :

```json
{"status": "ok", "service": "lumina"}
```

### MongoDB

Vérifie que la base `lumina` existe et contient des collections comme :

- produits
- utilisateurs
- commandes
- paniers
- avis

## 8. Comptes de test

Les comptes de démonstration suivants existent dans la base :

- alice@lumina.fr / 
- benoit@lumina.fr / 
- camille@lumina.fr / 
- dorian@lumina.fr / 
- emma@lumina.fr / 
- fabrice@lumina.fr / 

## 9. Structure du projet

```text
Lumina/
├── backend/
│   ├── app.py
│   ├── database.py
│   ├── mock_data.py
│   ├── produits.py
│   ├── utilisateurs.py
│   ├── paniers.py
│   ├── commandes.py
│   ├── avis.py
│   └── main.py
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
├── README.md
├── revision.txt
├── fastapi_revision.txt
└── .gitignore
```

## 10. Points importants

- Le frontend appelle le backend sur le port 8000.
- Le backend se connecte à MongoDB sur localhost:27017.
- Si MongoDB est vide, le backend peut injecter des données de test via `get_db()`.
- La cohérence des commandes est garantie par des transactions MongoDB.

## 11. En cas de problème

### Problème : MongoDB ne répond pas
Vérifie que le service MongoDB est démarré.

### Problème : port 8000 déjà utilisé
Tu peux arrêter le processus bloquant ou utiliser un autre port.

### Problème : frontend ne charge pas les produits
Vérifie que le backend tourne bien sur http://localhost:8000.

## 12. Résumé rapide

Pour lancer le projet :

```bash
# terminal 1
python -m uvicorn backend.app:app --host 0.0.0.0 --port 8000

# terminal 2
cd frontend
npm install
npm run dev -- --host 0.0.0.0 --port 3000
```

Puis ouvre :

- http://localhost:3000
- http://localhost:8000/api/produits

## 13. Conclusion

Ce projet est une application e-commerce de démonstration qui utilise :

- React pour le frontend
- FastAPI pour l’API
- MongoDB pour le stockage des données

C’est une architecture simple, claire et adaptée pour apprendre le couplage frontend-backend-base de données.
