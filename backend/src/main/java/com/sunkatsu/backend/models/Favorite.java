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
    private int menuID;
    private int userID;

    public Favorite(){};

    public Favorite(int id, int t, int mId, int uId){
        this.ID = id;
        this.timesBought = t;
        this.menuID = mId;
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
    public int getMenuID(){
        return this.menuID;
    }
    public int getUserID(){
        return this.userID;
    }

    public void setTimesBought(int timesBought){
        this.timesBought = timesBought;
    }
    public void setMenuID(int menuID){
        this.menuID = menuID;
    }
    public void setUserID(int userID){
        this.userID = userID;
    }
}