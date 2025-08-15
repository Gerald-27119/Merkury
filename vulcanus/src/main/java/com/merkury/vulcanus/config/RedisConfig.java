package com.merkury.vulcanus.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;

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
 */
@Configuration
public class RedisConfig  {

    @Bean
    public RedisCacheManager cacheManager(RedisConnectionFactory cf) {
        RedisCacheConfiguration defaultConfig = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofSeconds(30))
                .disableCachingNullValues();

        Map<String, RedisCacheConfiguration> configs = new HashMap<>();
        configs.put("filteredSpots",      defaultConfig.entryTtl(Duration.ofSeconds(50)));
        configs.put("filteredSpotsNames", defaultConfig.entryTtl(Duration.ofSeconds(40)));
        configs.put("gifsTrendingTerms",  defaultConfig.entryTtl(Duration.ofHours(1)));

        return RedisCacheManager.builder(cf)
                .cacheDefaults(defaultConfig)
                .withInitialCacheConfigurations(configs)
                .build();
    }

}
