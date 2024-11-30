package com.merkury.vulcanus;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableConfigurationProperties
@EnableAsync
public class VulcanusApplication {

    public static void main(String[] args) {
        SpringApplication.run(VulcanusApplication.class, args);
    }

}
