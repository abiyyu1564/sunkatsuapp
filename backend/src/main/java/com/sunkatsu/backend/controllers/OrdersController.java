package com.sunkatsu.backend.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sunkatsu.backend.models.Order;
import com.sunkatsu.backend.services.OrderService;

import io.swagger.v3.oas.annotations.parameters.RequestBody;

@RestController
@RequestMapping("/api/orders")
public class OrdersController {
    @Autowired
    private OrderService orderService;

    @GetMapping
    public List<Order> getOrders(){
        return orderService.getAllOrder();
    }

    @GetMapping("/{status}")
    public List<Order> getOrderByStatus(@PathVariable String status) {
        return orderService.getOrderByStatus(status);
    } 

    @DeleteMapping("/{id}")
    public void deleteOrder(@PathVariable int id) throws Exception {
        orderService.deleteOrder(id);
    }

    @PostMapping
    public ResponseEntity<Order> createOrder(
        @RequestParam int total,
        @RequestParam String deliver,
        @RequestParam int userId
    ) {
        Order order = orderService.createOrder(total, deliver, userId);
        return order != null ? ResponseEntity.ok(order) : ResponseEntity.badRequest().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Order> updateOrder(
        @PathVariable int id,
        @RequestBody Order order
    ) {
        Order updatedOrder = orderService.updateOrder(id, order);
        return updatedOrder != null ? ResponseEntity.ok(updatedOrder) : ResponseEntity.badRequest().build();
    }

    @PutMapping("/{id}/accept")
    public ResponseEntity<Order> acceptOrder(@PathVariable int id) throws Exception {
        Order order = orderService.acceptOrder(id);
        return order != null ? ResponseEntity.ok(order) : ResponseEntity.badRequest().build();
    }

    @PutMapping("/{id}/finish")
    public ResponseEntity<Order> finishOrder(@PathVariable int id) throws Exception {
        Order order = orderService.finishOrder(id);
        return order != null ? ResponseEntity.ok(order) : ResponseEntity.badRequest().build();
    }
}
