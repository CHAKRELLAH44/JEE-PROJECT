# 🧪 GUIDE DE TESTS - VALIDATION CDC

**Projet** : JOSKA E-Commerce Platform  
**Objectif** : Valider toutes les exigences du Cahier des Charges

---

## 📋 PRÉREQUIS

### Services à Démarrer (dans l'ordre)
```bash
# 1. Config Server
cd MS/configserver
mvn spring-boot:run

# 2. Eureka Server
cd MS/eureka-server
mvn spring-boot:run

# 3. Gateway Service
cd MS/gateway-service
mvn spring-boot:run

# 4. Microservice Produits
cd MS/microservice-produits
mvn spring-boot:run

# 5. Microservice Commandes
cd MS/microservice-commandes
mvn spring-boot:run
```

---

## ✅ CAS 1 : TESTS MICROSERVICE-COMMANDES

### Test 1.a : Vérifier la Structure de la Table COMMANDE

**Objectif** : Valider que la table contient [id, description, quantité, date, montant, idProduit]

```bash
# Accéder à la console H2
http://localhost:9002/h2-console

# JDBC URL: jdbc:h2:file:./data/commandesdb
# User: sa
# Password: (vide)

# Exécuter la requête SQL
SELECT * FROM COMMANDE;
```

**Résultat Attendu** : Colonnes visibles : ID, DESCRIPTION, QUANTITE, DATE, MONTANT, ID_PRODUIT

✅ **VALIDÉ** si toutes les colonnes sont présentes

---

### Test 1.b : Vérifier la Configuration Spring Cloud + GitHub

**Objectif** : Valider que la config est gérée par Spring Cloud Config + GitHub

```bash
# 1. Vérifier que le Config Server lit depuis GitHub
curl http://localhost:9101/microservice-commandes/default

# 2. Vérifier les logs du Config Server
# Rechercher : "Adding property source: Config resource 'file [...]"
```

**Résultat Attendu** :
```json
{
  "name": "microservice-commandes",
  "propertySources": [
    {
      "name": "https://github.com/CHAKRELLAH44/mcommerce-config-repo/microservice-commandes.properties",
      "source": {
        "mes-config-ms.commandes-last": "10"
      }
    }
  ]
}
```

✅ **VALIDÉ** si la propriété est lue depuis GitHub

---

### Test 1.c : Tester la Propriété `mes-config-ms.commandes-last`

**Objectif** : Valider la propriété personnalisée et le rechargement à chaud

#### Étape 1 : Vérifier la Valeur Initiale
```bash
curl http://localhost:9002/config
```

**Résultat Attendu** : `10`

#### Étape 2 : Modifier la Valeur sur GitHub
1. Aller sur : `https://github.com/CHAKRELLAH44/mcommerce-config-repo`
2. Éditer `microservice-commandes.properties`
3. Changer : `mes-config-ms.commandes-last=20`
4. Commit

#### Étape 3 : Rafraîchir la Configuration
```bash
curl -X POST http://localhost:9002/actuator/refresh
```

**Résultat Attendu** :
```json
["config.client.version","mes-config-ms.commandes-last"]
```

#### Étape 4 : Vérifier la Nouvelle Valeur
```bash
curl http://localhost:9002/config
```

**Résultat Attendu** : `20`

✅ **VALIDÉ** si la valeur change sans redémarrage

---

### Test 1.d : Vérifier Actuator - Statut UP

**Objectif** : Valider que le statut de santé est "UP"

```bash
curl http://localhost:9002/actuator/health
```

**Résultat Attendu** :
```json
{
  "status": "UP",
  "components": {
    "commandeHealthIndicator": {
      "status": "UP",
      "details": {
        "status": "Commandes disponibles"
      }
    }
  }
}
```

✅ **VALIDÉ** si status = "UP"

---

### Test 1.e : Vérifier Health Check Personnalisé

**Objectif** : Valider que le statut est UP si commandes > 0, DOWN sinon

#### Scénario 1 : Base de Données Vide
```bash
# 1. Supprimer toutes les commandes
curl -X DELETE http://localhost:9002/commandes/1
curl -X DELETE http://localhost:9002/commandes/2
# ... (supprimer toutes)

# 2. Vérifier le health
curl http://localhost:9002/actuator/health
```

**Résultat Attendu** :
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

#### Scénario 2 : Ajouter une Commande
```bash
# 1. Créer une commande
curl -X POST http://localhost:9002/commandes \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Test",
    "quantite": 1,
    "montant": 100,
    "idProduit": 1
  }'

# 2. Vérifier le health
curl http://localhost:9002/actuator/health
```

**Résultat Attendu** : `"status": "UP"`

✅ **VALIDÉ** si DOWN sans commandes, UP avec commandes

---

## ✅ CAS 2 : TESTS ARCHITECTURE MICROSERVICES

### Test 2.b : Vérifier l'Enregistrement Eureka

**Objectif** : Valider que les microservices sont enregistrés dans Eureka

```bash
# Accéder au dashboard Eureka
http://localhost:9102
```

**Résultat Attendu** :
- ✅ MICROSERVICE-PRODUITS (1 instance)
- ✅ MICROSERVICE-COMMANDES (1 instance)
- ✅ GATEWAY-SERVICE (1 instance)

✅ **VALIDÉ** si les 3 services sont visibles

---

### Test 2.c : Vérifier la Gateway

**Objectif** : Valider que la Gateway route correctement les requêtes

```bash
# 1. Tester la route PRODUITS
curl http://localhost:9103/PRODUITS/api/products

# 2. Tester la route COMMANDES
curl http://localhost:9103/COMMANDES/commandes
```

**Résultat Attendu** : Réponses JSON avec les données

✅ **VALIDÉ** si les deux routes fonctionnent

---

### Test 2.d : Vérifier CRUD Commandes

**Objectif** : Valider toutes les opérations CRUD

#### CREATE
```bash
curl -X POST http://localhost:9002/commandes \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Commande Test",
    "quantite": 5,
    "montant": 250.50,
    "idProduit": 1
  }'
```

**Résultat Attendu** : Commande créée avec ID

#### READ ALL
```bash
curl http://localhost:9002/commandes
```

**Résultat Attendu** : Liste de toutes les commandes

#### READ ONE
```bash
curl http://localhost:9002/commandes/1
```

**Résultat Attendu** : Détails de la commande 1

#### UPDATE
```bash
curl -X PUT http://localhost:9002/commandes/1 \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Commande Modifiée",
    "quantite": 10,
    "montant": 500,
    "idProduit": 2
  }'
```

**Résultat Attendu** : Commande mise à jour

#### DELETE
```bash
curl -X DELETE http://localhost:9002/commandes/1
```

**Résultat Attendu** : Commande supprimée

✅ **VALIDÉ** si toutes les opérations fonctionnent

---

### Test 2.f : Vérifier Circuit Breaker (Resilience4j)

**Objectif** : Valider le mécanisme de fallback en cas de timeout

#### Scénario : Timeout du Microservice-Produits
```bash
# 1. Appeler l'endpoint qui récupère le produit d'une commande
# (Le ProductController a un Thread.sleep(5000) qui simule un timeout)
curl http://localhost:9002/commandes/1/produit
```

**Résultat Attendu** :
```json
{
  "id": 1,
  "titre": "Produit indisponible",
  "description": "Aucun",
  "image": "none.png",
  "prix": 0.0
}
```

✅ **VALIDÉ** si le fallback retourne un produit par défaut

---

### Test 2.g : Vérifier Swagger/OpenAPI

**Objectif** : Valider que Swagger UI est accessible

```bash
# 1. Swagger Produits
http://localhost:9001/swagger-ui.html

# 2. Swagger Commandes
http://localhost:9002/swagger-ui.html
```

**Résultat Attendu** : Interface Swagger avec tous les endpoints documentés

✅ **VALIDÉ** si Swagger UI s'affiche correctement

---

## 📊 CHECKLIST FINALE

### Cas 1 : Microservice-Commandes
- [ ] Table COMMANDE avec toutes les colonnes
- [ ] Configuration via Spring Cloud Config + GitHub
- [ ] Propriété `mes-config-ms.commandes-last` fonctionnelle
- [ ] Rechargement à chaud avec `/actuator/refresh`
- [ ] Actuator Health status UP
- [ ] Health Check personnalisé (UP/DOWN selon commandes)

### Cas 2 : Architecture Microservices
- [ ] Schéma d'architecture créé
- [ ] Microservices enregistrés dans Eureka
- [ ] Gateway fonctionnelle (routes PRODUITS et COMMANDES)
- [ ] CRUD complet sur Commandes (CREATE, READ, UPDATE, DELETE)
- [ ] Load Balancing via Eureka
- [ ] Circuit Breaker avec fallback fonctionnel
- [ ] Swagger UI accessible sur les deux microservices

---

## 🎯 RÉSULTAT ATTENDU

**Score de Conformité** : 100%

Si tous les tests passent, le projet est **entièrement conforme au CDC**.

---

**Auteur** : Joska Power  
**Date** : 2025  
**Projet** : JOSKA E-Commerce Platform

