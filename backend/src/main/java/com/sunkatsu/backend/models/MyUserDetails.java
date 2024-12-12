package com.sunkatsu.backend.models;

import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public class MyUserDetails implements UserDetails {

    private String id;
    private String username;
    private String password;
    private Role role;

    public MyUserDetails(Customer customer) {
        this.id = customer.getId();
        this.username = customer.getUsername();
        this.password = customer.getPassword();
        this.role = customer.getRole();
    }

    public MyUserDetails(Staff staff) {
        this.id = staff.getId();
        this.username = staff.getUsername();
        this.password = staff.getPassword();
        this.role = staff.getRole();
    }

    public MyUserDetails(Owner owner) {
        this.id = owner.getId();
        this.username = owner.getUsername();
        this.password = owner.getPassword();
        this.role = owner.getRole();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    public Role getRole(){
        return role;
    }

    public String getId(){
        return id;
    }
}
