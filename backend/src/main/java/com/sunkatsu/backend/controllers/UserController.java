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

import com.sunkatsu.backend.dto.Message;
import com.sunkatsu.backend.dto.UserDTO;
import com.sunkatsu.backend.models.CustomerId;
import com.sunkatsu.backend.models.User;
import com.sunkatsu.backend.services.UserService;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;

    @MessageMapping("/user.searchUser")
    @SendTo("/user/public")
    public UserDTO findUserById(@Payload String customerId) {
        User user = userService.findUserById(customerId);
        if (user != null) {
            System.out.println("CURRENT USER ID " + user.getId());
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

    @Operation(
        summary = "Get user by id",
        description = "Get user by id"
    )
    @GetMapping("/{id}")
    public ResponseEntity<Object> getUserById(@PathVariable String id) {
        var user = userService.findUserById(id);
        return user != null ? ResponseEntity.ok(userService.convertToDTO(user)) : ResponseEntity.badRequest().body(new Message("Error : Id not found"));
    }

    @Operation(
        summary = "Get all connected users except its id",
        description = "Get all connected users except its id"
    )
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