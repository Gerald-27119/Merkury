package com.merkury.vulcanus.config;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.merkury.vulcanus.model.embeddable.BorderPoint;
import com.merkury.vulcanus.model.serializers.border.point.BorderPointJsonDeserializer;
import com.merkury.vulcanus.model.serializers.border.point.BorderPointJsonSerializer;
import com.merkury.vulcanus.model.serializers.border.point.BorderPointTypeResolverBuilder;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.AdviceMode;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;


/**
 * Redis cache configuration for the application.
 *
 * <p>
 * This configuration defines both a default cache configuration and specific configurations
 * for individual caches. By default, if a cache (e.g., used via {@code @Cacheable(value = "cacheName", ...)}
 * does not have an explicit configuration, the default configuration provided by {@code defaultCacheConfiguration}
 * is applied.
 * </p>
 *
 * <p>
 * The default configuration is set to:
 * <ul>
 *     <li>Time-to-live (TTL) of 30 seconds,</li>
 *     <li>Null values are not cached (disableCachingNullValues),</li>
 *     <li>Values are serialized using a {@code GenericJackson2JsonRedisSerializer} that is configured
 *         with a custom {@code ObjectMapper}. This mapper registers a module with custom serializers/deserializers
 *         for the {@code BorderPoint} (because {@code BorderPoint} has a non-standard PostgreSQL {@code TEXT} type) (using {@code BorderPointJsonSerializer} and {@code BorderPointJsonDeserializer}).</li>
 * </ul>
 * </p>
 *
 * <p>
 * In the {@code cacheManager} bean, individual cache configurations are defined for:
 * <ul>
 *     <li>{@code "filteredSpots"} – TTL set to 50 seconds,</li>
 *     <li>{@code "filteredSpotsNames"} – TTL set to 40 seconds.</li>
 * </ul>
 * </p>
 *
 * <p>
 * <strong>Adding a new cache:</strong><br>
 * If you need to add caching for a new method and require a different TTL or other settings,
 * you can add a new entry in the {@code cacheConfigurations} map in the {@code cacheManager} bean.
 * For example, to add a cache called {@code "newCache"} with a TTL of 30 seconds, add:
 * <pre>
 * cacheConfigurations.put("newCache", RedisCacheConfiguration.defaultCacheConfig()
 *       .entryTtl(Duration.ofSeconds(30))
 *       .disableCachingNullValues()
 *       .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(serializer)));
 * </pre>
 * If no specific configuration is provided for a new cache name, the default configuration
 * will be applied.
 * </p>
 *
 * <p>
 * <strong>Serialization:</strong><br>
 * The custom serializer ensures that complex objects (such as {@code BorderPoint})
 * are properly serialized and deserialized as JSON when stored in the cache.
 * This is achieved by registering a custom module on the {@code ObjectMapper} that is used by
 * the {@code GenericJackson2JsonRedisSerializer}.
 * </p>
 *
 * <p>
 * <strong>Best practices:</strong>
 * <ul>
 *     <li>Define separate cache names for methods that require different caching settings.</li>
 *     <li>Centralize cache configuration in the cache manager for maintainability and consistency.</li>
 *     <li>Ensure custom serializer correctly handles all types used in cached values.</li>
 * </ul>
 * </p>
 */
@Configuration
public class RedisConfig {

    @Bean
    public GenericJackson2JsonRedisSerializer redisSerializer() {
        var objectMapper = new ObjectMapper();
//        objectMapper.activateDefaultTyping(
//                objectMapper.getPolymorphicTypeValidator(),
//                ObjectMapper.DefaultTyping.NON_FINAL,
//                JsonTypeInfo.As.PROPERTY
//        );
//        var tpBuilder = new BorderPointTypeResolverBuilder(ObjectMapper.DefaultTyping.NON_FINAL);
//        objectMapper.setDefaultTyping(tpBuilder);

        var module = new SimpleModule();
        module.addSerializer(BorderPoint.class, new BorderPointJsonSerializer());
        module.addDeserializer(BorderPoint.class, new BorderPointJsonDeserializer(objectMapper));
//        module.addDeserializer(BorderPoint.class, new BorderPointJsonDeserializer());
        objectMapper.registerModule(module);

        return new GenericJackson2JsonRedisSerializer(objectMapper);
    }

    @Bean
    public RedisCacheConfiguration defaultCacheConfiguration(GenericJackson2JsonRedisSerializer serializer) {
        return RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofSeconds(30))
                .disableCachingNullValues()
                .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(serializer));
    }

    @Bean
    public RedisCacheManager cacheManager(RedisConnectionFactory redisConnectionFactory,
                                          GenericJackson2JsonRedisSerializer serializer) {
        Map<String, RedisCacheConfiguration> cacheConfigurations = new HashMap<>();

        cacheConfigurations.put("filteredSpots", RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofSeconds(50))
                .disableCachingNullValues()
                .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(serializer)));

        cacheConfigurations.put("filteredSpotsNames", RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofSeconds(40))
                .disableCachingNullValues()
                .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(serializer)));

        return RedisCacheManager.builder(redisConnectionFactory)
                .withInitialCacheConfigurations(cacheConfigurations)
                .build();
    }
}
