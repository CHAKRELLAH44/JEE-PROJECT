# JOSKA - E-Commerce Platform

## 📋 Description
Plateforme e-commerce professionnelle basée sur une architecture microservices avec Spring Boot et React.

## 🏗️ Architecture

### Backend (Spring Boot)
- **Config Server** (Port 9101) - Configuration centralisée
- **Eureka Server** (Port 9102) - Service Discovery
- **Gateway Service** (Port 9103) - API Gateway avec gestion CORS
- **Microservice Produits** (Port 9001) - Gestion des produits et upload d'images
- **Microservice Commandes** (Port 9002) - Gestion des commandes

### Frontend (React)
- **mcommerce-front** (Port 3000) - Interface utilisateur React moderne

## 🚀 Technologies utilisées

### Backend
- Spring Boot 3.x
- Spring Cloud (Gateway, Eureka, Config)
- H2 Database (mode fichier persistant)
- Maven
- Java 17+

### Frontend
- React 19.2.3
- Axios
- React Router DOM
- CSS3 moderne

## 📦 Installation et démarrage

### Prérequis
- Java 17 ou supérieur
- Maven 3.6+
- Node.js 16+ et npm

### Démarrage des services (dans l'ordre)

1. **Config Server**
```bash
cd MS/configserver
mvn spring-boot:run
```

2. **Eureka Server**
```bash
cd MS/eureka-server
mvn spring-boot:run
```

3. **Gateway Service**
```bash
cd MS/gateway-service
mvn spring-boot:run
```

4. **Microservice Produits**
```bash
cd MS/microservice-produits
mvn spring-boot:run
```

5. **Microservice Commandes**
```bash
cd MS/microservice-commandes
mvn spring-boot:run
```

6. **Frontend React**
```bash
cd MS/mcommerce-front
npm install
npm start
```

## 🌐 URLs d'accès

- **Frontend React** : http://localhost:3000
- **Gateway API** : http://localhost:9103
- **Eureka Dashboard** : http://localhost:9102
- **H2 Console Produits** : http://localhost:9001/h2-console
- **H2 Console Commandes** : http://localhost:9002/h2-console

## 📂 Structure du projet

```
MS/
├── configserver/          # Serveur de configuration
├── eureka-server/         # Service discovery
├── gateway-service/       # API Gateway
├── microservice-produits/ # Gestion produits
├── microservice-commandes/# Gestion commandes
└── mcommerce-front/       # Interface React
```

## ✨ Fonctionnalités

### Gestion des Produits
- ✅ Créer, modifier, supprimer des produits via modal
- ✅ Upload et affichage d'images
- ✅ Recherche de produits en temps réel
- ✅ Filtrage par prix (< 100 DH, 100-500 DH, > 500 DH)
- ✅ Tri par nom (A-Z, Z-A) et prix (croissant, décroissant)
- ✅ Dashboard avec statistiques (Total produits, Prix moyen, Valeur stock)
- ✅ Interface en grille de cartes moderne

### Gestion des Commandes
- ✅ Créer, modifier, supprimer des commandes via modal
- ✅ Association produit-commande avec images
- ✅ Calcul automatique du montant
- ✅ Dashboard avec statistiques (Total commandes, Montant total, Articles vendus)
- ✅ Interface panier professionnel

## 🎨 Design
- Interface moderne et professionnelle
- Design responsive
- Navigation sticky
- Modals pour les formulaires
- Statistiques en temps réel
- Footer personnalisé "Project made by Joska Power"

## 🔧 Configuration CORS
Le CORS est géré au niveau du Gateway pour permettre les requêtes depuis le frontend React (localhost:3000).

## 💾 Base de données
Les microservices utilisent H2 en mode fichier persistant :
- Produits : `MS/microservice-produits/data/produitsdb.mv.db`
- Commandes : `MS/microservice-commandes/data/commandesdb.mv.db`

## 📸 Upload d'images
Les images sont stockées dans : `MS/microservice-produits/uploads/`

## 👥 Auteur
**Joska Power** - CHAKRELLAH44

## 📄 Licence
Projet académique Réalisé par Joska Power - 5IIR JEE © 2025 - Tous droits réservés

