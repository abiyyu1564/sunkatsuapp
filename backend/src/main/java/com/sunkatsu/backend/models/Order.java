package com.sunkatsu.backend.models;

import java.time.LocalDateTime;

public class Order extends Customer {

    protected int ID;
    protected int total;
    protected String deliver;
    protected int UserID;
    protected CartItem[] cartitems;
    private LocalDateTime paymentDeadline;
    private String status;

    public Order (String n, UserID uid, CartItem[] c, LocalDateTime pd){
        #bingunk
    }

    public int getUserID() {
        return UserID;
    }

    public void setUserID(int userID) {
        UserID = userID;
    }

    public LocalDateTime getPaymentDeadline() {
        return paymentDeadline;
    }

    public void setPaymentDeadline(LocalDateTime paymentDeadline) {
        this.paymentDeadline = paymentDeadline;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
    
    
}
