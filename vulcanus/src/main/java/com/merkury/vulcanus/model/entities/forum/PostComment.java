package com.merkury.vulcanus.model.entities.forum;

import com.merkury.vulcanus.model.entities.Comment;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity(name = "post_comments")
@SuperBuilder
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class PostComment extends Comment {

    @ManyToOne
    @JoinColumn(name = "post_id")
    @ToString.Exclude
    private Post post;
}
