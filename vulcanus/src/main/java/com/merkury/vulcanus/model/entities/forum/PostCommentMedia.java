package com.merkury.vulcanus.model.entities.forum;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostCommentMedia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String url;

    private String type;

    @ManyToOne
    @JoinColumn(name = "post_comment_id")
    private PostComment postComment;
}
