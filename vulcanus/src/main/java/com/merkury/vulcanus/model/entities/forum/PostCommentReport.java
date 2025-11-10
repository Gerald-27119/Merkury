package com.merkury.vulcanus.model.entities.forum;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity(name = "post_comment_reports")
@Data
@EqualsAndHashCode(callSuper = true)
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class PostCommentReport extends ForumReport {

    @ManyToOne
    @JoinColumn(name = "comment_id")
    private PostComment comment;
}
