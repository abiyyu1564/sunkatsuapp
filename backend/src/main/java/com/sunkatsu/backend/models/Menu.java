package com.sunkatsu.backend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

import org.springframework.data.annotation.Transient;

@Document(collection = "menus")
@Builder
@AllArgsConstructor
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
    private String category;
    private int numsBought;


    public Menu() {}

    public Menu(String name, String imageURL, String image, int price, String desc, String category, int numsBought) {
        this.name = name;
        this.imageURL = imageURL;
        this.image = image;
        this.price = price;
        this.desc = desc;
        this.category = category;
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

    public String getCategory() {
        return this.category;
    }

    public void setCategory(String category) {
        this.category = category;
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