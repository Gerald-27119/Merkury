package com.merkury.vulcanus.model.entities;

import com.merkury.vulcanus.model.interfaces.Votable;
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
public abstract class Comment implements Votable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Builder.Default
    private Integer upVotes = 0;
    @Builder.Default
    private Integer downVotes = 0;

    @Builder.Default
    private LocalDateTime publishDate = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "author_id")
    private UserEntity author;
}
