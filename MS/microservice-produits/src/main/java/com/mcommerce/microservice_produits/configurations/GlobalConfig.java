package com.mcommerce.microservice_produits.configurations;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties("mes-configs")
@RefreshScope
public class GlobalConfig {
    private int limitDeProduits;

    public int getLimitDeProduits() {
        return limitDeProduits;
    }

    public void setLimitDeProduits(int limitDeProduits) {
        this.limitDeProduits = limitDeProduits;
    }
}
//Cette classe lie la propriété mes-configs.limitDeProduits récupérée depuis GitHub (via Config Server) à une variable Java utilisable dans le contrôleur.
// @RefreshScope indique à Spring que ce bean peut être rafraîchi dynamiquement quand on déclenche /actuator/refresh