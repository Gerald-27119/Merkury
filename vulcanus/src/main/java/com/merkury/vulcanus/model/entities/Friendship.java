package com.merkury.vulcanus.model.entities;

import com.merkury.vulcanus.model.enums.user.dashboard.UserFriendStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "friendships")
public class Friendship {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserEntity user;

    @ManyToOne
    @JoinColumn(name = "friend_id")
    private UserEntity friend;

    private UserFriendStatus status;
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
