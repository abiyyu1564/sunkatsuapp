package com.sunkatsu.backend.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import com.sunkatsu.backend.models.*;
import java.util.List;


@Repository
public interface MenuRepository extends MongoRepository<Menu, Integer> {
    List<Menu> findByCategory(String category);
}