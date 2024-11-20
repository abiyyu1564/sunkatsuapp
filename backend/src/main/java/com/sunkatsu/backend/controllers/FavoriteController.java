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

import com.sunkatsu.backend.models.Favorite;
import com.sunkatsu.backend.services.FavoriteService;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {

    @Autowired
    private FavoriteService favoriteService;

    @Operation(
        summary = "Update favorites",
        description = "Update favorites"
    )
    @PostMapping("/saveOrUpdate")
    public ResponseEntity<Favorite> saveOrUpdateFavorite(@Payload Favorite favorite) {
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
    public ResponseEntity<Favorite> getFavoriteById(@PathVariable int id) {
        Optional<Favorite> favOpt = favoriteService.getFavoriteById(id);

        if (favOpt.isPresent()) {
            Favorite f = favOpt.get();
            return ResponseEntity.ok(f);
        }
        return ResponseEntity.badRequest().build();
    }

    @Operation(
        summary = "Create new favorite",
        description = "Create a new favorite and save it in DB"
    )
    @PostMapping("/create")
    public ResponseEntity<Favorite> createFavorite(@RequestParam int userId, @RequestParam int menuId) {
        Favorite f = favoriteService.createFavorite(userId, menuId);
        return ResponseEntity.ok(f);
    }

    @Operation(
        summary="Delete favorite by id",
        description="Delete one favorite by its id"
    )
    @DeleteMapping("/{id}")
    public void deleteFavorite(@PathVariable int id) throws Exception {
        favoriteService.deleteFavorite(id);
    }

    @Operation(
        summary="Increment a favorite's timesBought by its id",
        description = "Increment a single favorite's timesBought"
    )
    @PostMapping("/increment/{id}")
    public ResponseEntity<Void> incrementTimesBought(@PathVariable int id) {
        favoriteService.timesBoughtIncrement(id);
        return ResponseEntity.ok().build();
    }
}
