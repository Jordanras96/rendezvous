# Application de Gestion Dentaire

Cette application est une solution complète pour gérer les rendez-vous, les patients, les médicaments et les utilisateurs d'un cabinet dentaire. Elle est conçue pour être utilisée en réseau local et offre une interface conviviale pour les dentistes et les infirmières.

## Fonctionnalités

- **Gestion des Utilisateurs** :
  - Création, modification, suppression d'utilisateurs (dentistes, infirmières, administrateurs).
  - Attribution de rôles (ADMIN, DOCTOR, NURSE, USER).
  - Sécurisation des mots de passe avec bcrypt.

- **Gestion des Patients** :
  - Création, modification, suppression de patients.
  - Fiche médicale pour chaque patient avec historique des soins.

- **Gestion des Rendez-vous** :
  - Planification, modification, annulation des rendez-vous.
  - Statut des rendez-vous (PENDING, CONFIRMED, CANCELLED, COMPLETED).

- **Gestion des Médicaments** :
  - Suivi du stock de médicaments.
  - Historique des mouvements de stock (entrées/sorties).

- **Gestion des Factures** :
  - Création et suivi des factures pour chaque patient.
  - Gestion des paiements et des arriérés.

- **Gestion des Assurances** :
  - Suivi des informations d'assurance des patients.
  - Partenariats avec des assurances santé.

## Technologies Utilisées

- **Frontend** :
  - [Next.js](https://nextjs.org/) : Framework React pour le rendu côté serveur et la génération de pages statiques.
  - [TailwindCSS](https://tailwindcss.com/) : Framework CSS utilitaire pour le style.
  - [shadcn/ui](https://ui.shadcn.com/) : Composants UI modernes et personnalisables.
  - [Axios](https://axios-http.com/) : Client HTTP pour les appels API.

- **Backend** :
  - [Express.js](https://expressjs.com/) : Framework Node.js pour la création d'API.
  - [Prisma](https://www.prisma.io/) : ORM pour la gestion de la base de données.
  - [PostgreSQL](https://www.postgresql.org/) : Base de données relationnelle.
  - [bcryptjs](https://www.npmjs.com/package/bcryptjs) : Bibliothèque pour le hachage des mots de passe.

- **Autres** :
  - [TypeScript](https://www.typescriptlang.org/) : Langage de programmation typé pour JavaScript.
  - [Electron](https://www.electronjs.org/) : Framework pour créer des applications desktop.

## Installation

### Prérequis

- [Node.js](https://nodejs.org/) (version 16 ou supérieure)
- [PostgreSQL](https://www.postgresql.org/) (version 12 ou supérieure)
- [Git](https://git-scm.com/)

### Étapes

1. **Cloner le dépôt** :
   ```bash
   git clone https://github.com/votre-nom-utilisateur/dentist-app.git
   cd dentist-app
    ```
 2.  **Installer les dépendances** :
    ```bash
    npm install
    ```
 3.  **Configurer la base de données** :

    - Créez un fichier .env à la racine du projet.
    - Ajoutez la variable DATABASE_URL avec l'URL de votre base de données PostgreSQL :
    ```env
        DATABASE_URL="postgresql://user:password@localhost:5432/dentist_app"
    ```
 4. **Exécuter les migrations Prisma** :
    ```bash
    npx prisma migrate dev --name init
    ```
 5. **Démarrer le serveur** :
    ```bash
    npm run dev
    ```
 6. **Accéder à l'application** :

    - [Frontend] : Ouvrez votre navigateur et allez à http://localhost:3000.
    - [Backend] : L'API est disponible à http://localhost:3000/api.

## Structure du Projet

    ```env
    rendezvous/
        ├── app/                  # Pages et composants Next.js
        ├── api/                  # Routes API Express.js
        ├── components/           # Composants React réutilisables
        ├── prisma/               # Schéma Prisma et migrations
        ├── public/               # Fichiers statiques (images, etc.)
        ├── styles/               # Fichiers CSS ou Tailwind
        ├── .env                  # Variables d'environnement
        ├── .gitignore            # Fichiers ignorés par Git
        ├── package.json          # Dépendances et scripts
        ├── README.md             # Documentation du projet
        └── tsconfig.json         # Configuration TypeScript
    ```

## Contribuer

Les contributions sont les bienvenues ! Voici comment vous pouvez contribuer au projet :

1. **Forker le dépôt : Cliquez sur le bouton "Fork" en haut à droite de la page du dépôt**.

2. **Cloner votre fork** :
    
    ```bash
    git clone https://github.com/votre-nom-utilisateur/dentist-app.git
    cd dentist-app
    ``
3. **Créer une branche** :
    ```bash
    git checkout -b feature/nom-de-la-fonctionnalite
    ```
4. **Faire des modifications** : Ajoutez vos fonctionnalités ou corrections.

5. **Commiter vos changements** :
    ```bash
    git add .
    git commit -m "Description de vos modifications"
    ```
6. **Pousser vos changements** :
    ```bash
    git push origin feature/nom-de-la-fonctionnalite
    ```
7. **Ouvrir une Pull Request** : Allez sur GitHub et ouvrez une Pull Request depuis votre branche.

## Licence

Ce projet est sous licence [MIT](https://chat.deepseek.com/a/chat/s/LICENSE). Voir le fichier LICENSE pour plus de détails.

## Auteur

Jordan Ny Riantsoa RASOLOARISON - [Jordanras96](https://github.com/Jordanras96)

## Remerciements

Merci à [Prisma](https://www.prisma.io/) pour leur excellent ORM.

Merci à [TailwindCSS](https://tailwindcss.com/) pour leur framework CSS utilitaire.

Merci à [shadcn/ui](https://ui.shadcn.com/) pour leurs composants UI modernes.