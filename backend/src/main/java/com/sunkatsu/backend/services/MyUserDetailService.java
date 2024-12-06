package com.sunkatsu.backend.services;

import com.sunkatsu.backend.models.*;
import com.sunkatsu.backend.repositories.CustomerRepository;
import com.sunkatsu.backend.repositories.OwnerRepository;
import com.sunkatsu.backend.repositories.StaffRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MyUserDetailService implements UserDetailsService {

    private final CustomerRepository customerRepository;
    private final StaffRepository staffRepository;
    private final OwnerRepository ownerRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        Optional<Customer> customer = customerRepository.findByUsername(username);
        if (customer.isPresent()){
            return new MyUserDetails(customer.get());
        }

        Optional<Staff> staff = staffRepository.findByUsername(username);
        if (staff.isPresent()){
            return new MyUserDetails(staff.get());
        }

        Optional<Owner> owner = ownerRepository.findByUsername(username);
        if (owner.isPresent()){
            return new MyUserDetails(owner.get());
        }

        throw new UsernameNotFoundException("Username tidak ditemukan");
    }
}
