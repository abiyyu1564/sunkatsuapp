package com.sunkatsu.backend.services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.sunkatsu.backend.models.ChatMessage;
import com.sunkatsu.backend.repositories.ChatMessageRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatMessageService {
    private final ChatMessageRepository repository;
    private final ChatRoomService chatRoomService;

    public ChatMessage save(ChatMessage chatMessage) {
        var chatId = chatRoomService
                .getChatRoomId(chatMessage.getSenderId(), chatMessage.getRecipientId(), true)
                .orElseThrow(); 
        chatMessage.setChatId(chatId);
        repository.save(chatMessage);
        return chatMessage;
    }

    public List<ChatMessage> findChatMessages(String senderId, String recipientId) {
        var chatId = chatRoomService.getChatRoomId(senderId, recipientId, false);
        if(chatId.isPresent()) {
            return repository.findByChatId(chatId.get());
        } else {
            // Log a message if the chat room doesn't exist
            System.out.println("Chat room not found for senderId: " + senderId + " and recipientId: " + recipientId);
            return new ArrayList<>(); // Return an empty list if no chat room is found
        }
    }
    
}
