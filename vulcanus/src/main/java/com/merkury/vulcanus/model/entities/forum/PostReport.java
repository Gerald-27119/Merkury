package com.merkury.vulcanus.model.entities.forum;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity(name = "post_reports")
@Data
@EqualsAndHashCode(callSuper = true)
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class PostReport extends Report {

    @ManyToOne
    @JoinColumn(name = "post_id")
    private Post post;
}
