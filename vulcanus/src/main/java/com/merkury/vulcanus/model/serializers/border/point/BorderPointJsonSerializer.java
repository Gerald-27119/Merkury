package com.merkury.vulcanus.model.serializers.border.point;


import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonToken;
import com.fasterxml.jackson.core.type.WritableTypeId;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.jsontype.TypeSerializer;
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

    @Override
    public Class<BorderPoint> handledType() {
        return BorderPoint.class;
    }

    @Override
    public void serializeWithType(BorderPoint value, JsonGenerator gen, SerializerProvider serializers, TypeSerializer typeSer) throws IOException {
        WritableTypeId typeId = typeSer.typeId(value, JsonToken.START_OBJECT);
        typeSer.writeTypePrefix(gen, typeId);
        gen.writeNumberField("x", value.getX());
        gen.writeNumberField("y", value.getY());
        typeSer.writeTypeSuffix(gen, typeId);
    }

}

