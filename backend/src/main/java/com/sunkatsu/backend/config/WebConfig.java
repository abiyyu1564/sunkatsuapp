package com.sunkatsu.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Semua endpoint termasuk /ws/**
                .allowedOrigins("http://localhost:3000", "https://sister14-sunkatsu.azuremicroservices.io") // Batasi hanya ke frontend
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Tambahkan OPTIONS untuk preflight
                .allowedHeaders("*") // Izinkan semua header
                .allowCredentials(true); // Izinkan cookies/credentials jika diperlukan
    }

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/api/files/images/**")
                .addResourceLocations("file:" + uploadDir + "/");
    }
}
