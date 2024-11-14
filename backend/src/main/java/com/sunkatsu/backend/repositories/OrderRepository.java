package com.sunkatsu.backend.repositories;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.sunkatsu.backend.models.Order;

public interface OrderRepository extends MongoRepository<Order, Integer> {
    Order findByUserID(int userID);
    List<Order> findAllByStatus(String status);
}
