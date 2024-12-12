package com.sunkatsu.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mongodb.core.aggregation.ArithmeticOperators.Log;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.sunkatsu.backend.models.Menu;
import com.sunkatsu.backend.repositories.MenuRepository;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class MenuService {

    @Autowired
    private MenuRepository menuRepository;

    @Autowired
    private SequenceGeneratorService sequenceGeneratorService;

    @Value("${file.upload-dir}")
    private String uploadDir;

    // Method to save the uploaded file
    private String saveFile(MultipartFile file) throws IOException {
        if (file.isEmpty()) return null;
        

        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Generate a unique filename
        String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(uploadDir, filename);
        Files.copy(file.getInputStream(), filePath);
        
        return filename;
    }

    // Method to delete a file
    private void deleteFile(String filename) {
        try {
            Path filePath = Paths.get(uploadDir, filename);
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            System.out.println("Error" + e.getMessage());
        }
    }

    public List<Menu> getMenuByCategory(String category) {
        return menuRepository.findByCategory(category);
    }

    public Menu createMenu(Menu menu, MultipartFile file) throws IOException {
        String filename = saveFile(file);
        if (filename != null) {
            menu.setImage(filename);
            menu.setImageURL("/api/menus/images/" + filename);
        }
        menu.setId(sequenceGeneratorService.generateSequence(Menu.SEQUENCE_NAME));
        return menuRepository.save(menu);
    }

    public List<Menu> getAllMenus() {
        return menuRepository.findAll();
    }

    public Optional<Menu> getMenuById(int id) {
        return menuRepository.findById(id);
    }

    public Menu updateMenu(int id, Menu menuDetails, MultipartFile file) throws IOException {
        return menuRepository.findById(id).map(menu -> {
            // Delete old file if a new file is uploaded
            if (file != null && !file.isEmpty()) {
                deleteFile(menu.getImage());
                try {
                    String filename = saveFile(file);
                    menu.setImage(filename);
                    menu.setImageURL("/api/menus/images/" + filename);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            menu.setName(menuDetails.getName());
            menu.setPrice(menuDetails.getPrice());
            menu.setDesc(menuDetails.getDesc());
            menu.setNumsBought(menuDetails.getNumsBought());
            return menuRepository.save(menu);
        }).orElse(null);
    }

    public boolean deleteMenu(int id) {
        Optional<Menu> menuOpt = menuRepository.findById(id);
        if (menuOpt.isPresent()) {
            deleteFile(menuOpt.get().getImage());
            menuRepository.deleteById(id);
            return true;
        }
        return false;
    }

}