package com.sunkatsu.backend.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sunkatsu.backend.dto.Message;
import com.sunkatsu.backend.models.Favorite;
import com.sunkatsu.backend.services.CustomerService;
import com.sunkatsu.backend.services.FavoriteService;
import com.sunkatsu.backend.services.MenuService;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {

    @Autowired
    private FavoriteService favoriteService;

    @Autowired
    private CustomerService customerService;

    @Autowired
    private MenuService menuService;

    @Operation(
        summary = "Update favorites",
        description = "Update favorites"
    )
    @PostMapping("/saveOrUpdate")
    public ResponseEntity<Object> saveOrUpdateFavorite(@Payload Favorite favorite) {
        var customer = customerService.getCustomerById(String.valueOf(favorite.getUserID()));
        var menu = menuService.getMenuById(favorite.getMenu().getId());
        if (customer == null || menu == null || favorite.getTimesBought() < 0) {
            return ResponseEntity.badRequest().body(new Message("Error : Invalid input"));
        }

        Favorite savedFavorite = favoriteService.saveOrUpdate(favorite);
        return ResponseEntity.ok(savedFavorite);
    }

    @Operation(
        summary = "Get all favorites",
        description = "Get all favorites"
    )
    @GetMapping
    public List<Favorite> getAllFavorites(){
        return favoriteService.getAllFavorites();
    }

    @Operation(
        summary = "Get favorite by ID",
        description = "Get one favorite by ID"
    )
    @GetMapping("/{id}")
    public ResponseEntity<Object> getFavoriteById(@PathVariable int id) {
        Optional<Favorite> favOpt = favoriteService.getFavoriteById(id);

        if (favOpt.isPresent()) {
            Favorite f = favOpt.get();
            return ResponseEntity.ok(f);
        }
        return ResponseEntity.badRequest().body(new Message("Error: Id not found"));
    }

    @Operation(
        summary = "Create new favorite",
        description = "Create a new favorite and save it in DB"
    )
    @PostMapping("/create")
    public ResponseEntity<Object> createFavorite(@RequestParam int userId, @RequestParam int menuId) {
        var customer = customerService.getCustomerById(String.valueOf(userId));
        var menu = menuService.getMenuById(menuId).get();
        if (customer == null || menu == null) {
            return ResponseEntity.badRequest().body(new Message("Error : menu Id or user Id is not found"));
        }

        Favorite f = favoriteService.createFavorite(userId, menu);
        return ResponseEntity.ok(f);
    }

    @Operation(
        summary="Delete favorite by id",
        description="Delete one favorite by its id"
    )
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteFavorite(@PathVariable int id) {
        var favorite = favoriteService.getFavoriteById(id);
        if (favorite.isPresent()) {
            favoriteService.deleteFavorite(id);
            return ResponseEntity.ok().body(new Message("Success :Favorite successfully deleted"));
        }
        return ResponseEntity.badRequest().body(new Message("Error : Id is not found"));
    }

    @Operation(
        summary="Increment a favorite's timesBought by its id",
        description = "Increment a single favorite's timesBought"
    )
    @PostMapping("/increment/{id}")
    public ResponseEntity<Object> incrementTimesBought(@PathVariable int id) {
        var fav = favoriteService.getFavoriteById(id);
        if (fav != null) {
            favoriteService.timesBoughtIncrement(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().body(new Message("Error : Id is not found"));
    }
}
