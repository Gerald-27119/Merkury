package com.merkury.vulcanus.controllers.account;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.merkury.vulcanus.model.dtos.UserLoginDto;
import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.enums.UserRole;
import com.merkury.vulcanus.model.repositories.UserEntityRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.CoreMatchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AccountControllerTestWithAppContextStartup {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserEntityRepository userEntityRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        var user = UserEntity.builder()
                .username("test")
                .password("test")
                .userRole(UserRole.ROLE_USER)
                .build();

        userEntityRepository.deleteAll();
        userEntityRepository.save(user);
    }

    @Test
    void registerUser() {

    }

    @Test
    void loginUser() throws Exception {
        var loginDto = new UserLoginDto("test", "test");
        var jsonBody = objectMapper.writeValueAsString(loginDto);

        mockMvc.perform(post("/account/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonBody)
                )
                .andExpect(status().isOk())
                .andExpect(header().exists("Set-Cookie"))
                .andExpect(header().string("Set-Cookie",
                        containsString("JWT_token")));
    }

    @Test
    void loginSuccess() {
    }

    @Test
    void forgotPasswordSendEmail() {
    }

    @Test
    void setNewPassword() {
    }
}
