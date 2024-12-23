package com.sunkatsu.backend.repositories;

import com.sunkatsu.backend.models.Owner;
import com.sunkatsu.backend.models.Staff;
import com.sunkatsu.backend.models.Status;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OwnerRepository extends MongoRepository<Owner, String>{
    Optional<Owner> findByUsername(String username);
    List<Owner> findAllByStatus(Status status);
}
