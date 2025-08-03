package com.merkury.vulcanus.model.serializers.border.point;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.exc.InvalidTypeIdException;
import com.fasterxml.jackson.databind.jsontype.BasicPolymorphicTypeValidator;
import com.fasterxml.jackson.databind.jsontype.TypeDeserializer;
import com.merkury.vulcanus.model.embeddable.BorderPoint;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.boot.jackson.JsonComponent;

import java.io.IOException;

//@NoArgsConstructor(force = true)
@AllArgsConstructor
public class BorderPointJsonDeserializer extends JsonDeserializer<BorderPoint> {

    private final ObjectMapper mapper;

    public BorderPointJsonDeserializer() {
        //        objectMapper.activateDefaultTyping(
//                objectMapper.getPolymorphicTypeValidator(),
//                ObjectMapper.DefaultTyping.NON_FINAL,
//                JsonTypeInfo.As.PROPERTY
//        );
        var ptv = BasicPolymorphicTypeValidator.builder()
                .allowIfBaseType(Object.class)
                .build();
        var objectMapper = new ObjectMapper();
        objectMapper.activateDefaultTyping(ptv,
                ObjectMapper.DefaultTyping.NON_FINAL_AND_ENUMS,
                JsonTypeInfo.As.PROPERTY);
        var tpBuilder = new BorderPointTypeResolverBuilder(ObjectMapper.DefaultTyping.NON_FINAL);
        objectMapper.setDefaultTyping(tpBuilder);
        this.mapper = objectMapper;
    }

    @Override
    public BorderPoint deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
//        ObjectMapper mapper = (ObjectMapper) p.getCodec();
        return mapper.readValue(p, BorderPoint.class);
    }

//    @Override
//    public BorderPoint deserializeWithType(JsonParser p, DeserializationContext ctxt, TypeDeserializer typeDeserializer) throws IOException {
//        return (BorderPoint) typeDeserializer.deserializeTypedFromAny(p, ctxt);
//    }

//    @Override
//    public BorderPoint deserializeWithType(JsonParser p, DeserializationContext ctxt, TypeDeserializer typeDeserializer) throws IOException {
////        BorderPoint borderPoint = (BorderPoint) typeDeserializer.deserializeTypedFromAny(p, ctxt);
////        System.out.println("Deserialized BorderPoint: " + borderPoint);
//        try {
//            return (BorderPoint) typeDeserializer.deserializeTypedFromAny(p, ctxt);
//        } catch (InvalidTypeIdException e) {
////            ObjectMapper mapper = (ObjectMapper) p.getCodec();
////            var jsonNode = p.getCodec().readTree(p);
//            System.out.println("Deserializing BorderPoint");
//            return mapper.readValue(p, BorderPoint.class);
//        }
//    }
}
