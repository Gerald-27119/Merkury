package com.merkury.vulcanus.security;

import com.merkury.vulcanus.properties.UrlsProperties;
import com.merkury.vulcanus.security.jwt.JwtAuthEntryPoint;
import com.merkury.vulcanus.security.jwt.JwtAuthFilter;
import com.merkury.vulcanus.security.jwt.JwtGenerator;
import com.merkury.vulcanus.security.jwt.JwtManager;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.logout.LogoutFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.NegatedRequestMatcher;
import org.springframework.security.web.util.matcher.OrRequestMatcher;
import org.springframework.security.web.util.matcher.RegexRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;


import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final UrlsProperties urlsProperties;
    private final JwtAuthEntryPoint authEntryPoint;
    private final CustomUserDetailsService customUserDetailsService;
    private final RequestMatcher publicPathsMatcher = new OrRequestMatcher(
            new AntPathRequestMatcher("/public/**"),
            new AntPathRequestMatcher("/error/**"),
            new AntPathRequestMatcher("/login/**"),
            new AntPathRequestMatcher("/account/**"),
            new AntPathRequestMatcher("/oauth2/**"),
            new AntPathRequestMatcher("/favicon.ico"),
            new AntPathRequestMatcher("/actuator/**")
    );
    private final RequestMatcher privatePathsMatcher = new NegatedRequestMatcher(publicPathsMatcher);

    @Bean
    @Order(1)
    public SecurityFilterChain publicSecurityFilterChain(HttpSecurity http) throws Exception {
        return http
                .securityMatcher(publicPathsMatcher)
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll()
                )
                .oauth2Login(oauth2 -> oauth2
                        .loginPage(urlsProperties.getOauth2LoginPageUrl())
                        .defaultSuccessUrl(urlsProperties.getOauth2DefaultSuccessUrl(), true)
                        .failureUrl(urlsProperties.getOauth2FailureUrl())
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .httpBasic(AbstractHttpConfigurer::disable)
                .build();
    }

    @Bean
    @Order(2)
    public SecurityFilterChain privateSecurityFilterChain(HttpSecurity http) throws Exception {
        return http
                .securityMatcher(privatePathsMatcher)
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().authenticated()
                )
                .exceptionHandling(exception -> exception
                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            response.setStatus(403);
                            response.setContentType("application/json");
                            response.setCharacterEncoding("UTF-8");
                            response.getWriter().write("{ \"error\": \"Forbidden\", \"message\": \"You don't have permission to access this resource\", \"path\": \"" + request.getRequestURI() + "\", \"exception message\": \"" + accessDeniedException.getMessage() + "\" }");
                            response.getWriter().flush();
                        })
                        .authenticationEntryPoint(authEntryPoint)
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .httpBasic(AbstractHttpConfigurer::disable)
                .addFilterBefore(jwtAuthenticationFilter(), LogoutFilter.class)
                .build();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Cache-Control", "Content-Type"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public JwtAuthFilter jwtAuthenticationFilter() {
        return new JwtAuthFilter(
                new JwtGenerator(),
                customUserDetailsService,
                new JwtManager()
        );
    }

    @Bean
    public FilterRegistrationBean<JwtAuthFilter> jwtAuthFilterRegistration(JwtAuthFilter jwtAuthFilter) {
        FilterRegistrationBean<JwtAuthFilter> registrationBean = new FilterRegistrationBean<>(jwtAuthFilter);
        registrationBean.setEnabled(false);
        return registrationBean;
    }
}

//@Configuration
//@EnableWebSecurity
//@RequiredArgsConstructor
//public class SecurityConfig {
//
//    private final JwtAuthEntryPoint authEntryPoint;
//    private final CustomUserDetailsService userDetailsService;
//    private final UrlsProperties urlsProperties;
//
//    private final RequestMatcher publicPathsMatcher = new OrRequestMatcher(
//            new AntPathRequestMatcher("/public/**"),
//            new AntPathRequestMatcher("/account/**"),
//            new AntPathRequestMatcher("/oauth2/**"),
//            new AntPathRequestMatcher("/actuator/**")
//    );
//    private final RequestMatcher privatePathsMatcher = new NegatedRequestMatcher(publicPathsMatcher);
//
//    //    @Bean
////    @Order(1)
////    public SecurityFilterChain publicSecurityFilterChain(HttpSecurity http) throws Exception {
////        return http
////                .securityMatcher("/public/**")
////                .csrf(AbstractHttpConfigurer::disable)
////                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
////                .authorizeHttpRequests(auth -> auth.anyRequest().permitAll())
//////                .oauth2Login(oauth2 -> oauth2
//////                        .loginPage(urlsProperties.getOauth2LoginPageUrl())
//////                        .defaultSuccessUrl(urlsProperties.getOauth2DefaultSuccessUrl(), true)
//////                        .failureUrl(urlsProperties.getOauth2FailureUrl())
//////                )
//////                .logout(logout -> logout
//////                        .logoutUrl("/account/oauth2/logout")
//////                        .logoutSuccessUrl(urlsProperties.getLogoutUrl())
//////                        .logoutSuccessHandler((request, response, authentication) -> response.setStatus(200))
//////                        .invalidateHttpSession(true)
//////                        .clearAuthentication(true)
//////                        .deleteCookies(getTokenName())
//////                )
////                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
////                .httpBasic(AbstractHttpConfigurer::disable)
////                .build();
////    }
//    @Bean
//    @Order(1)
//    public SecurityFilterChain publicSecurityFilterChain(HttpSecurity http) throws Exception {
//        return http
//                .securityMatcher("/public/**")
//                .csrf(AbstractHttpConfigurer::disable)
//                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
//                .authorizeHttpRequests(auth -> auth
//                        .anyRequest().permitAll()
//                )
//                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
//                .httpBasic(AbstractHttpConfigurer::disable)
//                .build();
//    }
//
//    @Bean
//    @Order(2)
//    public SecurityFilterChain privateSecurityFilterChain(HttpSecurity http) throws Exception {
//
//        return http
//                .securityMatcher(RegexRequestMatcher.regexMatcher("^(?!.*(/public(/|$))).*"))
//                .csrf(AbstractHttpConfigurer::disable)
//                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
//                .authorizeHttpRequests(auth -> auth.anyRequest().authenticated())
//                .exceptionHandling(exception -> exception
//                        .accessDeniedHandler((request, response, accessDeniedException) -> {
//                            response.setStatus(403);
//                            response.setContentType("application/json");
//                            response.setCharacterEncoding("UTF-8");
//                            response.getWriter().write("{ \"error\": \"Forbidden\", \"message\": \"You don't have permission to access this resource\", \"path\": \"" + request.getRequestURI() + "\", \"exception message\": \"" + accessDeniedException.getMessage() + "\" }");
//                            response.getWriter().flush();
//                        })
//                        .authenticationEntryPoint(authEntryPoint)
//                )
//                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
//                .httpBasic(AbstractHttpConfigurer::disable)
//                .addFilterBefore(jwtAuthenticationFilter(), LogoutFilter.class)
//                .build();
//    }
//
//    @Bean
//    CorsConfigurationSource corsConfigurationSource() {
//        CorsConfiguration configuration = new CorsConfiguration();
//        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
//        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
//        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Cache-Control", "Content-Type"));
//        configuration.setAllowCredentials(true);
//        configuration.setMaxAge(300L);
//        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//        source.registerCorsConfiguration("/**", configuration);
//        return source;
//    }
//
//    @Bean
//    public AuthenticationManager authenticationManager(
//            AuthenticationConfiguration authenticationConfiguration) throws Exception {
//        return authenticationConfiguration.getAuthenticationManager();
//    }
//
//    @Bean
//    PasswordEncoder passwordEncoder() {
//        return new BCryptPasswordEncoder();
//    }
//
//    @Bean
//    public JwtAuthFilter jwtAuthenticationFilter() {
//        return new JwtAuthFilter(new JwtGenerator(),
//                userDetailsService, new JwtManager());
//    }
//
//}
