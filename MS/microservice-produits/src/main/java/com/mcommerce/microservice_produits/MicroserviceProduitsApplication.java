package com.mcommerce.microservice_produits;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;



@SpringBootApplication
@EnableConfigurationProperties
public class MicroserviceProduitsApplication {

	public static void main(String[] args) {

		SpringApplication.run(MicroserviceProduitsApplication.class, args);
	}

}

//C’est la classe principale qui démarre le microservice.
//L’annotation @EnableConfigurationProperties active la lecture des propriétés externes.