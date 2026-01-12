package com.merkury.vulcanus.model.entities.forum;

import com.merkury.vulcanus.model.entities.Comment;
import com.merkury.vulcanus.model.entities.UserEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity(name = "post_comments")
@SuperBuilder
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class PostComment extends Comment {

    @Column(columnDefinition = "TEXT")
    private String content;

    @ManyToOne
    @JoinColumn(name = "post_id")
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Post post;

    @ManyToOne
    @JoinColumn(name = "parent_id")
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private PostComment parent;

    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private List<PostComment> replies = new ArrayList<>();

    @Builder.Default
    private Integer repliesCount = 0;
    @Builder.Default
    private Boolean isDeleted = false;

    @ManyToMany
    @JoinTable(
            name = "post_comment_up_votes",
            joinColumns = @JoinColumn(name = "comment_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    @Builder.Default
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Set<UserEntity> upVotedBy = new HashSet<>();

    @ManyToMany
    @JoinTable(
            name = "post_comment_down_votes",
            joinColumns = @JoinColumn(name = "comment_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    @Builder.Default
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Set<UserEntity> downVotedBy = new HashSet<>();

    @Builder.Default
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    @OneToMany(mappedBy = "postComment", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PostCommentMedia> media = new ArrayList<>();
}
