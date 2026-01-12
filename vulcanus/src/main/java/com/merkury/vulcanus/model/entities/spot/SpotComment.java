package com.merkury.vulcanus.model.entities.spot;

import com.merkury.vulcanus.model.entities.Comment;
import com.merkury.vulcanus.model.entities.UserEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.*;

@Entity(name = "spot_comments")
@SuperBuilder
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class SpotComment extends Comment {

    @Column(length = 300)
    private String text;

    @Builder.Default
    private Double rating = 0.0;

    @Builder.Default
    private LocalDateTime publishDate = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "spot_id")
    @ToString.Exclude
    private Spot spot;

    @OneToMany(mappedBy = "spotComment", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Set<SpotCommentMedia> media = new LinkedHashSet<>();

    @ManyToMany
    @JoinTable(
            name = "spot_comment_up_votes",
            joinColumns = @JoinColumn(name = "comment_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    @Builder.Default
    private Set<UserEntity> upVotedBy = new HashSet<>();

    @ManyToMany
    @JoinTable(
            name = "spot_comment_down_votes",
            joinColumns = @JoinColumn(name = "comment_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    @Builder.Default
    private Set<UserEntity> downVotedBy = new HashSet<>();
}
