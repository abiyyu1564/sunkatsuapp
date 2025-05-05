package com.sunkatsu.backend.services;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sunkatsu.backend.dto.Message;
import com.sunkatsu.backend.models.ChatMessage;
import com.sunkatsu.backend.repositories.ChatMessageRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatMessageService {
    private final ChatMessageRepository repository;
    private final ChatRoomService chatRoomService;
    private final FileStorageService fileStorageService;

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
        return chatId.map(repository::findByChatId).orElse(new ArrayList<>());
    }

    public ChatMessage updateMessage(String messageId, String newContent) {
        Optional<ChatMessage> optMsg = repository.findById(messageId);
        if (optMsg.isEmpty()) {
            return null;
        }
        ChatMessage msg = optMsg.get();
        msg.setContent(newContent);
        repository.save(msg);
        return msg;
    }
    
    public boolean deleteMessage(String messageId) {
        if (!repository.existsById(messageId)) {
            return false;
        }
        Optional<ChatMessage> optMsg = repository.findById(messageId);
        ChatMessage msg = optMsg.get();
        if (msg.getImageUrl() == null) {
            repository.deleteById(messageId);
            return true;
        }
        // Delete the file from the storage
        String path = msg.getImageUrl();
        String fileName = path.substring(path.lastIndexOf('/') + 1);
        fileStorageService.deleteFile(fileName);
        repository.deleteById(messageId);
        return true;
    }
    
}

