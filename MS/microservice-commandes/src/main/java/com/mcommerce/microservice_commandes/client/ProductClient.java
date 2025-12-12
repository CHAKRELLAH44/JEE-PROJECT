package com.mcommerce.microservice_commandes.client;

import com.mcommerce.microservice_commandes.client.ProductFallback;
import com.mcommerce.microservice_commandes.model.Product;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(
        name = "microservice-produits",
        fallback = ProductFallback.class
)
public interface ProductClient {

    @GetMapping("/Produits/{id}")
    Product getProductById(@PathVariable Long id);
}
