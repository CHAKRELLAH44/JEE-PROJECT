package com.mcommerce.microservice_produits.service;

import java.io.File;
import java.io.IOException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileStorageService {

    // 🔥 Utiliser un chemin ABSOLU pour éviter les problèmes
    private final String uploadDir = "C:\\Users\\Lenovo\\Documents\\5IIR\\jee\\Project\\MS\\microservice-produits\\uploads\\";

    public String saveFile(MultipartFile file) throws IOException {

        File directory = new File(uploadDir);
        if (!directory.exists()) directory.mkdirs();

        // 🔥 Ajouter un timestamp pour éviter les conflits de noms
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        String filePath = uploadDir + fileName;

        file.transferTo(new File(filePath));

        return fileName;
    }
}