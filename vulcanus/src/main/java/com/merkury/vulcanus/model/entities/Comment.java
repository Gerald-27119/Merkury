package com.merkury.vulcanus.model.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@MappedSuperclass
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public abstract class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 300)
    private String text;

    @Builder.Default
    private Integer upvotes = 0;
    @Builder.Default
    private Integer downvotes = 0;

    @Builder.Default
    @ManyToMany
    @JoinTable(
            name = "comment_upvotes",
            joinColumns = @JoinColumn(name = "comment_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<UserEntity> upvotedBy = new HashSet<>();

    @Builder.Default
    @ManyToMany
    @JoinTable(
            name = "comment_downvotes",
            joinColumns = @JoinColumn(name = "comment_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<UserEntity> downvotedBy = new HashSet<>();

    @Builder.Default
    private LocalDateTime publishDate = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "author_id")
    private UserEntity author;
}
