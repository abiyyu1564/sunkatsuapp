package com.sunkatsu.backend.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;
import java.io.File;

@Service
public class FileStorageService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    public String storeFile(MultipartFile file) throws IOException {
        if (file.isEmpty()) return null;

        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path targetLocation = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), targetLocation);

        return fileName; // just return filename, not full path
    }

    public void deleteFile(String filename) {
        Path path = Paths.get(uploadDir, filename);
        try {
            Files.deleteIfExists(path);
        } catch (IOException e) {
            System.out.println("Failed to delete: " + filename);
        }
    }

    public Path getFilePath(String filename) {
        return Paths.get(uploadDir, filename);
    }
}
