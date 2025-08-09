package com.merkury.vulcanus.model.specification;

import com.merkury.vulcanus.model.entities.spot.Spot;
import com.merkury.vulcanus.model.entities.spot.SpotTag;
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
}