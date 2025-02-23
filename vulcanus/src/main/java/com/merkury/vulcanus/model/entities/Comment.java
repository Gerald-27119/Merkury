package com.merkury.vulcanus.model.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity(name = "comments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String text;
    @Builder.Default
    private Double rating = 0.0;
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

    @ManyToOne
    @JoinColumn(name = "spot_id")
    @ToString.Exclude
    private Spot spot;

    @Builder.Default
    private LocalDateTime publishDate = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "author_id")
    private UserEntity author;
}
