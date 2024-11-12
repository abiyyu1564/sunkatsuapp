package com.sunkatsu.backend.controllers;

import com.sunkatsu.backend.models.Customer;
import com.sunkatsu.backend.models.ShoppingCart;
import com.sunkatsu.backend.services.CustomerService;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
public class CustomerController {
    @Autowired
    private CustomerService customerService;

    @GetMapping("/api/customers")
    public List<Customer> getAllCustomers() {
        return customerService.findAllCustomers();
    }

    @MessageMapping("/user.addUser")
    @SendTo("/user/public")
    public Customer addUser(
            @Payload Customer customer
    ) {
        customerService.saveCustomer(customer);
        return customer;
    }

    
    @MessageMapping("/user.searchCustomer")
    @SendTo("/user/public")
    public Customer searchCustomer(@Payload Customer customer) {
        String id = customer.getId();
        String password = customer.getPassword();
        Customer foundCustomer = customerService.getCustomerByIdAndPassword(id, password);
        if(foundCustomer != null) {
            customerService.saveCustomer(foundCustomer);
            return foundCustomer;
        }
        return null;
    }


    @GetMapping("/api/customers/{id}")
    public ResponseEntity<Customer> getCustomerById(@PathVariable String id) {
        Customer customer = customerService.getCustomerById(id);
        return customer != null ? ResponseEntity.ok(customer) : ResponseEntity.notFound().build();
    }

    @GetMapping("/api/customers/{id}/cart")
    public ResponseEntity<ShoppingCart> getCartByCustomerId(@PathVariable String id) {
        ShoppingCart cart = customerService.getCartByCustomerId(id);
        return cart != null ? ResponseEntity.ok(cart) : ResponseEntity.notFound().build();
    }

    @MessageMapping("/user.disconnectUser")
    @SendTo("/user/public")
    public Customer disconnectUser(
            @Payload Customer customer
    ) {
        customerService.disconnect(customer);
        return customer;
    }

    @GetMapping("/users")
    public ResponseEntity<List<Customer>> findConnectedUsers() {
        return ResponseEntity.ok(customerService.findConnectedUsers());
    }
}
