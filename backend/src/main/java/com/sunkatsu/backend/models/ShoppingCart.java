package com.sunkatsu.backend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;
import java.util.ArrayList;

@Document(collection = "carts")
public class ShoppingCart {
    @Id
    private int id;
    private int total;
    private String deliver;
    private int userID;
    private List<CartItem> cartItems = new ArrayList<>();

    @Transient
    public static final String SEQUENCE_NAME = "cart_sequence";

    public ShoppingCart(int uid) {
        userID = uid;
    }

    public ShoppingCart() {
    }

    public ShoppingCart(int id, int total, String deliver, int UserID, List<CartItem> cartItems) {
        this.id = id;
        this.total = total;
        this.deliver = deliver;
        this.userID = UserID;
        this.cartItems = cartItems;
    }

    public int getId() {
        return this.id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getTotal() {
        return this.total;
    }

    public void setTotal(int total) {
        this.total = total;
    }

    public String getDeliver() {
        return this.deliver;
    }

    public void setDeliver(String deliver) {
        this.deliver = deliver;
    }

    public int getUserID() {
        return this.userID;
    }

    public void setUserID(int UserID) {
        this.userID = UserID;
    }

    public List<CartItem> getCartItems() {
        return this.cartItems;
    }

    public void setCartItems(List<CartItem> cartItems) {
        this.cartItems = cartItems;
    }

    public ShoppingCart id(int id) {
        setId(id);
        return this;
    }

    public ShoppingCart total(int total) {
        setTotal(total);
        return this;
    }

    public ShoppingCart deliver(String deliver) {
        setDeliver(deliver);
        return this;
    }

    public ShoppingCart UserID(int UserID) {
        setUserID(UserID);
        return this;
    }

    public ShoppingCart cartItems(List<CartItem> cartItems) {
        setCartItems(cartItems);
        return this;
    }



    // Method to add an item to cart and calculate the total price
    public void addCartItem(CartItem cartItem) {
        this.cartItems.add(cartItem);
        this.total += cartItem.getMenu().getPrice() * cartItem.getQuantity();
    }

    public void calculateTotal() {
        this.total = this.cartItems.stream()
                .mapToInt(item -> item.getMenu().getPrice() * item.getQuantity())
                .sum();
    }
}
