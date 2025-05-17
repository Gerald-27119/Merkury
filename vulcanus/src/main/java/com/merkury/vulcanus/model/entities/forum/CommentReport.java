package com.merkury.vulcanus.model.entities.forum;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity(name = "comment_reports")
@Data
@EqualsAndHashCode(callSuper = true)
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class CommentReport extends Report {

    @ManyToOne
    @JoinColumn(name = "comment_id")
    private PostComment comment;
}
