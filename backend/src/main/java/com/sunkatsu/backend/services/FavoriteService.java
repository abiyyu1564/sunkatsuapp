package com.sunkatsu.backend.services;

import com.sunkatsu.backend.models.*;
import com.sunkatsu.backend.repositories.FavoriteRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FavoriteService {

    @Autowired
    private FavoriteRepository favoriteRepository;

    @Autowired
    private SequenceGeneratorService sequenceGeneratorService;

    public Favorite saveOrUpdate(Favorite favorite) {
        return favoriteRepository.save(favorite);
    }

    public List<Favorite> getAllFavorites() {
        return favoriteRepository.findAll();
    }

    public Optional<Favorite> getFavoriteById(int id) {
        return favoriteRepository.findById(id);
    }

    public Favorite createFavorite(int userId, int menuId) {
        Favorite f = new Favorite(sequenceGeneratorService.generateSequence(Favorite.SEQUENCE_NAME), 0, menuId, userId);
        return favoriteRepository.save(f);
    }

    public void deleteFavorite(int id) {
        favoriteRepository.deleteById(id);
    }

    public List<Favorite> getFavoriteByUserId(int userId) {
        return favoriteRepository.findByUserID(userId);
    }
    
    public void timesBoughtIncrement(int Id) {
        Optional<Favorite> favOpt = favoriteRepository.findById(Id);

        if (favOpt.isPresent()) {
            Favorite f = favOpt.get();
            f.setTimesBought(f.getTimesBought() + 1);
        } else {
            ResponseEntity.badRequest().build();
        }
    }
}
