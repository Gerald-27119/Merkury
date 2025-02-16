package com.merkury.vulcanus.model.entities;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.UUID;

@Document(collection = "password_reset_token")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class PasswordResetToken {
    @Id
    private String id;
    @Indexed(unique = true)
    private UUID token;
    @Builder.Default
    private LocalDateTime expirationDate = LocalDateTime.now().plusMinutes(15);
    private String userEmail;
}
