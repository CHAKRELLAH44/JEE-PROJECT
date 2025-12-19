# 🧪 TESTS DE VALIDATION - CAHIER DES CHARGES

**Projet** : JOSKA E-Commerce Platform  
**Auteur** : Joska Power (CHAKRELLAH44)  
**Objectif** : Valider toutes les exigences du CDC (Cas 1 et Cas 2)

---

## 📋 PRÉREQUIS

### 1. Services à Démarrer (DANS CET ORDRE)

```bash
# Terminal 1 - Config Server (OBLIGATOIRE EN PREMIER)
cd MS/configserver
mvn spring-boot:run

# Attendre le message : "Started ConfigServerApplication"
```

```bash
# Terminal 2 - Eureka Server
cd MS/eureka-server
mvn spring-boot:run

# Attendre le message : "Started EurekaServerApplication"
```

```bash
# Terminal 3 - Gateway Service
cd MS/gateway-service
mvn spring-boot:run

# Attendre le message : "Started GatewayServiceApplication"
```

```bash
# Terminal 4 - Microservice Produits
cd MS/microservice-produits
mvn spring-boot:run

# Attendre le message : "Started MicroserviceProduitsApplication"
```

```bash
# Terminal 5 - Microservice Commandes
cd MS/microservice-commandes
mvn spring-boot:run

# Attendre le message : "Started MicroserviceCommandesApplication"
```

### 2. Vérifier que Tous les Services sont UP

```bash
# Ouvrir dans le navigateur
http://localhost:9102

# Vérifier que ces 3 services sont enregistrés :
# ✅ MICROSERVICE-PRODUITS
# ✅ MICROSERVICE-COMMANDES
# ✅ GATEWAY-SERVICE
```

---

## ✅ CAS 1 : TESTS MICROSERVICE-COMMANDES

### 📌 TEST 1.a : Vérifier la Structure de la Table COMMANDE

**Exigence CDC** : La table COMMANDE doit contenir [id, description, quantité, date, montant]

#### Méthode 1 : Via Console H2
```bash
# 1. Ouvrir dans le navigateur
http://localhost:9002/h2-console

# 2. Paramètres de connexion :
JDBC URL: jdbc:h2:file:./data/commandesdb
User Name: sa
Password: (laisser vide)

# 3. Cliquer sur "Connect"

# 4. Exécuter cette requête SQL :
SELECT * FROM COMMANDE;

# 5. Vérifier les colonnes :
# ✅ ID
# ✅ DESCRIPTION
# ✅ QUANTITE
# ✅ DATE
# ✅ MONTANT
# ✅ ID_PRODUIT (bonus pour le cas 2)
```

#### Méthode 2 : Via API REST
```bash
# Créer une commande pour tester
curl -X POST http://localhost:9002/commandes \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Test Validation CDC",
    "quantite": 5,
    "montant": 250.50,
    "idProduit": 1
  }'

# Résultat attendu :
{
  "id": 1,
  "description": "Test Validation CDC",
  "quantite": 5,
  "date": "2025-XX-XX",
  "montant": 250.5,
  "idProduit": 1
}
```

**✅ VALIDÉ** si toutes les colonnes sont présentes

---

### 📌 TEST 1.b : Vérifier Configuration Spring Cloud + GitHub

**Exigence CDC** : La configuration doit être gérée par Spring Cloud Config + GitHub

#### Test 1 : Vérifier que le Config Server lit depuis GitHub
```bash
curl http://localhost:9101/microservice-commandes/default
```

**Résultat attendu** :
```json
{
  "name": "microservice-commandes",
  "profiles": ["default"],
  "propertySources": [
    {
      "name": "https://github.com/CHAKRELLAH44/mcommerce-config-repo/microservice-commandes.properties",
      "source": {
        "mes-config-ms.commandes-last": "10",
        "feign.client.config.default.connectTimeout": "5000",
        ...
      }
    }
  ]
}
```

#### Test 2 : Vérifier les Logs du Config Server
```bash
# Dans le terminal du Config Server, rechercher :
"Adding property source: Config resource 'file [...]"
"Located property source: CompositePropertySource"
```

**✅ VALIDÉ** si le fichier est lu depuis GitHub

---

### 📌 TEST 1.c : Tester la Propriété `mes-config-ms.commandes-last`

**Exigence CDC** : Propriété personnalisée pour afficher les dernières commandes

#### Étape 1 : Vérifier la Valeur Initiale
```bash
curl http://localhost:9002/config
```

**Résultat attendu** : `10`

#### Étape 2 : Modifier la Valeur sur GitHub
1. Aller sur : `https://github.com/CHAKRELLAH44/mcommerce-config-repo`
2. Ouvrir le fichier `microservice-commandes.properties`
3. Cliquer sur l'icône **Edit** (crayon)
4. Modifier la ligne :
   ```properties
   mes-config-ms.commandes-last=20
   ```
5. Commit : `Update commandes-last to 20`

#### Étape 3 : Rafraîchir la Configuration (SANS REDÉMARRAGE)
```bash
curl -X POST http://localhost:9002/actuator/refresh
```

**Résultat attendu** :
```json
["config.client.version","mes-config-ms.commandes-last"]
```

#### Étape 4 : Vérifier la Nouvelle Valeur
```bash
curl http://localhost:9002/config
```

**Résultat attendu** : `20`

**✅ VALIDÉ** si la valeur change SANS redémarrer le microservice

---

### 📌 TEST 1.d : Vérifier Actuator - Statut UP

**Exigence CDC** : Le statut de santé doit être "UP"

```bash
curl http://localhost:9002/actuator/health
```

**Résultat attendu** :
```json
{
  "status": "UP",
  "components": {
    "commandeHealthIndicator": {
      "status": "UP",
      "details": {
        "status": "Commandes disponibles"
      }
    },
    "diskSpace": {
      "status": "UP"
    },
    "ping": {
      "status": "UP"
    }
  }
}
```

**✅ VALIDÉ** si `"status": "UP"`

---

### 📌 TEST 1.e : Vérifier Health Check Personnalisé

**Exigence CDC** : UP si commandes > 0, DOWN si commandes = 0

#### Scénario 1 : Base de Données Vide (Status DOWN)
```bash
# 1. Supprimer toutes les commandes
curl -X DELETE http://localhost:9002/commandes/1
curl -X DELETE http://localhost:9002/commandes/2
# ... (supprimer toutes les commandes existantes)

# 2. Vérifier le health
curl http://localhost:9002/actuator/health
```

**Résultat attendu** :
```json
{
  "status": "DOWN",
  "components": {
    "commandeHealthIndicator": {
      "status": "DOWN",
      "details": {
        "status": "Aucune commande"
      }
    }
  }
}
```

#### Scénario 2 : Ajouter une Commande (Status UP)
```bash
# 1. Créer une commande
curl -X POST http://localhost:9002/commandes \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Test Health Check",
    "quantite": 1,
    "montant": 100,
    "idProduit": 1
  }'

# 2. Vérifier le health
curl http://localhost:9002/actuator/health
```

**Résultat attendu** : `"status": "UP"`

**✅ VALIDÉ** si DOWN sans commandes, UP avec commandes

---

## ✅ CAS 2 : TESTS ARCHITECTURE MICROSERVICES

### 📌 TEST 2.a : Vérifier le Schéma d'Architecture

**Exigence CDC** : Présenter un schéma de l'architecture

```bash
# Ouvrir le fichier
MS/ARCHITECTURE.md
```

**✅ VALIDÉ** si le schéma montre :
- Config Server (9101)
- Eureka Server (9102)
- Gateway (9103)
- Microservice-Produits (9001)
- Microservice-Commandes (9002)
- Frontend React (3000)
- Flux de communication

---

### 📌 TEST 2.b : Vérifier l'Enregistrement Eureka

**Exigence CDC** : Les microservices doivent être enregistrés dans Eureka

```bash
# Ouvrir dans le navigateur
http://localhost:9102
```

**Résultat attendu** :
```
Instances currently registered with Eureka:
✅ MICROSERVICE-PRODUITS - 1 instance
✅ MICROSERVICE-COMMANDES - 1 instance
✅ GATEWAY-SERVICE - 1 instance
```

**✅ VALIDÉ** si les 3 services sont visibles

---

### 📌 TEST 2.c : Vérifier la Gateway (Point d'Accès Unique)

**Exigence CDC** : Gateway comme point d'accès unique

#### Test 1 : Route PRODUITS
```bash
# Via Gateway
curl http://localhost:9103/PRODUITS/api/products

# Résultat attendu : Liste des produits
```

#### Test 2 : Route COMMANDES
```bash
# Via Gateway
curl http://localhost:9103/COMMANDES/commandes

# Résultat attendu : Liste des commandes
```

#### Test 3 : Vérifier que l'Accès Direct Fonctionne Aussi
```bash
# Accès direct (sans Gateway)
curl http://localhost:9001/api/products
curl http://localhost:9002/commandes

# Les deux doivent fonctionner
```

**✅ VALIDÉ** si toutes les routes fonctionnent

---

### 📌 TEST 2.d : Vérifier CRUD Complet sur Commandes

**Exigence CDC** : Implémenter les fonctionnalités CRUD

#### CREATE (Créer)
```bash
curl -X POST http://localhost:9002/commandes \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Commande CRUD Test",
    "quantite": 10,
    "montant": 500.00,
    "idProduit": 1
  }'

# Résultat attendu : Commande créée avec un ID
```

#### READ ALL (Lire Tout)
```bash
curl http://localhost:9002/commandes

# Résultat attendu : Liste de toutes les commandes
```

#### READ ONE (Lire Une)
```bash
curl http://localhost:9002/commandes/1

# Résultat attendu : Détails de la commande 1
```

#### UPDATE (Modifier)
```bash
curl -X PUT http://localhost:9002/commandes/1 \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Commande Modifiée",
    "quantite": 20,
    "montant": 1000.00,
    "idProduit": 2
  }'

# Résultat attendu : Commande mise à jour
```

#### DELETE (Supprimer)
```bash
curl -X DELETE http://localhost:9002/commandes/1

# Résultat attendu : Commande supprimée
```

**✅ VALIDÉ** si toutes les opérations fonctionnent

---

### 📌 TEST 2.e : Vérifier Load Balancing

**Exigence CDC** : Mécanisme de load balancing

#### Test : Vérifier la Configuration
```bash
# 1. Vérifier que la Gateway utilise lb://
# Ouvrir : MS/gateway-service/src/main/resources/application.yml

# Rechercher :
uri: lb://MICROSERVICE-PRODUITS
uri: lb://MICROSERVICE-COMMANDES

# 2. Tester via Gateway
curl http://localhost:9103/COMMANDES/commandes
```

**✅ VALIDÉ** si :
- URI utilise `lb://` (load balancer)
- Les requêtes passent par Eureka
- La Gateway distribue les requêtes

---

### 📌 TEST 2.f : Vérifier Circuit Breaker (Resilience4j)

**Exigence CDC** : Mécanisme de contournement en cas de timeout

#### Scénario : Timeout du Microservice-Produits
```bash
# 1. Appeler l'endpoint qui récupère le produit d'une commande
# (Le ProductController a un Thread.sleep(5000) qui simule un timeout)
curl http://localhost:9002/commandes/1/produit
```

**Résultat attendu** (Fallback activé) :
```json
{
  "id": 1,
  "titre": "Produit indisponible",
  "description": "Aucun",
  "image": "none.png",
  "prix": 0.0
}
```

#### Test Alternatif : Arrêter le Microservice-Produits
```bash
# 1. Arrêter le microservice-produits (Ctrl+C dans son terminal)

# 2. Appeler l'endpoint
curl http://localhost:9002/commandes/1/produit

# Résultat attendu : Même fallback (produit par défaut)
```

**✅ VALIDÉ** si le fallback retourne un produit par défaut au lieu d'une erreur

---

### 📌 TEST 2.g : Vérifier Swagger/OpenAPI

**Exigence CDC** : Appliquer OpenAPI et Swagger

#### Test 1 : Swagger Microservice-Produits
```bash
# Ouvrir dans le navigateur
http://localhost:9001/swagger-ui.html
```

**Résultat attendu** : Interface Swagger avec tous les endpoints documentés

#### Test 2 : Swagger Microservice-Commandes
```bash
# Ouvrir dans le navigateur
http://localhost:9002/swagger-ui.html
```

**Résultat attendu** : Interface Swagger avec tous les endpoints documentés

**✅ VALIDÉ** si Swagger UI s'affiche correctement sur les deux microservices

---

## 📊 CHECKLIST FINALE DE VALIDATION

### ✅ CAS 1 : Microservice-Commandes
- [ ] **1.a** - Table COMMANDE avec colonnes [id, description, quantité, date, montant]
- [ ] **1.b** - Configuration via Spring Cloud Config + GitHub
- [ ] **1.c** - Propriété `mes-config-ms.commandes-last` fonctionnelle
- [ ] **1.c** - Rechargement à chaud avec `/actuator/refresh`
- [ ] **1.d** - Actuator Health status UP
- [ ] **1.e** - Health Check personnalisé (UP si commandes > 0, DOWN sinon)

### ✅ CAS 2 : Architecture Microservices
- [ ] **2.a** - Schéma d'architecture créé et documenté
- [ ] **2.b** - Microservices enregistrés dans Eureka
- [ ] **2.c** - Gateway fonctionnelle (routes PRODUITS et COMMANDES)
- [ ] **2.d** - CRUD complet (CREATE, READ, UPDATE, DELETE)
- [ ] **2.e** - Load Balancing via Eureka (uri: lb://)
- [ ] **2.f** - Circuit Breaker avec fallback fonctionnel
- [ ] **2.g** - Swagger UI accessible sur les deux microservices

---

## 🎯 RÉSULTAT ATTENDU

**Si tous les tests passent** : ✅ **100% de conformité au CDC**

---

## 🚨 DÉPANNAGE

### Problème : Config Server ne trouve pas le fichier GitHub
**Solution** :
```bash
# Vérifier l'URL du repository
cat MS/configserver/src/main/resources/application.properties

# Doit contenir :
spring.cloud.config.server.git.uri=https://github.com/CHAKRELLAH44/mcommerce-config-repo.git

# Redémarrer le Config Server
```

### Problème : Le refresh ne fonctionne pas
**Solution** :
```bash
# Vérifier que @RefreshScope est présent sur GlobalConfig
# Vérifier les logs du microservice
```

### Problème : Circuit Breaker ne s'active pas
**Solution** :
```bash
# Vérifier que Resilience4j est configuré dans microservice-commandes.properties
# Vérifier que ProductFallback est bien annoté avec @Component
```

---

**Auteur** : Joska Power (CHAKRELLAH44)  
**Date** : 2025  
**Projet** : JOSKA E-Commerce Platform

