package com.sunkatsu.backend.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.sunkatsu.backend.models.ChatRoom;

import java.util.Optional;



public interface ChatRoomRepository extends MongoRepository<ChatRoom, String> {
    Optional<ChatRoom> findBySenderIdAndRecipientId(String senderId, String recipientId);
}
