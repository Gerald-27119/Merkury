package com.merkury.vulcanus.controllers.test;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpStatusCode;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;

@ActiveProfiles("test")
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class TestControllerTestWithServerStartup {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void publicEndpoint() {
        assertThat(this.restTemplate.getForObject("http://localhost:" + port + "/public/test",
                String.class)).contains("Public test endpoint says hello!");
    }

    @Test
    void privateEndpoint() {
        var responseEntity = this.restTemplate.getForEntity("http://localhost:" + port + "/private/test", String.class);
        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatusCode.valueOf(401));
    }

}
