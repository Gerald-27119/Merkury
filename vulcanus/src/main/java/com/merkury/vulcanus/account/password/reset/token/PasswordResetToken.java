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
    private long id;
    private UUID token;
    private LocalDateTime expirationDate;
    @OneToOne(mappedBy = "passwordResetToken")
    private UserEntity user;

    public PasswordResetToken(UUID token, LocalDateTime expirationDate, UserEntity user) {
        this.token = token;
        this.expirationDate = expirationDate;
        this.user = user;
    }
}
