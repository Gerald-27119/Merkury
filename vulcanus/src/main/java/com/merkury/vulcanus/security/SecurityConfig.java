package com.merkury.vulcanus.security;

import com.merkury.vulcanus.security.jwt.JwtAuthEntryPoint;
import com.merkury.vulcanus.security.jwt.JwtAuthFilter;
import com.merkury.vulcanus.security.jwt.JwtGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HttpBasicConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthEntryPoint authEntryPoint;
    private final CustomUserDetailsService userDetailsService;
    private final String OAUTH2_LOGIN_PAGE_URL = "http://localhost:5173/login";
//    private final String OAUTH2_DEFAULT_SUCCESS_URL = "http://localhost:8080/account/login/oauth2/code/{provider}";
    private final String OAUTH2_DEFAULT_SUCCESS_URL = "http://localhost:8080/account/login-success";
    private final String OAUTH2_FAILURE_URL = "http://localhost:5173/error?error=oauth2-login-failure";

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> auth
//                        .requestMatchers("/account/register", "/register", "/oauth2**").permitAll() // Permit access to /register endpoint
                        .requestMatchers("/account/**","/oauth2/**").permitAll() // Permit access to /register endpoint
                        .anyRequest().authenticated()
                )
                .oauth2Login(oauth2 -> oauth2
                        .loginPage(OAUTH2_LOGIN_PAGE_URL)
                        .defaultSuccessUrl(OAUTH2_DEFAULT_SUCCESS_URL, true)
                        .failureUrl(OAUTH2_FAILURE_URL)
                        .successHandler((request, response, authentication) -> {
                            // This handler is called when OAuth2 login is successful
                            if (authentication instanceof OAuth2AuthenticationToken) {
                                System.out.println("OAuth2 Authentication Success!");
                                System.out.println("User Name: " + authentication.getName());
                            }
                            response.sendRedirect(OAUTH2_DEFAULT_SUCCESS_URL);
                        })
                )
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint(authEntryPoint)
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.ALWAYS)
                )
                .httpBasic(HttpBasicConfigurer::disable)
//                .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class)
                .build();
    }


    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173")); // Add your frontend's URL here
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Cache-Control", "Content-Type"));
        configuration.setExposedHeaders(Arrays.asList("Authorization"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(300L);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public JwtAuthFilter jwtAuthenticationFilter() {
        return new JwtAuthFilter(new JwtGenerator(), userDetailsService);
    }
}
