package com.mcommerce.microservice_commandes.health;

import com.mcommerce.microservice_commandes.dao.CommandeRepository;
import org.springframework.boot.actuate.health.*;
import org.springframework.stereotype.Component;

@Component
public class CommandeHealthIndicator implements HealthIndicator {

    private final CommandeRepository repo;

    public CommandeHealthIndicator(CommandeRepository repo) {
        this.repo = repo;
    }

    @Override
    public Health health() {
        if (repo.count() > 0)
            return Health.up().withDetail("status", "Commandes disponibles").build();

        return Health.down().withDetail("status", "Aucune commande").build();
    }
}
