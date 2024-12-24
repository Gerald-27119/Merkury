package com.merkury.vulcanus.test;

import com.merkury.vulcanus.test.TestController;
import com.merkury.vulcanus.test.TestService;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;


@WebMvcTest(TestController.class)
class WebMvcTestControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TestService testService;

    /**
    * The purpose of this test is to test only the web layer with mocking the service layer simultaneously
    * without loading the full app context or stating the app on a port.
    * The problem is that the default security configuration is loaded which locks down the endpoints.
     */
    @Test
    @Disabled("Need to figure out how to resolve it")
    void publicEndpointWithServiceCall() throws Exception {
        when(testService.getTest()).thenReturn("Test");

        this.mockMvc.perform(get("/public/test/service"))
                .andExpect(status().isOk())
                .andExpect(content().string("Test"));
    }

}
