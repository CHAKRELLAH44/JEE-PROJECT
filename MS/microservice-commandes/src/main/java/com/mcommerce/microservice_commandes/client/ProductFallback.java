package com.mcommerce.microservice_commandes.client;

import com.mcommerce.microservice_commandes.model.Product;
import org.springframework.stereotype.Component;

@Component
public class  ProductFallback implements ProductClient {

    @Override
    public Product getProductById(Long id) {
        return new Product(id, "Produit indisponible", "Aucun", "none.png", 0.0);
    }
}
