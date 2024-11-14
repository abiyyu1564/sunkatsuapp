package com.sunkatsu.backend.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.sunkatsu.backend.models.ChatMessage;
import java.util.List;


public interface ChatMessageRepository extends MongoRepository<ChatMessage, String> {
    List<ChatMessage> findByChatId(String chatId);
}
