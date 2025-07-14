package com.merkury.vulcanus.test.chat;

import com.merkury.vulcanus.model.dtos.chat.ChatMessageDto;
import com.merkury.vulcanus.model.dtos.chat.ChatMessageSenderDto;
import com.merkury.vulcanus.model.repositories.UserEntityRepository;
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
import org.springframework.web.socket.sockjs.client.SockJsClient;
import org.springframework.web.socket.sockjs.client.Transport;
import org.springframework.web.socket.sockjs.client.WebSocketTransport;

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
    private final UserEntityRepository userEntityRepository;

    /**
     * First run 10s after startup, then every 20s.
     */
    @Scheduled(fixedRate = 20_000, initialDelay = 10_000)
    public void scheduledSendTestMessage() {
        var user = userEntityRepository.findByUsername("user")
                .orElseThrow();

        var sender = ChatMessageSenderDto.builder()
                .id(user.getId())
                .name(user.getUsername())
                .build();

        var message = ChatMessageDto.builder()
                .content("Test message from ChatTestService " +
                        LocalDateTime.now().getHour() + ":" +
                        LocalDateTime.now().getMinute() + ":" +
                        LocalDateTime.now().getSecond())
                .chatId(1L)
                .sender(sender)
                .build();

        sendTestMessage(message.chatId(), message);
    }

    public void sendTestMessage(Long chatId, ChatMessageDto message) {
        log.info("Wysyłam wiadomość: {}", message);
        String loginUrl     = "http://localhost:8080/public/account/login";
        String websocketUrl = "http://localhost:8080/connect"; // SockJS endpoint is still HTTP

        try {
            // 1. Login and grab JWT_token cookie
            Map<String, String> loginPayload = Map.of(
                    "username", "user",
                    "password", "password"
            );
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, String>> loginRequest = new HttpEntity<>(loginPayload, headers);

            ResponseEntity<String> loginResponse = restTemplate.exchange(
                    loginUrl, HttpMethod.POST, loginRequest, String.class
            );

            var cookies = loginResponse.getHeaders().get(HttpHeaders.SET_COOKIE);
            if (cookies == null || cookies.isEmpty()) {
                log.error("Brak ciasteczka sesyjnego!");
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
                log.error("Nie znaleziono ciasteczka JWT_token!");
                return;
            }

            // 2. Prepare SockJS-backed STOMP client
            WebSocketHttpHeaders wsHeaders = new WebSocketHttpHeaders();
            wsHeaders.add(HttpHeaders.COOKIE, sessionCookie);

            // under-the-hood SockJS transport
            List<Transport> transports = List.of(
                    new WebSocketTransport(new StandardWebSocketClient())
            );
            SockJsClient sockJsClient = new SockJsClient(transports);
            WebSocketStompClient stompClient = new WebSocketStompClient(sockJsClient);
            stompClient.setMessageConverter(new MappingJackson2MessageConverter());

            // 3. Connect and send
            StompSession session = stompClient
                    .connect(websocketUrl, wsHeaders, new StompSessionHandlerAdapter() {})
                    .get(1, TimeUnit.SECONDS);

            session.send("/app/send/" + chatId + "/message", message);

        } catch (InterruptedException | ExecutionException | TimeoutException e) {
            log.error("Błąd połączenia WebSocket/SockJS", e);
        } catch (Exception e) {
            log.error("Nieoczekiwany błąd podczas logowania lub łączenia", e);
        }
    }
}
