package com.sunkatsu.backend.models;

import org.springframework.data.annotation.Id;
import org.springframework.security.core.userdetails.UserDetails;

public class User {
    @Id
    protected String id;
    protected String username;
    protected String password;
    protected Role role;
    protected Status status;
    
    public User() {
    }

    public User(String id, String username, String password, Role role, Status status) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.role = role;
        this.status = status;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public String getUsername() {
        return this.username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return this.password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Role getRole() {
        return this.role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}