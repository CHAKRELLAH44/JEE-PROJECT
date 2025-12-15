package com.mcommerce.microservice_produits.configurations;


import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class UploadConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 🔥 Utiliser le chemin ABSOLU pour servir les images
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:C:/Users/Lenovo/Documents/5IIR/jee/Project/MS/microservice-produits/uploads/");
    }
}
