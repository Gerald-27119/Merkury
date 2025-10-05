package com.merkury.vulcanus.model.specification;

import com.merkury.vulcanus.model.entities.spot.Spot;
import com.merkury.vulcanus.model.entities.spot.SpotTag;
import com.merkury.vulcanus.model.enums.SpotRatingFilterType;
import jakarta.persistence.criteria.Join;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

public class SpotSpecification {
    private SpotSpecification() {
    }

    public static Specification<Spot> hasCountry(String country) {
        return (root, query, cb) ->
                country == null ? null : cb.equal(root.get("country"), country);
    }

    public static Specification<Spot> hasRegion(String region) {
        return (root, query, cb) ->
                region == null ? null : cb.equal(root.get("region"), region);
    }

    public static Specification<Spot> hasCity(String city) {
        return (root, query, cb) ->
                city == null ? null : cb.equal(root.get("city"), city);
    }

    public static Specification<Spot> hasAnyTag(List<String> tagNames) {
        return (root, query, cb) -> {
            if (tagNames == null || tagNames.isEmpty()) return null;

            query.distinct(true);
            Join<Spot, SpotTag> tagJoin = root.join("tags");

            return tagJoin.get("name").in(tagNames);
        };
    }

    public static Specification<Spot> hasMinRating(SpotRatingFilterType filter) {
        return (root, query, cb) -> {
            if (filter == null || filter == SpotRatingFilterType.ANY) {
                return cb.conjunction();
            }

            double minRating;
            switch (filter) {
                case TWO -> minRating = 2.0;
                case TWO_HALF -> minRating = 2.5;
                case THREE -> minRating = 3.0;
                case THREE_HALF -> minRating = 3.5;
                case FOUR -> minRating = 4.0;
                case FOUR_HALF -> minRating = 4.5;
                default -> minRating = 0.0;
            }

            return cb.greaterThanOrEqualTo(root.get("rating"), minRating);
        };
    }

}