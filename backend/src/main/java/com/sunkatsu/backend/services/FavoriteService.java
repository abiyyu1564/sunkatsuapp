package com.sunkatsu.backend.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.sunkatsu.backend.models.Favorite;
import com.sunkatsu.backend.models.Menu;
import com.sunkatsu.backend.repositories.FavoriteRepository;
import com.sunkatsu.backend.repositories.MenuRepository;

@Service
public class FavoriteService {

    @Autowired
    private FavoriteRepository favoriteRepository;

    @Autowired
    private MenuRepository menuRepository;

    @Autowired
    private SequenceGeneratorService sequenceGeneratorService;

    public Favorite saveOrUpdate(Favorite favorite) {
        return favoriteRepository.save(favorite);
    }

    public List<Favorite> getAllFavorites() {
        List<Favorite> listFav = favoriteRepository.findAll();
        for (Favorite fav : listFav) {
            var menuId = fav.getMenu().getId();
            var foundMenu = menuRepository.findById(menuId);

            if (!foundMenu.isPresent()) {
                listFav.remove(fav);
                favoriteRepository.delete(fav);
            }
        }
        return listFav;
    }

    public Optional<Favorite> getFavoriteById(int id) {
        return favoriteRepository.findById(id);
    }

    public Favorite createFavorite(int userId, Menu menu) {
        Favorite f = new Favorite(sequenceGeneratorService.generateSequence(Favorite.SEQUENCE_NAME), 0, menu, userId);
        return favoriteRepository.save(f);
    }

    public void deleteFavorite(int id) {
        favoriteRepository.deleteById(id);
    }

    public List<Favorite> getFavoriteByUserId(int userId) {
        List<Favorite> listFav = favoriteRepository.findAllByUserID(userId);
        for (Favorite fav : listFav) {
            var menuId = fav.getMenu().getId();
            var foundMenu = menuRepository.findById(menuId);

            if (!foundMenu.isPresent()) {
                listFav.remove(fav);
                favoriteRepository.delete(fav);
            }
        }
        return listFav;
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
