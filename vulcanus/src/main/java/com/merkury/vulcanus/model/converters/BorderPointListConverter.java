package com.merkury.vulcanus.model.converters;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.merkury.vulcanus.model.embeddable.BorderPoint;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.List;

/**
 * A JPA attribute converter that transforms a {@code List<BorderPoint>} into its TEXT string representation
 * and vice versa.
 * <p>
 * This converter is used to serialize a list of {@link BorderPoint} objects into a TEXT string that semantically looks like JSON, when persisting
 * an entity and to deserialize the TEXT string back into a {@code List<BorderPoint>} when retrieving data from
 * the database.
 * </p>
 *
 * <p>
 * The {@link Converter} annotation marks this class as a JPA converter.
 * </p>
 *
 * <p>
 * The conversion logic is handled by {@link ObjectMapper} from the Jackson library. If the provided list is {@code null}
 * or empty, the {@code convertToDatabaseColumn} method returns {@code null}. Similarly, if the TEXT column value is
 * {@code null} or empty, the {@code convertToEntityAttribute} method returns {@code null}.
 * </p>
 *
 * @see AttributeConverter
 * @see BorderPoint
 */
@Converter
public class BorderPointListConverter implements AttributeConverter<List<BorderPoint>, String> {

    private final ObjectMapper mapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(List<BorderPoint> borderPoints) {
        if (borderPoints == null || borderPoints.isEmpty()) {
            return null;
        }
        try {
            return mapper.writeValueAsString(borderPoints);
        } catch (Exception e) {
            throw new RuntimeException("Error converting BorderPoint list to TEXT", e);
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
