package com.merkury.vulcanus.model.specification;

import com.merkury.vulcanus.model.entities.forum.Post;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

public class PostSpecification {
    private PostSpecification() {
    }

    public static Specification<Post> hasPhrase(String phrase) {
        return (root, query, cb) -> {
            if (phrase == null || phrase.isBlank()) return null;
            return cb.like(cb.lower(root.get("title")), "%" + phrase.toLowerCase() + "%");
        };
    }

    public static Specification<Post> hasCategory(String category) {
        return (root, query, cb) -> {
            if (category == null || category.isBlank()) return null;
            return cb.equal(root.join("postCategory").get("name"), category);
        };
    }

    public static Specification<Post> hasTags(List<String> tags) {
        return (root, query, cb) -> {
            if (tags == null || tags.isEmpty()) return null;

            var tagJoin = root.join("tags", JoinType.LEFT);
            query.distinct(true);

            return tagJoin.get("name").in(tags);
        };
    }

    public static Specification<Post> hasFromDate(LocalDate fromDate) {
        return (root, query, cb) -> {
            if (fromDate == null) return null;

            LocalDateTime startOfDay = fromDate.atStartOfDay();
            return cb.greaterThanOrEqualTo(root.get("publishDate"), startOfDay);
        };
    }

    public static Specification<Post> hasToDate(LocalDate toDate) {
        return (root, query, cb) -> {
            if (toDate == null) return null;

            LocalDateTime endOfDay = LocalDateTime.of(toDate, LocalTime.MAX);
            return cb.lessThanOrEqualTo(root.get("publishDate"), endOfDay);
        };
    }

    public static Specification<Post> hasAuthor(String author) {
        return (root, query, cb) -> {
            if (author == null || author.isBlank()) return null;
            return cb.equal(root.join("author").get("username"), author);
        };
    }
}
