package com.merkury.vulcanus.model.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "password_reset_token")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class PasswordResetToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private UUID token;
    @Builder.Default
    private LocalDateTime expirationDate = LocalDateTime.now().plusMinutes(15);
    @Column(nullable = false, unique=true)
    private String userEmail;
}
