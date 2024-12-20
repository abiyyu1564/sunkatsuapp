package com.sunkatsu.backend.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.sunkatsu.backend.models.FAQ;

public interface FAQRepository extends MongoRepository<FAQ, String> {
}



