package com.sunkatsu.backend.models;

import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Document(collection = "customers")
public class Customer extends User {
    protected Status status;
    
    @Transient
    public static final String SEQUENCE_NAME = "customer_sequence";

    
}

