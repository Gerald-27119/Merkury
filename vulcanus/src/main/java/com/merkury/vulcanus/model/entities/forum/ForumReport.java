package com.merkury.vulcanus.model.entities.forum;

import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.enums.forum.ForumReportReason;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@MappedSuperclass
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public abstract class ForumReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Builder.Default
    private LocalDateTime reportDate = LocalDateTime.now();
    @Builder.Default
    private ForumReportReason reason = ForumReportReason.INAPPROPRIATE_CONTENT;
    private String details;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserEntity user;

}
