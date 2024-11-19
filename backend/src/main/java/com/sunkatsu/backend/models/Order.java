package com.sunkatsu.backend.models;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Date;
import java.util.List;

import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonFormat;

@Document(collection = "orders")
public class Order extends ShoppingCart {
    @Indexed(expireAfterSeconds = 7200)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX", timezone = "Asia/Jakarta")
    private Date paymentDeadline;
    private String status;

    @Transient
    public static final String SEQUENCE_NAME = "order_sequence";

     public Order(int id, int total, String deliver, int UserID, List<CartItem> cartItems, Date paymentDeadline, String status) {
        super(id, total, deliver, UserID, cartItems);
        this.paymentDeadline = paymentDeadline;
        this.status = status;
        updatePaymentDeadline();
    }

    private void updatePaymentDeadline() {
        if ("Accepted".equals(this.status) || "Finished".equals(this.status)) {
            // Disable TTL by setting paymentDeadline to null
            this.paymentDeadline = null;
        }
    }

    public static Date calculatePaymentDeadline() {
        // Zona waktu Asia/Jakarta
        ZonedDateTime zonedDateTime = ZonedDateTime.now(ZoneId.of("Asia/Jakarta")).plusHours(2);
        // Konversi ke Date
        return Date.from(zonedDateTime.toInstant());
    }


    public Order() {
    }

    public Order(Date paymentDeadline, String status) {
        this.paymentDeadline = paymentDeadline;
        this.status = status;
    }

    public Date getPaymentDeadline() {
        return this.paymentDeadline;
    }

    public void setPaymentDeadline(Date paymentDeadline) {
        this.paymentDeadline = paymentDeadline;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
        updatePaymentDeadline();
    }
}
