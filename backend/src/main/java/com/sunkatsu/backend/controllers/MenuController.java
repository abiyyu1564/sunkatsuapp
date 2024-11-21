package com.sunkatsu.backend.controllers;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.sunkatsu.backend.models.Menu;
import com.sunkatsu.backend.services.MenuService;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/api/menus")
public class MenuController {

    @Autowired
    private MenuService menuService;

    @Operation(
        summary = "Get all menus",
        description = "Get all menus"
    )
    @GetMapping
    public List<Menu> getAllMenus() {
        return menuService.getAllMenus();
    }

    @Operation(
        summary = "Create a new menu",
        description = "Create a new menu"
    )
    @PostMapping(consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<Object> createMenu(
            @RequestParam("name") String name,
            @RequestParam("price") int price,
            @RequestParam("desc") String desc,
            @RequestParam("category") String category,
            @RequestParam("nums_bought") int numsBought,
            @RequestPart("file") MultipartFile file) throws IOException {
        
        Pattern pattern = Pattern.compile("[^a-z0-9 ]", Pattern.CASE_INSENSITIVE);
        Matcher matchName = pattern.matcher(name);
        Matcher matchDesc = pattern.matcher(desc);
        Matcher matchCategory = pattern.matcher(category);
                
        if ((category != "makanan" || category != "minuman" || category != "desert") || matchName.find() || matchDesc.find() || matchCategory.find()) {
            return ResponseEntity.badRequest().body("Input name, price, desc, atau category tidak valid");
        }
        Menu menu = new Menu(name, null, null, price, desc, category, numsBought);
        Menu createdMenu = menuService.createMenu(menu, file);
        return ResponseEntity.ok(createdMenu);
    }

    @Operation(
        summary = "Update a menu",
        description = "Update an already existing menu"
    )
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Object> updateMenu(
            @PathVariable int id,
            @RequestParam("name") String name,
            @RequestParam("price") int price,
            @RequestParam("desc") String desc,
            @RequestParam("category") String category,
            @RequestParam("nums_bought") int numsBought,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        
        Pattern pattern = Pattern.compile("[^a-z0-9 ]", Pattern.CASE_INSENSITIVE);
        Matcher matchName = pattern.matcher(name);
        Matcher matchDesc = pattern.matcher(desc);
        Matcher matchCategory = pattern.matcher(category);
                        
        if ((category != "makanan" || category != "minuman" || category != "desert") || matchName.find() || matchDesc.find() || matchCategory.find()) {
            return ResponseEntity.badRequest().body("Input name, price, desc, atau category tidak valid");
        }
        Menu menuDetails = new Menu(name, null, null, price, desc, category, numsBought);
        try {
            Menu updatedMenu = menuService.updateMenu(id, menuDetails, file);
            return updatedMenu != null ? ResponseEntity.ok(updatedMenu) : ResponseEntity.badRequest().body("Something went wrong");
        } catch(IOException e) {
            return ResponseEntity.badRequest().body("Error: "+ e.getMessage());
        }
    }   

    @Operation(
        summary="Delete menu by Id",
        description="Delete a single menu by its id"
    )
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteMenu(@PathVariable int id) {
        boolean isDeleted = menuService.deleteMenu(id);
        if (isDeleted) {
            return ResponseEntity.ok("Menu with ID " + id + " has been successfully deleted.");
        } else {
            return ResponseEntity.badRequest().body("Something went wrong");
        }
    }

    @Operation(
        summary = "Get a menu's image",
        description = "Get a menu's image by its image name"
    )
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
