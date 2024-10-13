package com.merkury.vulcanus.account.password.reset.token;

import com.merkury.vulcanus.account.user.UserEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "password_reset_token")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class PasswordResetToken {
    @Id
    @GeneratedValue
    private String id;
    private UUID token;
    private LocalDateTime expirationDate;
    private String userEmail;

    public PasswordResetToken(UUID token, LocalDateTime expirationDate, String userEmail) {
        this.token = token;
        this.expirationDate = expirationDate;
        this.userEmail = userEmail;
    }
}
