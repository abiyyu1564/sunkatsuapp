package com.sunkatsu.backend.controllers;

import com.sunkatsu.backend.services.*;
import com.sunkatsu.backend.models.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/menus")
public class MenuController {

    @Autowired
    private MenuService menuService;

     @PostMapping
    public ResponseEntity<Menu> createMenu(@RequestParam("file") MultipartFile file, @RequestParam("name") String name,
                                           @RequestParam("price") int price, @RequestParam("desc") String desc,
                                           @RequestParam("numsBought") int numsBought) throws IOException {
        Menu menu = new Menu(name, null, null, price, desc, numsBought);
        return ResponseEntity.ok(menuService.createMenu(menu, file));
    }

    @GetMapping
    public List<Menu> getAllMenus() {
        return menuService.getAllMenus();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Menu> getMenuById(@PathVariable int id) {
        return menuService.getMenuById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Menu> updateMenu(@PathVariable int id, @RequestParam("file") MultipartFile file,
                                           @RequestParam("name") String name, @RequestParam("price") int price,
                                           @RequestParam("desc") String desc, @RequestParam("numsBought") int numsBought) throws IOException {
        Menu menuDetails = new Menu(name, null, null, price, desc, numsBought);
        return ResponseEntity.ok(menuService.updateMenu(id, menuDetails, file));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMenu(@PathVariable int id) {
        return menuService.deleteMenu(id) ?
                ResponseEntity.ok("Menu deleted successfully") :
                ResponseEntity.status(404).body("Menu not found");
    }
}
