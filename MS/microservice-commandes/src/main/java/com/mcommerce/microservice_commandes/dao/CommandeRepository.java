package com.mcommerce.microservice_commandes.dao;

import com.mcommerce.microservice_commandes.model.Commande;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommandeRepository extends JpaRepository<Commande, Long> {}
