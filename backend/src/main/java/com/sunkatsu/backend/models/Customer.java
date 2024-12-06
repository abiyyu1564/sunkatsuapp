package com.sunkatsu.backend.models;

import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Getter
@Setter
@Document(collection = "customers")
public class Customer extends User {
    
    @Transient
    public static final String SEQUENCE_NAME = "customer_sequence";

}

