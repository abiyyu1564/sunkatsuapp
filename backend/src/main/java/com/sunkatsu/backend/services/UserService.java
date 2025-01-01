package com.sunkatsu.backend.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.sunkatsu.backend.models.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sunkatsu.backend.dto.UserDTO;
import com.sunkatsu.backend.repositories.CustomerRepository;
import com.sunkatsu.backend.repositories.OwnerRepository;
import com.sunkatsu.backend.repositories.StaffRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
    @Autowired
    private final CustomerRepository customerRepository;

    @Autowired
    private final StaffRepository staffRepository;

    @Autowired
    private final OwnerRepository ownerRepository;

    public User findUserById(String userId) {
        // Cari di customer
        var customer = customerRepository.findById(userId);
        if (customer.isPresent()) {
            return customer.get();
        }
        // Jika tidak ditemukan di customer, cari di staff
        var staff = staffRepository.findById(userId);
        if (staff.isPresent()) {
            return staff.get();
        }

        var owner = ownerRepository.findById(userId);
        if (owner.isPresent()) {
            return owner.get();
        }
        return null;
    }

    public void saveUser(User user) {

        if (user.getRole() == Role.CUSTOMER) {
            Optional<Customer> customerOpt = customerRepository.findById(user.getId());
            if (customerOpt.isPresent()) {
                var customer = customerOpt.get();
                customer.setStatus(Status.ONLINE);
                customerRepository.save(customer);
            } else {
                System.out.println("ID is not valid");
            }  
        } else if (user.getRole() == Role.STAFF) {
            Optional<Staff> staffOpt = staffRepository.findById(user.getId());
            if (staffOpt.isPresent()) {
                var staff = staffOpt.get();
                staff.setStatus(Status.ONLINE);
                staffRepository.save(staff);
            } else {
                System.out.println("ID is not valid");
            }
        }
    }

    public List<User> findConnectedUsersExcept(String userId) {
        List<Customer> onlineCustomers = customerRepository.findAllByStatus(Status.ONLINE);
        List<Staff> onlineStaffs = staffRepository.findAllByStatus(Status.ONLINE);
        List<Owner> onlineOwners = ownerRepository.findAllByStatus(Status.ONLINE);
        List<User> onlineUsers = new ArrayList<>();
        // if (onlineUsers.addAll(onlineCustomers) && onlineUsers.addAll(onlineStaffs)) {
        //     onlineUsers.removeIf(user -> user.getId().equals(userId));
        //     return onlineUsers;
        // }
        for (Customer c : onlineCustomers) {
            onlineUsers.add(c);
        }
        for (Staff s : onlineStaffs) {
            onlineUsers.add(s);
        }
        for (Owner o : onlineOwners)
            onlineUsers.add(o);
        
        onlineUsers.removeIf(user -> user.getId().equals(userId));
        return onlineUsers;
    }

    public UserDTO convertToDTO(User user) {
        return new UserDTO(
            user.getId(),
            user.getUsername(),
            user.getRole(),
            user.getStatus()
        );
    }

    public void disconnect(User user) {
        if (user.getRole() == Role.CUSTOMER) {
            Optional<Customer> customerOpt = customerRepository.findById(user.getId());
            if (customerOpt.isPresent()) {
                var customer = customerOpt.get();
                customer.setStatus(Status.OFFLINE);
                customerRepository.save(customer);
            } else {
                System.out.println("ID is not valid");
            } 
        } else if (user.getRole() == Role.STAFF) {
            Optional<Staff> staffOpt = staffRepository.findById(user.getId());
            if (staffOpt.isPresent()) {
                var staff = staffOpt.get();
                staff.setStatus(Status.OFFLINE);
                staffRepository.save(staff);
            } else {
                System.out.println("ID is not valid");
            }
        }
    }
}

