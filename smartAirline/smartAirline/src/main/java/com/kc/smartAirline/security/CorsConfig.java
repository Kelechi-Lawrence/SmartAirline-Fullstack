package com.kc.smartAirline.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer mvcConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") // all endpoints
                        .allowedOrigins("http://localhost:5173") // frontend url
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // include OPTIONS
                        .allowedHeaders("*")
                        .allowCredentials(true); // cookies
            }
        };
    }
}