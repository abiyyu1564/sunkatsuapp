package com.sunkatsu.backend.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.sunkatsu.backend.models.Staff;
import com.sunkatsu.backend.models.Status;

import java.util.List;

@Repository
public interface StaffRepository extends MongoRepository<Staff, String> {
    Staff findByIdAndPassword(String id, String password);
    List<Staff> findAllByStatus(Status status);
}
