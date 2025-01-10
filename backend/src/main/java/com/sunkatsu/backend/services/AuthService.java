package com.sunkatsu.backend.services;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.sunkatsu.backend.models.*;
import com.sunkatsu.backend.repositories.*;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final CustomerRepository customerRepository;
    private final OwnerRepository ownerRepository;
    private final StaffRepository staffRepository;
    private final SequenceGeneratorService sequenceGeneratorService;
    private final PasswordEncoder encoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public String registerCustomer(Customer customer){
        Optional<Customer> existingCustomer = customerRepository.findByUsername(customer.getUsername());
        if (existingCustomer.isPresent()){
            return "Username already exists";
        }
        customer.setPassword(encoder.encode(customer.getPassword()));
        customer.setRole(Role.CUSTOMER);
        customer.setId(String.valueOf(sequenceGeneratorService.generateSequence(Customer.SEQUENCE_NAME)));
        customerRepository.save(customer);
        return "Customer registered successfully";
    }

    public String loginUser(String username, String password){
        // Check di Customer
        Optional<Customer> customer = customerRepository.findByUsername(username);
        if (customer.isPresent() && encoder.matches(password, customer.get().getPassword())) {
            return jwtService.generateToken(new MyUserDetails(customer.get()));
        }

        // Check di Staff
        Optional<Staff> staff = staffRepository.findByUsername(username);
        if (staff.isPresent() && encoder.matches(password, staff.get().getPassword())) {
            return jwtService.generateToken(new MyUserDetails(staff.get()));
        }

        // Check di Owner
        Optional<Owner> owner = ownerRepository.findByUsername(username);
        if (owner.isPresent() && encoder.matches(password, owner.get().getPassword())) {
            return jwtService.generateToken(new MyUserDetails(owner.get()));
        }
        throw new RuntimeException("Username atau Password salah");
    }
}
