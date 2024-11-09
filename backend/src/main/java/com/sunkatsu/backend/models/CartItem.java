package com.sunkatsu.backend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;


@Document(collection = "cart_items")
public class CartItem {
    @Id
    private int id;
    private String note;
    private int quantity;
    private Menu menu;

    @Transient
    public static final String SEQUENCE_NAME = "cart_item_sequence";

    public CartItem() {
    }

    public CartItem(int id, String note, int quantity, Menu menu) {
        this.id = id;
        this.note = note;
        this.quantity = quantity;
        this.menu = menu;
    }

    public int getId() {
        return this.id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNote() {
        return this.note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public int getQuantity() {
        return this.quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public Menu getMenu() {
        return this.menu;
    }

    public void setMenu(Menu menu) {
        this.menu = menu;
    }

    public CartItem id(int id) {
        setId(id);
        return this;
    }
}
