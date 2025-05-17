package com.merkury.vulcanus.features.chat;


import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;


@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/subscribe");// <- tutaj user dostaje odpowiedź np. /topic/chat
        config.setApplicationDestinationPrefixes("/app");// <- tutaj user strzela np. /app/chat albo /app/hello
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/connect")// <- tutaj user się łączy (separate from STOMP, it's to upgrade to WebSocket)
                .setAllowedOrigins("*");
    }
}
