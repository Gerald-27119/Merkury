package com.merkury.vulcanus.test;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatusCode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class TestControllerWithAppContextStartupTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void publicEndpoint() throws Exception {
        this.mockMvc.perform(get("/public/test"))
                .andExpect(status().isOk())
                .andExpect(content().string("Public test endpoint says hello!"));
    }

    @Test
    void privateEndpoint() throws Exception {
        this.mockMvc.perform(get("/private/test"))
                .andExpect(status().is(HttpStatusCode.valueOf(401).value()));
    }

}
