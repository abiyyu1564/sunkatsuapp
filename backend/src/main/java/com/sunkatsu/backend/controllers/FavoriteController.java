package com.sunkatsu.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sunkatsu.backend.models.Favorite;
// import com.sunkatsu.backend.repositories.FavoriteRepository;
import com.sunkatsu.backend.services.FavoriteService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {

    @Autowired
    private FavoriteService favoriteService;

    @PostMapping("/saveOrUpdate")
    public ResponseEntity<Favorite> saveOrUpdateFavorite(@RequestBody Favorite favorite) {
        Favorite savedFavorite = favoriteService.saveOrUpdate(favorite);
        return ResponseEntity.ok(savedFavorite);
    }

    @GetMapping
    public List<Favorite> getAllFavorites(){
        return favoriteService.getAllFavorites();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Favorite> getFavoriteById(@PathVariable int id) {
        Optional<Favorite> favOpt = favoriteService.getFavoriteById(id);

        if (favOpt.isPresent()) {
            Favorite f = favOpt.get();
            return ResponseEntity.ok(f);
        }
        return ResponseEntity.badRequest().build();
    }

    
    @PostMapping("/create")
    public ResponseEntity<Favorite> createFavorite(@RequestParam int userId, @RequestParam int menuId) {
        Favorite f = favoriteService.createFavorite(userId, menuId);
        return ResponseEntity.ok(f);
    }

    @DeleteMapping("/{id}")
    public void deleteFavorite(@PathVariable int id) throws Exception {
        favoriteService.deleteFavorite(id);
    }

    @GetMapping("/{id}/favorite")
    public ResponseEntity<List<Favorite>> getFavoriteByUserId(@PathVariable int userId){
        List<Favorite> f = favoriteService.getFavoriteByUserId(userId);
        return f != null ? ResponseEntity.ok(f) :
        ResponseEntity.notFound().build();
    }

    @PostMapping("/increment/{id}")
    public ResponseEntity<Void> incrementTimesBought(@PathVariable int id) {
        favoriteService.timesBoughtIncrement(id);
        return ResponseEntity.ok().build();
    }
}
