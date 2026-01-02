package com.merkury.vulcanus.model.entities.forum;

import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.interfaces.Votable;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity(name = "posts")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Post implements Votable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    @ManyToOne
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    @JoinColumn(name = "author_id")
    private UserEntity author;
    @ManyToOne
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    @JoinColumn(name = "category_id")
    private PostCategory postCategory;

    @Builder.Default
    private LocalDateTime publishDate = LocalDateTime.now();
    @Builder.Default
    private Integer views = 0;
    @Builder.Default
    private Integer upVotes = 0;
    @Builder.Default
    private Integer downVotes = 0;

    @Builder.Default
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @OrderBy("publishDate DESC")
    private List<PostComment> comments = new ArrayList<>();

    @Builder.Default
    private Integer commentsCount = 0;

    @Builder.Default
    private Integer trendingScore = 0;

    @Builder.Default
    @ManyToMany
    @JoinTable(
            name = "post_upVotes",
            joinColumns = @JoinColumn(name = "post_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Set<UserEntity> upVotedBy = new HashSet<>();

    @Builder.Default
    @ManyToMany
    @JoinTable(
            name = "post_downVotes",
            joinColumns = @JoinColumn(name = "post_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Set<UserEntity> downVotedBy = new HashSet<>();


    @Builder.Default
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    @ManyToMany(mappedBy = "followedPosts")
    private Set<UserEntity> followers = new HashSet<>();


    @Builder.Default
    @ManyToMany
    @JoinTable(
            name = "post_tags",
            joinColumns = @JoinColumn(name = "post_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Set<Tag> tags = new HashSet<>();

    @Builder.Default
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PostMedia> media = new ArrayList<>();
}
