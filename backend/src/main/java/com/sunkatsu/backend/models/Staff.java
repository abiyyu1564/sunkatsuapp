package com.sunkatsu.backend.models;

import org.springframework.data.annotation.Transient;

public class Staff extends User implements Verifiable {
    private String roleDetail;

    @Transient
    public static final String SEQUENCE_NAME = "customer_sequence";

    public Staff() {
    }

    public Staff(String id, String username, String password, String role, String rd, Status status) {
        super(id,username,password,role, status);
        roleDetail = rd;
    }

    public String getRoleDetail() {
        return this.roleDetail;
    }

    public void setRoleDetail(String roleDetail) {
        this.roleDetail = roleDetail;
    }

    public void loginCheck(String username, String password) {
        if (username.equals(this.username) && password.equals(this.password)) {
            System.out.println("Login Success");
        } else{
            System.out.println("Login Failed");
        }
    }

    public boolean verify() {
        return roleDetail == "waiter" || roleDetail == "cook" || roleDetail == "cashier";
    }
}
