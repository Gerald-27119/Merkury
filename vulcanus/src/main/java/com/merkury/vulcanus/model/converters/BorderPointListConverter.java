package com.merkury.vulcanus.model.converters;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.merkury.vulcanus.model.embeddable.BorderPoint;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.List;

/**
 * A JPA attribute converter that transforms a {@code List<BorderPoint>} into its TEXT string representation
 * and vice versa, without polymorphic type information.
 */
@Converter(autoApply = true)
public class BorderPointListConverter implements AttributeConverter<List<BorderPoint>, String> {

    private final ObjectMapper mapper;

    public BorderPointListConverter() {
        this.mapper = new ObjectMapper();
    }

    @Override
    public String convertToDatabaseColumn(List<BorderPoint> borderPoints) {
        if (borderPoints == null || borderPoints.isEmpty()) {
            return null;
        }
        try {
            return mapper.writeValueAsString(borderPoints);
        } catch (Exception e) {
            throw new RuntimeException("Error converting BorderPoint list to JSON", e);
        }
    }

    @Override
    public List<BorderPoint> convertToEntityAttribute(String json) {
        if (json == null || json.isEmpty()) {
            return null;
        }
        try {
            return mapper.readValue(json, new TypeReference<>() {
            });
        } catch (Exception e) {
            throw new RuntimeException("Error converting JSON to BorderPoint list", e);
        }
    }
}
