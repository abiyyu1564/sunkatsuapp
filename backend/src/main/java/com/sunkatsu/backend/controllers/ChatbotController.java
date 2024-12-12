package com.sunkatsu.backend.controllers;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import reactor.core.publisher.Flux;

@RestController
public class ChatbotController {
    private final ChatClient chatClient;

    public ChatbotController(ChatClient.Builder builder) {
        this.chatClient = builder
                    .build();
    }

    @PostMapping("/chatbot")
    public String chat (@RequestParam String message) {
        return chatClient.prompt()
                    .system("Anda adalah asisten FAQ untuk aplikasi pemesanan makanan Sunkatsu. Jawablah setiap pertanyaan dengan jelas dan singkat, menggunakan informasi yang relevan dari dokumen FAQ berikut: [Tambahkan dokumen FAQ, masih WIP]. Jika Anda tidak tahu jawabannya, katakan 'Maaf, saya tidak dapat menjawab pertanyaan tersebut.'")
                    .user(message)
                    .call()
                    .content();
    }

    @GetMapping("/stream")
    public Flux<String> chatWithStream(@RequestParam String message) {
        return chatClient.prompt()
                    .system("Anda adalah asisten FAQ untuk aplikasi pemesanan makanan Sunkatsu. Jawablah setiap pertanyaan dengan jelas dan singkat, menggunakan informasi yang relevan dari dokumen FAQ berikut: [Tambahkan dokumen FAQ, masih WIP]. Jika Anda tidak tahu jawabannya, katakan 'Maaf, saya tidak dapat menjawab pertanyaan tersebut.'")
                    .user(message)
                    .stream()
                    .content();
    }
}
