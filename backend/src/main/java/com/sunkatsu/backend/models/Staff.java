package com.sunkatsu.backend.models;

public class Staff extends User {
    private String roleDetail;

    public Staff() {
    }

    public Staff(String id, String username, String password, String role, String rd) {
        super(id,username,password,role);
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
}
