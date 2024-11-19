package com.sunkatsu.backend.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.sunkatsu.backend.models.Favorite;

@Repository
public interface FavoriteRepository extends MongoRepository<Favorite, Integer> {
    List<Favorite> findAllByUserID(int userID);
    Optional<Favorite> findByUserIDAndMenuID(int userID, int menuID);
}
