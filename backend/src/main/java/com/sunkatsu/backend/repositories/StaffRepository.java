package com.sunkatsu.backend.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.sunkatsu.backend.models.Staff;
import com.sunkatsu.backend.models.Status;

import java.util.List;
import java.util.Optional;

@Repository
public interface StaffRepository extends MongoRepository<Staff, String> {
    Optional<Staff> findByUsername(String username);
    List<Staff> findAllByStatus(Status status);
}
