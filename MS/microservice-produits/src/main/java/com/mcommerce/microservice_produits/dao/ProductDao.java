package com.mcommerce.microservice_produits.dao;

import com.mcommerce.microservice_produits.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductDao extends JpaRepository<Product,Long> {}

//Le DAO gère l’accès aux données via JPA (findAll, findById, save...).
//Ce DAO permet d’effectuer automatiquement toutes les opérations CRUD sans écrire une seule requête SQL.