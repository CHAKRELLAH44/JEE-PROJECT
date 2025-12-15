package com.mcommerce.microservice_commandes.service;

import com.mcommerce.microservice_commandes.client.ProductClient;
import com.mcommerce.microservice_commandes.dao.CommandeRepository;
import com.mcommerce.microservice_commandes.model.Commande;
import com.mcommerce.microservice_commandes.model.Product;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommandeService {

    private final CommandeRepository repo;
    private final ProductClient productClient;

    public CommandeService(CommandeRepository repo, ProductClient productClient) {
        this.repo = repo;
        this.productClient = productClient;
    }

    public List<Commande> findAll() {
        return repo.findAll();
    }

    public Commande save(Commande cmd) {
        return repo.save(cmd);
    }

    public Commande getById(Long id) {
        return repo.findById(id).orElse(null);
    }

    public Product getProduit(Long idProduit) {
        return productClient.getProductById(idProduit);
    }

    public void deleteById(Long id) {
        repo.deleteById(id);
    }

}
