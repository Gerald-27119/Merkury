package com.merkury.vulcanus;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
//@Import(EmbeddedMongoConfig.class) // Explicitly import the embedded MongoDB configuration
class VulcanusApplicationTest {

    @Test
    void contextLoads() {
        // Test context loading
    }
}
