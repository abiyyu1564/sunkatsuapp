package com.sunkatsu.backend.controllers;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

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

import com.sunkatsu.backend.dto.Message;
import com.sunkatsu.backend.models.Order;
import com.sunkatsu.backend.services.OrderService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.parameters.RequestBody;

@RestController
@RequestMapping("/api/orders")
public class OrdersController {
    @Autowired
    private OrderService orderService;

    @Operation(
        summary = "Get all orders",
        description = "Get all orders"
    )
    @GetMapping
    public List<Order> getOrders(){
        orderService.checkOrderToCancel();
        return orderService.getAllOrder();
    }

    @Operation(
        summary = "Get Order by Status",
        description = "Get Order by Status"
    )
    @GetMapping("/{status}")
    public ResponseEntity<Object> getOrderByStatus(@PathVariable String status) {
        try {
            status = URLDecoder.decode(status, StandardCharsets.UTF_8.toString());
        } catch(Exception e) {
            return ResponseEntity.badRequest().body(new Message("Error : Input tidak valid"));
        }
        if (status != "Not Paid" || status != "Accepted" || status != "Finished" || status != "Canceled") {
            return ResponseEntity.badRequest().body(new Message("Error : Invalid status!"));
        }
        return ResponseEntity.ok().body(orderService.getOrderByStatus(status));
    } 

    @Operation(
        summary="Delete an order by id",
        description="Delete an order by id"
    )
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteOrder(@PathVariable int id) {
        var order = orderService.findOrderById(id);
        if (order != null) {
            try {
                orderService.deleteOrder(id);
                return ResponseEntity.ok().body(new Message("Error : Order deleted"));
            } catch (Exception e) {
                return ResponseEntity.internalServerError().body(new Message("Error: "+ e.getMessage()));
            }
        }
        return ResponseEntity.badRequest().body(new Message("Error : Failed to delete order"));
    }

    @Operation(
        summary="Create a new order",
        description="Create a new order"
    )
    @PostMapping
    public ResponseEntity<Object> createOrder(
        @RequestParam int total,
        @RequestParam String deliver,
        @RequestParam int userId
    ) {
        Pattern pattern = Pattern.compile("[^a-z0-9 ]", Pattern.CASE_INSENSITIVE);
        Matcher matchDeliver = pattern.matcher(deliver);
        if (matchDeliver.find()) {
            return ResponseEntity.badRequest().body(new Message("Error : Invalid deliver method"));
        }
        Order order = orderService.createOrder(total, deliver, userId);
        return order != null ? ResponseEntity.ok(order) : ResponseEntity.badRequest().build();
    }

    @Operation(
        summary="Update an order",
        description="Update an order"
    )
    @PutMapping("/{id}")
    public ResponseEntity<Object> updateOrder(
        @PathVariable int id,
        @RequestBody Order order
    ) {
        Order updatedOrder = orderService.updateOrder(id, order);
        return updatedOrder != null ? ResponseEntity.ok(updatedOrder) : ResponseEntity.badRequest().body(new Message("Error : Failed to update order"));
    }

    @Operation(
        summary="Accept an order",
        description="Accept an order, changes its status to Accepted"
    )
    @PutMapping("/{id}/accept")
    public ResponseEntity<Object> acceptOrder(@PathVariable int id) {
        Order order = orderService.acceptOrder(id);
        return order != null ? ResponseEntity.ok(order) : ResponseEntity.badRequest().body(new Message("Error : Failed to accept order"));
    }

    @Operation(
        summary="Finish an order",
        description="Finish an order, changes its status to Finished"
    )
    @PutMapping("/{id}/finish")
    public ResponseEntity<Object> finishOrder(@PathVariable int id) {
        Order order = orderService.finishOrder(id);
        return order != null ? ResponseEntity.ok(order) : ResponseEntity.badRequest().body(new Message("Error : Failed to finish order"));
    }
}
