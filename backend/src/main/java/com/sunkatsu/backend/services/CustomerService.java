package com.sunkatsu.backend.services;

import com.sunkatsu.backend.models.*;
import com.sunkatsu.backend.repositories.CustomerRepository;
import com.sunkatsu.backend.repositories.ShoppingCartRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CustomerService {
    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private ShoppingCartRepository cartRepository;

    @Autowired
    private SequenceGeneratorService sequenceGeneratorService;

    public List<Customer> findAllCustomers() {
        return customerRepository.findAll();
    }

    public Customer createCustomer(Customer customer) {
        customer.setId(sequenceGeneratorService.generateSequence(Customer.SEQUENCE_NAME));
        return customerRepository.save(customer);
    }

    public Customer getCustomerById(int id) {
        return customerRepository.findById(id).orElse(null);
    }

    public ShoppingCart getCartByCustomerId(int id) {
        Optional<Customer> c = customerRepository.findById(id);

        if (c.isPresent()) {
            ShoppingCart cart = cartRepository.findByUserID(id);
            return cart;
        }
        return null;
    }

}
