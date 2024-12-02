package com.sunkatsu.backend.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.sunkatsu.backend.models.Favorite;
import com.sunkatsu.backend.models.Menu;

@Repository
public interface FavoriteRepository extends MongoRepository<Favorite, Integer> {
    List<Favorite> findAllByUserID(int userID);
    Optional<Favorite> findByUserIDAndMenu(int userID, Menu menu);
}
