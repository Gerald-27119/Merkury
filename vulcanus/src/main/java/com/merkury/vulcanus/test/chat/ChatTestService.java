package com.merkury.vulcanus.test.chat;

import com.merkury.vulcanus.model.dtos.chat.ChatMessageDto;
import com.merkury.vulcanus.model.dtos.chat.ChatMessageSenderDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.converter.MappingJackson2MessageConverter;
import org.springframework.messaging.simp.stomp.StompSession;
import org.springframework.messaging.simp.stomp.StompSessionHandlerAdapter;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.socket.WebSocketHttpHeaders;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.messaging.WebSocketStompClient;

import java.net.HttpCookie;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

@Slf4j
@Component
@RequiredArgsConstructor
public class ChatTestService {

    private final RestTemplate restTemplate = new RestTemplate();

    //TODO: grupwoanie wiadomosci na froncie
//TODO: naliza messagea w websokcet na froncie, nazwa usera to kłąmstwo
    //probaa logowania rped wczytaniem userow do bazy - napraw, tez trzeba uzycie credentialy przneiesc gdzies
    @Scheduled(fixedRate = 20000)
    public void scheduledSendTestMessage() {
        var sender = ChatMessageSenderDto.builder()
                .id(2L)
                .name("user2")
                .build();

        var message = ChatMessageDto.builder()
                .content("Test message from ChatTestService " + LocalDateTime.now().getHour() + ":" + LocalDateTime.now().getMinute() + ":" + LocalDateTime.now().getSecond())
                .chatId(1L)
                .sender(sender)
//                .sentAt(LocalDateTime.now())
                .build();

        sendTestMessage(message.chatId().toString(), message);
    }

    public void sendTestMessage(String chatId, ChatMessageDto message) {
        String loginUrl = "http://localhost:8080/public/account/login";
        String websocketUrl = "ws://localhost:8080/connect";

//nie powinienem wystawic ws info?
        try {
            // 1. Login and retrieve session cookie
            Map<String, String> loginPayload = Map.of(
                    "username", "user",
                    "password", "password"
            );//porpaw usera do logowania i do wiadomosci

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, String>> loginRequest = new HttpEntity<>(loginPayload, headers);

            ResponseEntity<String> loginResponse = restTemplate.exchange(
                    loginUrl,
                    HttpMethod.POST,
                    loginRequest,
                    String.class
            );

            List<String> cookies = loginResponse.getHeaders().get(HttpHeaders.SET_COOKIE);
            if (cookies == null || cookies.isEmpty()) {
                log.error("No session cookie received!");
                return;
            }

            String sessionCookie = cookies.stream()
                    .map(HttpCookie::parse)
                    .flatMap(List::stream)
                    .filter(c -> c.getName().equals("JWT_token"))
                    .findFirst()
                    .map(HttpCookie::toString)
                    .orElse(null);

            if (sessionCookie == null) {
                log.error("JWT_token cookie not found!");
                return;
            }

            // 2. Prepare WebSocket client with cookie
            WebSocketHttpHeaders wsHeaders = new WebSocketHttpHeaders();
            wsHeaders.add(HttpHeaders.COOKIE, sessionCookie);

            WebSocketStompClient stompClient = new WebSocketStompClient(new StandardWebSocketClient());

            stompClient.setMessageConverter(new MappingJackson2MessageConverter());

            StompSession session = stompClient
                    .connect(websocketUrl, wsHeaders, new StompSessionHandlerAdapter() {
                    })
                    .get(1, TimeUnit.SECONDS);

            session.send("/app/send/" + chatId + "/message", message);

        } catch (InterruptedException | ExecutionException | TimeoutException e) {
            log.error("WebSocket connection error", e);
        } catch (Exception e) {
            log.error("Unexpected error during login or connection", e);
        }
    }
}

