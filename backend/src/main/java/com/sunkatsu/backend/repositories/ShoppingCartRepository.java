package com.sunkatsu.backend.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.sunkatsu.backend.models.ShoppingCart;

@Repository
public interface ShoppingCartRepository extends MongoRepository<ShoppingCart, Integer> {
    ShoppingCart findByUserID(int userID);
}  
