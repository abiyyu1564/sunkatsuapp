package com.sunkatsu.backend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;

// import java.util.Objects;


@Document(collection = "favorite")
public class Favorite {

    @Transient
    public static final String SEQUENCE_NAME = "favorite_sequence";

    @Id
    private int ID;
    private int timesBought;
    private Menu menu;
    private int userID;

    public Favorite(){};

    public Favorite(int id, int t, Menu menu, int uId){
        this.ID = id;
        this.timesBought = t;
        this.menu = menu;
        this.userID = uId;
    }
    // public void setID(int ID){
    //     this.ID = ID;
    // }
    // public int getID(){
    //     return this.ID;
    // }
    public int getTimesBought(){
        return this.timesBought;
    }
    public Menu getMenu(){
        return this.menu;
    }
    public int getUserID(){
        return this.userID;
    }

    public void setTimesBought(int timesBought){
        this.timesBought = timesBought;
    }
    public void setMenu(Menu menu){
        this.menu = menu;
    }
    public void setUserID(int userID){
        this.userID = userID;
    }
}