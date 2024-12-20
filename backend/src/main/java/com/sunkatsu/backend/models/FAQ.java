package com.sunkatsu.backend.models;

import org.springframework.data.annotation.Id;

public class FAQ {
    
    @Id
    private String Id;
    private String question;
    private String answer;

    public void setId(String id) {
        Id = id;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public String getId() {
        return Id;
    }

    public String getQuestion() {
        return question;
    }
    
    public String getAnswer() {
        return answer;
    }
}
