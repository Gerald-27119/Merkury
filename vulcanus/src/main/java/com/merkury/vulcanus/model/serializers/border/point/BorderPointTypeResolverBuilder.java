package com.merkury.vulcanus.model.serializers.border.point;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.jsontype.impl.StdTypeResolverBuilder;
import com.merkury.vulcanus.model.embeddable.BorderPoint;

import java.util.Collection;

/**
 * Custom type resolver builder for the {@link BorderPoint} class.
 *
 * <p>
 * This class extends {@link StdTypeResolverBuilder} to provide custom type resolution
 * for the {@link BorderPoint} class and collections containing {@link BorderPoint} instances.
 * It ensures that type metadata is included in the JSON representation of these objects,
 * allowing for proper deserialization.
 * </p>
 *
 * <p>
 * The type metadata is included as a property named "@class" in the JSON output.
 * </p>
 */
public class BorderPointTypeResolverBuilder extends StdTypeResolverBuilder {

    /**
     * Constructs a new {@code BorderPointTypeResolverBuilder} with the specified default typing.
     *
     * @param nonFinal the default typing to use
     */
    public BorderPointTypeResolverBuilder(ObjectMapper.DefaultTyping nonFinal) {
        init(JsonTypeInfo.Id.CLASS, null);
        inclusion(JsonTypeInfo.As.PROPERTY);
        typeProperty("@class");
    }

    /**
     * Determines whether this type resolver should be used for the specified type.
     *
     * @param t the type to check
     * @return {@code true} if the type is {@link BorderPoint} or a collection containing {@link BorderPoint}, {@code false} otherwise
     */
    public boolean useForType(JavaType t) {
        if (BorderPoint.class.isAssignableFrom(t.getRawClass())) {
            return true;
        }
        if (Collection.class.isAssignableFrom(t.getRawClass())) {
            JavaType contentType = t.getContentType();
            return contentType != null && BorderPoint.class.isAssignableFrom(contentType.getRawClass());
        }
        return false;
//        return t.getRawClass().equals(BorderPoint.class);
    }
}