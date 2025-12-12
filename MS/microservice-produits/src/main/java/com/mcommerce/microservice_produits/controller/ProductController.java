package com.mcommerce.microservice_produits.controller;

import com.mcommerce.microservice_produits.configurations.GlobalConfig;
import com.mcommerce.microservice_produits.dao.ProductDao;
import com.mcommerce.microservice_produits.model.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ProductController implements HealthIndicator {

    @Autowired
    private ProductDao productDao;

    @Autowired
    private GlobalConfig globalConfig;

    // LISTE LIMITÉE DE PRODUITS
    @GetMapping("/Produits")
    public List<Product> listeDesProduits() {
        int limite = globalConfig.getLimitDeProduits();
        List<Product> produits = productDao.findAll();
        return produits.subList(0, Math.min(limite, produits.size()));
    }

    //  RETROUVER UN PRODUIT PAR ID
    //  AVEC TIMEOUT POUR TEST HYSTRIX
    @GetMapping("/Produits/{id}")
    public Product afficherUnProduit(@PathVariable int id) throws InterruptedException {

        // Simulation d’un timeout → OBLIGATOIRE pour Hystrix
        Thread.sleep(5000);

        return productDao.findById(id).orElse(null);
    }

    // ✔️ HEALTH INDICATOR (Déjà utilisé dans ton TP)
    @Override
    public Health health() {
        long count = productDao.count();
        if (count == 0) {
            return Health.down().withDetail("Erreur", "Aucun produit en base").build();
        }
        return Health.up().withDetail("Produits_en_base", count).build();
    }
}
