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
@RequestMapping("/api/products")   // 🔥 FIX : route propre et standard
public class ProductController implements HealthIndicator {

    @Autowired
    private ProductDao productDao;

    @Autowired
    private GlobalConfig globalConfig;

    // GET ALL
    @GetMapping
    public List<Product> getAll() {
        int limit = globalConfig.getLimitDeProduits();
        List<Product> produits = productDao.findAll();
        return produits.subList(0, Math.min(limit, produits.size()));
    }

    // GET BY ID
    @GetMapping("/{id}")
    public Product getById(@PathVariable Long id) throws InterruptedException {
        Thread.sleep(5000); // Hystrix test
        return productDao.findById(id).orElse(null);
    }

    // POST - CREATE PRODUCT
    @PostMapping
    public Product create(@RequestBody Product product) {
        return productDao.save(product);
    }

    // PUT - UPDATE
    @PutMapping("/{id}")
    public Product update(@PathVariable Long id, @RequestBody Product newP) {
        return productDao.findById(id).map(p -> {
            p.setTitre(newP.getTitre());
            p.setDescription(newP.getDescription());
            p.setImage(newP.getImage());
            p.setPrix(newP.getPrix());
            return productDao.save(p);
        }).orElse(null);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        productDao.deleteById(id);
    }

    @Override
    public Health health() {
        long count = productDao.count();
        if (count == 0) return Health.down().withDetail("Erreur", "Aucun produit").build();
        return Health.up().withDetail("Produits_en_base", count).build();
    }
}
