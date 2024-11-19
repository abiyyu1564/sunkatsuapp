package com.sunkatsu.backend.controllers;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sunkatsu.backend.dto.UserDTO;
import com.sunkatsu.backend.models.CustomerId;
import com.sunkatsu.backend.models.User;
import com.sunkatsu.backend.services.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;

    @MessageMapping("/user.searchUser")
    @SendTo("/user/public")
    public UserDTO findUserById(@Payload String customerId) {
        System.out.println("CURRENT CUSTOMER ID: " + customerId);
        User user = userService.findUserById(customerId);
        if (user != null) {
            userService.saveUser(user);
            return userService.convertToDTO(user);
        }
        return null;
    }


    @MessageMapping("/user.disconnectUser")
    @SendTo("/user/topic")
    public UserDTO disconnect(@Payload CustomerId customerId) {
        User user = userService.findUserById(customerId.getCustomerId());
        if (user != null) {
            userService.disconnect(user);
            return userService.convertToDTO(user);
        }
        return null;
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable String id) {
        var user = userService.findUserById(id);
        return user != null ? ResponseEntity.ok(user) : ResponseEntity.notFound().build();
    }

    @GetMapping("/status/{id}")
    public ResponseEntity<List<UserDTO>> findConnectedUsersExcept(@PathVariable String id) {
        List<UserDTO> connectedUsers = new ArrayList<>();
        List<User> users = userService.findConnectedUsersExcept(id);
        for (User u : users) {
            connectedUsers.add(userService.convertToDTO(u));
        }
        return ResponseEntity.ok(connectedUsers);
    }
}