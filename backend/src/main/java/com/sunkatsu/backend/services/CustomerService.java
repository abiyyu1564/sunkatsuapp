package com.sunkatsu.backend.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sunkatsu.backend.models.Customer;
import com.sunkatsu.backend.models.ShoppingCart;
import com.sunkatsu.backend.models.Status;
import com.sunkatsu.backend.repositories.CustomerRepository;
import com.sunkatsu.backend.repositories.ShoppingCartRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
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
        customer.setId(String.valueOf(sequenceGeneratorService.generateSequence(Customer.SEQUENCE_NAME)));
        return customerRepository.save(customer);
    }

    public void saveCustomer(Customer customer) {
        customer.setStatus(Status.ONLINE);
        customerRepository.save(customer);
    }

    public Customer getCustomerByIdAndPassword(String id, String password) {
        return customerRepository.findByIdAndPassword(id, password);
    }

    public Customer getCustomerById(String id) {
        return customerRepository.findById(id).orElse(null);
    }

    public ShoppingCart getCartByCustomerId(String id) {
        Optional<Customer> c = customerRepository.findById(id);

        if (c.isPresent()) {
            ShoppingCart cart = cartRepository.findByUserID(id);
            return cart;
        }
        return null;
    }

    public void disconnect(Customer customer) {
        var storedUser = customerRepository.findById(customer.getId()).orElse(null);
        if (storedUser != null) {
            storedUser.setStatus(Status.OFFLINE);
            customerRepository.save(storedUser);
        }
    }

    public List<Customer> findConnectedUsersExcept(String userId) {
    List<Customer> onlineUsers = customerRepository.findAllByStatus(Status.ONLINE);
    onlineUsers.removeIf(user -> user.getId().equals(userId));
    return onlineUsers;
}


}
