package com.merkury.vulcanus.model.converters;

import com.fasterxml.jackson.core.type.TypeReference;
import com.merkury.vulcanus.model.entities.BorderPoint;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.util.List;

/**
 * A JPA attribute converter that transforms a {@code List<BorderPoint>} into its JSON string representation
 * and vice versa.
 *
 * <p>
 * This converter uses Jackson's {@link ObjectMapper} to serialize a list of {@code BorderPoint} objects into
 * a JSON string when persisting the entity, and to deserialize the JSON string back into a list when reading
 * from the database.
 * </p>
 *
 * <p>
 * Note: If the provided list is {@code null} or empty, the {@code convertToDatabaseColumn} method returns {@code null}.
 * Similarly, if the database column value is {@code null} or empty, the {@code convertToEntityAttribute} method returns {@code null}.
 * </p>
 *
 * @see AttributeConverter
 * @see BorderPoint
 */
@Converter
public class BorderPointListConverter implements AttributeConverter<List<BorderPoint>, String> {

    /**
     * The ObjectMapper instance used for converting between Java objects and their JSON representation.
     */
    private final ObjectMapper mapper = new ObjectMapper();

    /**
     * Converts a list of {@code BorderPoint} objects into a JSON string for storage in the database.
     *
     * @param borderPoints the list of {@code BorderPoint} objects to be converted; may be {@code null} or empty.
     * @return a JSON string representation of the list, or {@code null} if the list is {@code null} or empty.
     * @throws RuntimeException if the conversion to JSON fails.
     */
    @Override
    public String convertToDatabaseColumn(List<BorderPoint> borderPoints) {
        if (borderPoints == null || borderPoints.isEmpty()) {
            return null;
        }
        try {
            return mapper.writeValueAsString(borderPoints);
        } catch (IOException e) {
            throw new RuntimeException("Could not convert list to JSON", e);
        }
    }

    /**
     * Converts a JSON string from the database column into a list of {@code BorderPoint} objects.
     *
     * @param json the JSON string stored in the database column; may be {@code null} or empty.
     * @return a {@code List<BorderPoint>} reconstructed from the JSON string, or {@code null} if the input is {@code null} or empty.
     * @throws RuntimeException if the conversion from JSON fails.
     */
    @Override
    public List<BorderPoint> convertToEntityAttribute(String json) {
        if (json == null || json.isEmpty()) {
            return null;
        }
        try {
            return mapper.readValue(json, new TypeReference<List<BorderPoint>>() {});
        } catch (IOException e) {
            throw new RuntimeException("Could not convert JSON to list", e);
        }
    }
}
