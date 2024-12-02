package com.sunkatsu.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.sunkatsu.backend.models.*;
import com.sunkatsu.backend.repositories.*;
import java.util.Optional;

@Service
public class AuthService {
    
    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private OwnerRepository ownerRepository;

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private SequenceGeneratorService sequenceGeneratorService;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public String registerCustomer(Customer customer){
        Optional<Customer> existingCustomer = customerRepository.findByUsername(customer.getUsername());
        if (existingCustomer.isPresent()){
            return "Username already exists";
        }

        customer.setPassword(encoder.encode(customer.getPassword()));
        customer.setRole("customer");
        customer.setId(String.valueOf(sequenceGeneratorService.generateSequence(Customer.SEQUENCE_NAME)));
        customerRepository.save(customer);
        return "Customer registered successfully";
    }

    public Optional<? extends User> loginUser(String username, String password){
        // Check di Customer
        Optional<Customer> customer = customerRepository.findByUsername(username);
        if (customer.isPresent() && encoder.matches(password, customer.get().getPassword())) {
            return customer;
        }

        // Check di Staff
        Optional<Staff> staff = staffRepository.findByUsername(username);
        if (staff.isPresent() && encoder.matches(password, staff.get().getPassword())) {
            return staff;
        }

        // Check di Owner
        Optional<Owner> owner = ownerRepository.findByUsername(username);
        if (owner.isPresent() && encoder.matches(password, owner.get().getPassword())) {
            return owner;
        }
        return Optional.empty();
    }
}
