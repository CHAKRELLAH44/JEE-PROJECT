package com.mcommerce.microservice_commandes;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class MicroserviceCommandesApplication {

	public static void main(String[] args) {
		SpringApplication.run(MicroserviceCommandesApplication.class, args);
	}
}
