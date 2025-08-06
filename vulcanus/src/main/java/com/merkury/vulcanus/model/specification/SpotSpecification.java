package com.merkury.vulcanus.model.specification;

import com.merkury.vulcanus.model.entities.spot.Spot;
import org.springframework.data.jpa.domain.Specification;

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
}
