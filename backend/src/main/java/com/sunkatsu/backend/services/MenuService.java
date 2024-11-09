package com.sunkatsu.backend.services;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.sunkatsu.backend.models.*;
import com.sunkatsu.backend.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.IOException;
import java.nio.file.Path;
import java.util.List;
import java.util.Optional;

@Service
public class MenuService {

    @Autowired
    private MenuRepository menuRepository;

    @Autowired
    private SequenceGeneratorService sequenceGeneratorService;

    @Autowired
    private FileStorageService fileStorageService;

    public Menu createMenu(Menu menu, MultipartFile file) throws IOException {
        // Generate unique ID for menu
        menu.setId(sequenceGeneratorService.generateSequence(Menu.SEQUENCE_NAME));

        if (file != null && !file.isEmpty()) {
            Path imagePath = fileStorageService.storeFile(file);
            menu.setImagePath(imagePath);
            menu.setImageURL(fileStorageService.getImageURL(imagePath));
        }

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
            // Update menu fields
            menu.setName(menuDetails.getName());
            menu.setPrice(menuDetails.getPrice());
            menu.setDesc(menuDetails.getDesc());
            menu.setNumsBought(menuDetails.getNumsBought());

            if (file != null && !file.isEmpty()) {
                // Delete old image if exists
                if (menu.getImagePath() != null) {
                    fileStorageService.deleteFile(menu.getImagePath());
                }

                // Store new file
                Path imagePath;
                try {
                    imagePath = fileStorageService.storeFile(file);
                    menu.setImagePath(imagePath);
                    menu.setImageURL(fileStorageService.getImageURL(imagePath));
                } catch (IOException e) {
                    e.printStackTrace();
                }
                
            }

            return menuRepository.save(menu);
        }).orElse(null);
    }

    public boolean deleteMenu(int id) {
        Optional<Menu> menu = menuRepository.findById(id);
        if (menu.isPresent()) {
            // Delete image file if exists
            if (menu.get().getImagePath() != null) {
                fileStorageService.deleteFile(menu.get().getImagePath());
            }
            menuRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
