package com.sunkatsu.backend.controllers;

import com.sunkatsu.backend.models.Menu;
import com.sunkatsu.backend.services.MenuService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/menus")
public class MenuController {

    @Autowired
    private MenuService menuService;

    @GetMapping
    public List<Menu> getAllMenus() {
        return menuService.getAllMenus();
    }

    @PostMapping(consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<Menu> createMenu(
            @RequestParam("name") String name,
            @RequestParam("price") int price,
            @RequestParam("desc") String desc,
            @RequestParam("category") String category,
            @RequestParam("nums_bought") int numsBought,
            @RequestPart("file") MultipartFile file) throws IOException {
        Menu menu = new Menu(name, null, null, price, desc, category, numsBought);
        Menu createdMenu = menuService.createMenu(menu, file);
        return ResponseEntity.ok(createdMenu);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Menu> updateMenu(
            @PathVariable int id,
            @RequestParam("name") String name,
            @RequestParam("price") int price,
            @RequestParam("desc") String desc,
            @RequestParam("category") String category,
            @RequestParam("nums_bought") int numsBought,
            @RequestPart(value = "file", required = false) MultipartFile file) throws IOException {
        Menu menuDetails = new Menu(name, null, null, price, desc, category, numsBought);
        Menu updatedMenu = menuService.updateMenu(id, menuDetails, file);
        return updatedMenu != null ? ResponseEntity.ok(updatedMenu) : ResponseEntity.notFound().build();
    }   

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMenu(@PathVariable int id) {
        boolean isDeleted = menuService.deleteMenu(id);
        if (isDeleted) {
            return ResponseEntity.ok("Menu with ID " + id + " has been successfully deleted.");
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    @GetMapping("/images/{filename}")
    public ResponseEntity<byte[]> getImage(@PathVariable String filename) throws IOException {
        Path filePath = Paths.get("./uploads", filename);
        
        if (!Files.exists(filePath)) {
            return ResponseEntity.notFound().build();
        }

        byte[] image = Files.readAllBytes(filePath);
        String contentType = Files.probeContentType(filePath); // Dapatkan tipe konten file secara otomatis

        return ResponseEntity.ok()
                            .header("Content-Type", contentType != null ? contentType : "application/octet-stream")
                            .body(image);
    }


}
