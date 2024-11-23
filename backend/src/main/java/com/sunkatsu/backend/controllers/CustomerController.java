package com.sunkatsu.backend.controllers;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sunkatsu.backend.dto.CustomerDTO;
import com.sunkatsu.backend.dto.Message;
import com.sunkatsu.backend.models.Customer;
import com.sunkatsu.backend.models.CustomerId;
import com.sunkatsu.backend.models.Favorite;
import com.sunkatsu.backend.models.Order;
import com.sunkatsu.backend.models.ShoppingCart;
import com.sunkatsu.backend.services.CustomerService;
import com.sunkatsu.backend.services.FavoriteService;
import com.sunkatsu.backend.services.OrderService;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {
    @Autowired
    private CustomerService customerService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private FavoriteService favoriteService;

    @Operation(
        summary = "Get all customers",
        description = "Get all customers"
    )
    @GetMapping
    public ResponseEntity<List<CustomerDTO>> getAllCustomers() {
        List<Customer> listCustomer = customerService.findAllCustomers();
        List<CustomerDTO> listCustomerDTO = new ArrayList<>();
        for (Customer customer : listCustomer) {
            listCustomerDTO.add(customerService.convertToDTO(customer));
        }
        return ResponseEntity.ok(listCustomerDTO);
    }

    // @MessageMapping("/customer.createCustomer")
    // @SendTo("/customer/topic")
    // public Customer createCustomer(@Payload Customer customer) {
    //     customerService.createCustomer(customer);
    //     return customer;
    // }
    
    // @MessageMapping("/customer.searchCustomer")
    // @SendTo("/customer/public")
    // public CustomerDTO searchCustomer(@Payload CustomerId customerid) {
    //     String id = customerid.getCustomerId();
    //     Customer foundCustomer = customerService.getCustomerById(id);
    //     if(foundCustomer != null) {
    //         customerService.saveCustomer(foundCustomer);
    //         return customerService.convertToDTO(foundCustomer);
    //     }
    //     return null;
    // }

    @Operation(
        summary = "Post new customer",
        description = "Create a new customer"
    )
    @PostMapping
    public ResponseEntity<Object> addCustomerToDB(@Payload Customer customer) {
        Pattern pattern = Pattern.compile("[^a-z0-9 ]", Pattern.CASE_INSENSITIVE);
        Matcher matchUsrename = pattern.matcher(customer.getUsername());
        if (matchUsrename.find()) {
            return ResponseEntity.badRequest().body(new Message("Error : Invalid username"));
        }
        return ResponseEntity.ok(customerService.convertToDTO(customerService.createCustomer(customer)));
    }

    @Operation(
        summary = "Get customer by id",
        description = "Get customer by id"
    )
    @GetMapping("/{id}")
    public ResponseEntity<Object> getCustomerById(@PathVariable String id) {
        Customer customer = customerService.getCustomerById(id);
        if (customer == null) {
            return ResponseEntity.badRequest().body(new Message("Error : Id not found"));
        }
        return ResponseEntity.ok(customerService.convertToDTO(customer));
    }

    @Operation(
        summary = "Get cart by customer id",
        description = "Mendapatkan cart berdasarkan customer id"
    )
    @GetMapping("/{id}/cart")
    public ResponseEntity<Object> getCartByCustomerId(@PathVariable String id) {
        ShoppingCart cart = customerService.getCartByCustomerId(id);
        if (cart == null) {
            return ResponseEntity.badRequest().body(new Message("Error : Id not found"));
        }
        return ResponseEntity.ok(cart);
    }

    @Operation(
        summary = "Get orders by customer id",
        description = "Fetch all orders by customer id"
    )
    @GetMapping("/{id}/orders")
    public ResponseEntity<Object> getOrderByUserId(@PathVariable int id) {
        var order = orderService.getOrderByUserId(id);
        if (order == null) {
            return ResponseEntity.badRequest().body(new Message("Error : Id not found"));
        }
        return ResponseEntity.ok(order);
    }

    @MessageMapping("/customer.disconnectCustomer")
    @SendTo("/customer/topic")
    public Customer disconnect(@Payload CustomerId customerId) {
        Customer customer = customerService.getCustomerById(customerId.getCustomerId());
        if (customer != null) {
            customerService.disconnect(customer);
        }
        return customer;
    }

    @Operation(
        summary = "Get all favorites by user id",
        description = "Get all favorites by the inputted user id"
    )
    @GetMapping("/{id}/favorites")
    public ResponseEntity<Object> getFavoriteByUserId(@PathVariable int userId){
        List<Favorite> f = favoriteService.getFavoriteByUserId(userId);
        return f != null ? ResponseEntity.ok(f) : ResponseEntity.badRequest().body(new Message("Error : Id not found"));
    }

    @Operation(
        summary = "Get online customer except userId",
        description = "Get customer by status except the inputted customer id"
    )
    @GetMapping("/status/{customerId}")
    public ResponseEntity<Object> findConnectedUsersExcept(@PathVariable String customerId) {
        // Customer customer = customerService.getCustomerById(customerId);
        // if (customer == null) {
        //     return ResponseEntity.badRequest().body(new Message("Error: Id not found"));
        // }
        List<Customer> listCustomers = customerService.findConnectedUsersExcept(customerId);
        return ResponseEntity.ok(listCustomers);
    }

    @Operation(
        summary = "Get orders by user id",
        description = "Get all orders by user id"
    )
    @GetMapping("/{id}/orders")
    public ResponseEntity<List<Order>> getOrdersByUserId(@PathVariable String id) {
        return ResponseEntity.ok(orderService.getOrderByUserId(Integer.parseInt(id)));
    }
}
