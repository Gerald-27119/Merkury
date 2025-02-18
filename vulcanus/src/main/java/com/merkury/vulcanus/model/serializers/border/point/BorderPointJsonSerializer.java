package com.merkury.vulcanus.model.serializers.border.point;


import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.merkury.vulcanus.model.embeddable.BorderPoint;

import java.io.IOException;

public class BorderPointJsonSerializer extends JsonSerializer<BorderPoint> {
    @Override
    public void serialize(BorderPoint value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
        gen.writeStartObject();
        gen.writeNumberField("x", value.getX());
        gen.writeNumberField("y", value.getY());
        gen.writeEndObject();
    }
}

