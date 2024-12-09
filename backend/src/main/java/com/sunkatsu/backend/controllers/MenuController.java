package com.sunkatsu.backend.controllers;

import java.io.IOException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
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

import com.sunkatsu.backend.dto.Message;
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
        summary = "Get menu by id",
        description = "Get a single menu by id"
    )
    @GetMapping("/{id}")
    public ResponseEntity<Object> getMenuById(@PathVariable int id) {
        return menuService.getMenuById(id).isPresent() ? ResponseEntity.ok(menuService.getMenuById(id).get()) : ResponseEntity.badRequest().body(new Message("Error: id not found")) ;
    }

    @Operation(
        summary = "Create a new menu",
        description = "Create a new menu. Valid category: food, drink, dessert."
    )
    @PostMapping(consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<Object> createMenu(
            @RequestParam("name") String name,
            @RequestParam("price") int price,
            @RequestParam("desc") String desc,
            @RequestParam("category") String category,
            @RequestParam("nums_bought") int numsBought,
            @RequestPart("file") MultipartFile file) throws IOException {
        
        try {
            name = URLDecoder.decode(name, StandardCharsets.UTF_8.toString());
            desc = URLDecoder.decode(desc, StandardCharsets.UTF_8.toString());
            category = URLDecoder.decode(category, StandardCharsets.UTF_8.toString());
        } catch(Exception e) {
            return ResponseEntity.badRequest().body(new Message("Error : " + e.getMessage()));
        }
        
        Pattern pattern = Pattern.compile("[^a-z0-9 ]", Pattern.CASE_INSENSITIVE);
        Matcher matchName = pattern.matcher(name);
        Matcher matchDesc = pattern.matcher(desc);
        Matcher matchCategory = pattern.matcher(category);
                        
        if (!(category != "food" || category != "drink" || category != "dessert")) {
            return ResponseEntity.badRequest().body(new Message("Error : Category harus food, drink atau dessert"));
        }

        if (matchName.find() || matchDesc.find() || matchCategory.find()) {
            return ResponseEntity.badRequest().body(new Message("Error: Invalid name, desc, or category input!"));
        }

        // Validasi file: tipe MIME
        String contentType = file.getContentType();
        if (contentType == null || 
            !(contentType.equals("image/jpeg") || contentType.equals("image/png"))) {
            return ResponseEntity.badRequest().body(new Message("Error : File harus berupa gambar JPEG atau PNG"));
        }

        // Validasi file: ukuran
        long fileSizeInBytes = file.getSize();
        long maxFileSizeInBytes = 10 * 1024 * 1024; // 5 MB
        if (fileSizeInBytes > maxFileSizeInBytes) {
            return ResponseEntity.badRequest().body(new Message("Error : Ukuran file terlalu besar, maksimal 10 MB"));
        }

        Menu menu = new Menu(name, null, null, price, desc, category, numsBought);
        Menu createdMenu = menuService.createMenu(menu, file);
        return ResponseEntity.ok(createdMenu);
    }

    @Operation(
        summary = "Get all menu by category",
        description = "Get all menu by a single category"
    )
    @GetMapping("/category")
    public ResponseEntity<Object> getMenuByCategory(@RequestParam String category) {
        return ResponseEntity.ok(menuService.getMenuByCategory(category));
    }

    @Operation(
        summary = "Update a menu",
        description = "Update an already existing menu. Valid category: food, drink, dessert."
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

        // Decode input URL parameters to handle encoded characters like %20
        try {
            name = URLDecoder.decode(name, StandardCharsets.UTF_8.toString());
            desc = URLDecoder.decode(desc, StandardCharsets.UTF_8.toString());
            category = URLDecoder.decode(category, StandardCharsets.UTF_8.toString());
        } catch(Exception e) {
            return ResponseEntity.badRequest().body(new Message("Error : " + e.getMessage()));
        }
        
        Pattern pattern = Pattern.compile("[^a-z0-9 ]", Pattern.CASE_INSENSITIVE);
        Matcher matchName = pattern.matcher(name);
        Matcher matchDesc = pattern.matcher(desc);
        Matcher matchCategory = pattern.matcher(category);
                        
        if (!(category != "food" || category != "drink" || category != "dessert")) {
            return ResponseEntity.badRequest().body(new Message("Error : Category harus food, drink atau dessert"));
        }

        if (matchName.find() || matchDesc.find() || matchCategory.find()) {
            return ResponseEntity.badRequest().body(new Message("Error: Invalid name, desc, or category input!"));
        }

        if (file != null) {
            // Validasi file: tipe MIME
            String contentType = file.getContentType();
            if (contentType == null || 
                !(contentType.equals("image/jpeg") || contentType.equals("image/png"))) {
                return ResponseEntity.badRequest().body(new Message("Error : File harus berupa gambar JPEG atau PNG"));
            }

            // Validasi file: ukuran
            long fileSizeInBytes = file.getSize();
            long maxFileSizeInBytes = 10 * 1024 * 1024; // 5 MB
            if (fileSizeInBytes > maxFileSizeInBytes) {
                return ResponseEntity.badRequest().body(new Message("Error : Ukuran file terlalu besar, maksimal 10 MB"));
            }
        }

        Menu menuDetails = new Menu(name, null, null, price, desc, category, numsBought);
        try {
            Menu updatedMenu = menuService.updateMenu(id, menuDetails, file);
            return updatedMenu != null ? ResponseEntity.ok(updatedMenu) : ResponseEntity.badRequest().body(new Message("Error : Something went wrong"));
        } catch(IOException e) {
            return ResponseEntity.badRequest().body(new Message("Error: "+ e.getMessage()));
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
            return ResponseEntity.ok(new Message("Success : Menu with ID " + id + " has been successfully deleted."));
        } else {
            return ResponseEntity.badRequest().body(new Message("Error : Something went wrong"));
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
