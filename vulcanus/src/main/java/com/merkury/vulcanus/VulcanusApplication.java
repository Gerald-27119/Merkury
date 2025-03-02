package com.merkury.vulcanus;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.retry.annotation.EnableRetry;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableConfigurationProperties
@EnableAsync
@EnableCaching
@EnableRetry
public class VulcanusApplication {

    public static void main(String[] args) {
        SpringApplication.run(VulcanusApplication.class, args);
    }

}
