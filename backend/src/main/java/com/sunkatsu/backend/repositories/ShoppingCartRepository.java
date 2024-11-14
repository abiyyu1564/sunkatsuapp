package com.sunkatsu.backend.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.sunkatsu.backend.models.ShoppingCart;


public interface ShoppingCartRepository extends MongoRepository<ShoppingCart, Integer> {
    ShoppingCart findByUserID(String userID);
}  
