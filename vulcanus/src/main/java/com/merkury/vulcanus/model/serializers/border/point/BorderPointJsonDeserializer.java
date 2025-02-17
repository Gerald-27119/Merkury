package com.merkury.vulcanus.model.serializers.border.point;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.merkury.vulcanus.model.embeddable.BorderPoint;
import lombok.AllArgsConstructor;

import java.io.IOException;

@AllArgsConstructor
public class BorderPointJsonDeserializer extends JsonDeserializer<BorderPoint> {

    private final ObjectMapper mapper;

    @Override
    public BorderPoint deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        return mapper.readValue(p, BorderPoint.class);
    }
}
