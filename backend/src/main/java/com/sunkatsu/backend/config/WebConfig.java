package com.sunkatsu.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") // Semua endpoint
                        .allowedOrigins("http://localhost:3000") // Batasi hanya ke frontend
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Tambahkan OPTIONS untuk preflight
                        .allowedHeaders("*") // Izinkan semua header
                        .allowCredentials(true); // Izinkan cookies/credentials jika diperlukan
            }
        };
    }
}
