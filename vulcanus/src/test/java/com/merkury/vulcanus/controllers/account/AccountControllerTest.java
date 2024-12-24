package com.merkury.vulcanus.controllers.account;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.merkury.vulcanus.controllers.AccountController;
import com.merkury.vulcanus.model.dtos.UserLoginDto;
import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.enums.UserRole;
import com.merkury.vulcanus.model.repositories.UserEntityRepository;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AccountControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserEntityRepository userEntityRepository;

    @Autowired
    private ObjectMapper objectMapper;

    void setUp() {
        var user = UserEntity.builder()
                .username("test")
                .password("test")
                .userRole(UserRole.ROLE_USER)
                .build();
        userEntityRepository.save(user);
    }

    @Test
    void registerUser() {
    }

    @Test
    void loginUser() throws Exception {
        setUp();
        var user = userEntityRepository.findByUsername("test").orElseThrow();
        System.out.println("User: " + user);
        UserLoginDto loginDto = new UserLoginDto("test", "test");
        var json = objectMapper.writeValueAsString(loginDto);
        System.out.println("Request JSON: " + json);

        mockMvc.perform(post("/account/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk());
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