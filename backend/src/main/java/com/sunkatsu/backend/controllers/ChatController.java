package com.sunkatsu.backend.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.sunkatsu.backend.dto.Message;
import com.sunkatsu.backend.models.ChatMessage;
import com.sunkatsu.backend.models.ChatNotification;
import com.sunkatsu.backend.services.ChatMessageService;

import io.micrometer.core.ipc.http.HttpSender.Response;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequiredArgsConstructor
public class ChatController {
    private final SimpMessagingTemplate messagingTemplate;
    private final ChatMessageService chatMessageService;

    @MessageMapping("/chat")
    public void processMessage(@Payload ChatMessage chatMessage) {
        ChatMessage savedMsg = chatMessageService.save(chatMessage);

        String previewText = savedMsg.getContent();
        if ((previewText == null || previewText.isBlank()) && savedMsg.getImageUrl() != null) {
            previewText = "📷 Image";
        }

        messagingTemplate.convertAndSendToUser(
                chatMessage.getRecipientId(), "/queue/messages",
                new ChatNotification(
                        savedMsg.getId(),
                        savedMsg.getSenderId(),
                        savedMsg.getRecipientId(),
                        previewText
                )
        );
    }


    @Operation(
        summary = "Get all chat messages",
        description = "Get all chat messages by recipient and sender id"
    )
    @GetMapping("/messages/{senderId}/{recipientId}")
    public ResponseEntity<List<ChatMessage>> findChatMessages(
            @PathVariable String senderId, 
            @PathVariable String recipientId) {
        return ResponseEntity
                .ok(chatMessageService.findChatMessages(senderId, recipientId));
    }

    @Operation(
        summary = "Update a chat message",
        description = "Update a single chat message by id"
    )
    @PutMapping("/messages/{id}")
    public ResponseEntity<Object> putMethodName(@PathVariable String id, @RequestBody String newContent) {
        ChatMessage updated = chatMessageService.updateMessage(id, newContent);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.badRequest().body(new Message("Error: id not found")) ;
    }


    @Operation(
        summary = "Delete a chat message",
        description = "Delete a single chat message by id"
    )
    @DeleteMapping("/messages/{id}")
    public ResponseEntity<Object> deleteMessage(@PathVariable String id) {
        if (chatMessageService.deleteMessage(id)) {
            return ResponseEntity.ok(new Message("Delete message successfully"));
        } else {
            return ResponseEntity.badRequest().body(new Message("Error: id not found"));
        }
    }
}


