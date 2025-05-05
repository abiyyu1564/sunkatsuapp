package com.sunkatsu.backend.controllers;

import com.sunkatsu.backend.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sunkatsu.backend.services.AuthService;
import com.sunkatsu.backend.models.*;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<String> registerCustomer(@RequestBody Customer customer) {
        String result = authService.registerCustomer(customer);
        if (result.equals("Customer registered successfully")) {
            return ResponseEntity.ok(result);
        } 
        return ResponseEntity.badRequest().body(result);
        
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User user) {
        try {
            String token = authService.loginUser(user.getUsername(), user.getPassword());
            return ResponseEntity.ok(Map.of("message", "Login successful!", "token", token));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid username or password"));
        }
    }
}
