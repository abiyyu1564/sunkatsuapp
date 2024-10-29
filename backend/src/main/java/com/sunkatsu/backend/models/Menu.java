package com.sunkatsu.backend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.annotation.Transient;

@Document(collection = "menus")
public class Menu {

    @Transient
    public static final String SEQUENCE_NAME = "menu_sequence";

    @Id
    private int id;
    private String name;
    private String imageURL;
    private String image;
    private int price;
    private String desc;
    private int numsBought;


    public Menu() {}

    public Menu(String name, String imageURL, String image, int price, String desc, int numsBought) {
        this.name = name;
        this.imageURL = imageURL;
        this.image = image;
        this.price = price;
        this.desc = desc;
        this.numsBought = numsBought;
    }

    public void setId(int id) {
        this.id = id;
    }


    public int getId() {
        return this.id;
    }


    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getImageURL() {
        return this.imageURL;
    }

    public void setImageURL(String imageURL) {
        this.imageURL = imageURL;
    }

    public String getImage() {
        return this.image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public int getPrice() {
        return this.price;
    }

    public void setPrice(int price) {
        this.price = price;
    }

    public String getDesc() {
        return this.desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    public int getNumsBought() {
        return this.numsBought;
    }

    public void setNumsBought(int numsBought) {
        this.numsBought = numsBought;
    }
    
}