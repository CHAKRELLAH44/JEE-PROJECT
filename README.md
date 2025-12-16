# 🛒 MCommerce — Microservices (Produits & Commandes) | Spring Cloud + React

## 1) Présentation du projet
Ce projet est une mini-plateforme e-commerce construite en **architecture microservices**.  
L'objectif est de séparer les responsabilités (Produits / Commandes) tout en mettant en place un écosystème **Spring Cloud** complet :

- **Config Server** : configuration centralisée (GitHub)
- **Eureka** : discovery + enregistrement automatique des services
- **API Gateway** : point d'entrée unique + routage vers les microservices
- **Actuator** : health check + refresh de configuration à chaud
- **H2** : base locale persistante (mode fichier)
- **React** : interface Web pour manipuler Produits & Commandes
- **Upload image** : ajout de produit avec image (multipart/form-data)

---

## 2) Technologies / Outils utilisés

### ✅ Back-end
- Java + Spring Boot
- Spring Web (API REST)
- Spring Data JPA (CRUD sans SQL manuel)
- H2 Database (persistante)
- Spring Cloud Config (GitHub)
- Eureka Server + Eureka Client
- Spring Cloud Gateway
- Spring Boot Actuator (health, refresh)
- Hystrix (fallback en cas de timeout — selon TP)
- Swagger / OpenAPI (documentation API)

### ✅ Front-end
- ReactJS
- Axios (appels API via Gateway)
- UI : gestion produits + commandes + PDF reçu (selon ton front)

### ✅ Tests
- Postman (CRUD + upload)
- H2 Console (validation des données)
- Eureka Dashboard (services visibles)

---

## 3) Architecture générale

### 3.1 Schéma global
```
        +---------------------+
        |   Config Server     |
        |       (9101)        |
        +----------+----------+
                   |
                   |
+----------------------+----------------------+
|                                              |
v                                              v
+---------------------+            +---------------------+
|   Eureka Server     |            |    API Gateway      |
|      (9102)         |<----------->|      (9103)        |
+----------+----------+            +----------+----------+
           |                                   |
           |                                   |
           |                                   |
+----------+----------+            +------------+------------+
|  MS Produits        |            |     MS Commandes        |
|     (9001)          |            |        (9002)           |
|  H2 produitsdb      |            |   H2 commandesdb        |
+---------------------+            +-------------------------+
----------------------------------------------------------------
           ^
           |
           |
    +------+------+
    | Front React |
    |   (3000)    |
    +-------------+
```

### 3.2 Flux de fonctionnement
1. Le **Front React** appelle uniquement la **Gateway** (point d'entrée unique).
2. La **Gateway** route :
   - `/PRODUITS/**` → microservice-produits
   - `/COMMANDES/**` → microservice-commandes
3. Les services sont découverts via **Eureka** (load balancing possible).
4. Les configurations sont centralisées dans **Config Server** (GitHub).
5. **Actuator** permet :
   - `health` pour supervision
   - `refresh` pour recharger la config sans redémarrage

---

## 4) Ports & URLs utiles

| Composant | Port | URL |
|---|---|---|
| Config Server | 9101 | http://localhost:9101 |
| Eureka Server | 9102 | http://localhost:9102 |
| API Gateway | 9103 | http://localhost:9103 |
| MS Produits | 9001 | http://localhost:9001 |
| MS Commandes | 9002 | http://localhost:9002 |
| Front React | 3000 | http://localhost:3000 |

### Routes Gateway
- Produits : `http://localhost:9103/PRODUITS/**`
- Commandes : `http://localhost:9103/COMMANDES/**`

**Exemple :**
- GET Produits : `http://localhost:9103/PRODUITS/api/products`

---

## 5) Structure du projet (Back-end)

### 5.1 Config Server
- **But** : centraliser la configuration des services dans GitHub.
- Fichier essentiel : `application.properties` (URI du repo Git)

### 5.2 Eureka Server
- **But** : registre de services (discovery).
- Interface : `http://localhost:9102`

### 5.3 API Gateway
- **But** : point d'entrée unique (routage + filtres).
- Fichier essentiel : `application.yml` (déclare les routes `/PRODUITS/**`, `/COMMANDES/**`)

### 5.4 Microservice Produits
- **But** : CRUD produits + upload image.
- **Packages typiques :**
  - `model/` : entité Product
  - `dao/` : ProductDao (JpaRepository)
  - `controller/` : endpoints REST + upload
  - `service/` : sauvegarde fichier upload
- H2 : `jdbc:h2:file:./data/produitsdb`

### 5.5 Microservice Commandes
- **But** : CRUD commandes + V2 avec `id_produit` + health check personnalisé.
- **Packages typiques :**
  - `model/` : Commande + Product (DTO)
  - `dao/` : CommandeRepository
  - `service/` : logique métier
  - `client/` : appel Produit + fallback Hystrix (si présent)
  - `health/` : UP si commandes existent, sinon DOWN
- H2 : `jdbc:h2:file:./data/commandesdb`

---

## 6) Configuration (essentiel)

⚠️ Chaque microservice a son **application.properties / bootstrap.properties** pour :
- définir le **nom spring.application.name**
- connecter au **Config Server**
- connecter à **Eureka**
- activer **Actuator**
- configurer **H2**

---

## 7) Fonctionnalités clés

### 7.1 Produits
- CRUD complet
- Upload d'image (stockage local `/uploads`)
- Gestion du prix et du stock
- Validation des données

### 7.2 Commandes
- CRUD complet
- Association avec produit (ID produit)
- Calcul automatique du total (prix × quantité)
- Health check personnalisé
- Fallback Hystrix (si microservice Produits indisponible)

### 7.3 Spring Cloud Features
- **Centralized Config** : toutes configurations dans GitHub
- **Service Discovery** : Eureka avec auto-registration
- **API Gateway** : routing intelligent + point d'entrée unique
- **Circuit Breaker** : Hystrix pour resilience
- **Monitoring** : Actuator endpoints (health, metrics, refresh)

---

## 8) Front-end (React)

### Fonctionnalités principales
- Liste des produits (cards + image)
- Ajout produit avec upload image
- Liste des commandes (montant, quantité, total)
- Ajout commande avec sélection produit
- Génération d'un reçu PDF (si implémentée dans le front)

Le front communique uniquement avec : `http://localhost:9103` (Gateway)

---

## 9) Captures d'écran

### 9.1 Interface Produits
<img width="1725" height="1016" alt="Interface Produits" src="https://github.com/user-attachments/assets/1" />

<img width="1725" height="1016" alt="Interface Produits" src="https://github.com/user-attachments/assets/1-1" />

### 9.2 Interface Commandes
<img width="1725" height="1016" alt="Interface Commandes" src="https://github.com/user-attachments/assets/2-1" />

### 9.3 Reçu PDF
<img width="1725" height="1016" alt="Reçu PDF" src="https://github.com/user-attachments/assets/3" />

### 9.4 Eureka Dashboard
<img width="1725" height="1016" alt="Eureka Dashboard" src="https://github.com/user-attachments/assets/4" />



---

## 10) Lancement (ordre conseillé)

1. **Config Server** (9101)
2. **Eureka Server** (9102)
3. **Gateway** (9103)
4. **MS Produits** (9001)
5. **MS Commandes** (9002)
6. **Front React** (3000)



---

## 11) Accès aux interfaces

- **Frontend React** : http://localhost:3000
- **API Gateway** : http://localhost:9103
- **Eureka Dashboard** : http://localhost:9102
- **Config Server** : http://localhost:9101
- **H2 Console Produits** : http://localhost:9001/h2-console
- **H2 Console Commandes** : http://localhost:9002/h2-console
- **Actuator Health** : http://localhost:9001/actuator/health

---

## 12) Résultat final

L'application fournit une architecture microservices fonctionnelle :
- centralisée et configurable à chaud,
- découvrable via Eureka,
- accessible via une gateway unique,
- testable via Postman,
- vérifiable via H2 console,
- exploitable via une interface React complète.

---

## 📁 Structure des dossiers
```
mcommerce-microservices/
├── config-server/
├── eureka-server/
├── api-gateway/
├── ms-produits/
├── ms-commandes/
├── frontend-react/
├── docs/
│   └──  (captures d'écran)
└── README.md
```

---

## 🚀 Prochaines améliorations possibles
- Ajout de sécurité (Spring Security + JWT)
- Base de données MySQL/PostgreSQL en production
- Dockerisation complète
- Logs centralisés (ELK Stack)
- Tests unitaires et d'intégration
- CI/CD avec GitHub Actions

---

## 📄 Licence
Ce projet est à but éducatif. Libre d'utilisation et de modification.

---

**✨ Développé avec Spring Cloud & React ✨**
