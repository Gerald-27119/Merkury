package com.merkury.vulcanus.security.jwt;

import com.merkury.vulcanus.security.CustomUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;


@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtGenerator tokenGenerator;
    private final CustomUserDetailsService customUserDetailsService;

    /**
     * This method is used to filter the request and check if the token is valid.
     * If the token is valid, the user is authenticated and the request is allowed to proceed.
     *
     * @param request     The request to be filtered
     * @param response    The response to be filtered
     * @param filterChain The filter chain
     *                    Creates an Authentication object and set it in the SecurityContextHolder.
    */
    /*
     * Creating an Authentication object and setting it in the SecurityContextHolder is a common practice in Spring Security to
     * establish the security context for the current thread. This is essential for several reasons:
     * User Authentication: It signifies that the user has been authenticated and provides the necessary details about the user,
     * such as username, roles, and other credentials.
     * Authorization: It allows Spring Security to perform authorization checks based on the user's roles and permissions.
     * The Authentication object contains the authorities granted to the user, which are used to determine access to secured resources.
     * Thread Safety: The SecurityContextHolder uses a ThreadLocal to store the SecurityContext,
     * ensuring that the security context is available throughout the lifecycle of the request and is isolated from other requests.
     * Access Control: It enables access control in your application by allowing you to retrieve
     * the current user's details and roles from anywhere in your application, facilitating role-based access control (RBAC).
     */
    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        String token = getJWTFromRequest(request);
        if (StringUtils.hasText(token) && tokenGenerator.validateToken(token)) {
            String username = tokenGenerator.getUsernameFromJWT(token);

            UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);
            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(userDetails, null,
                    userDetails.getAuthorities());
            authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);
        }
        filterChain.doFilter(request, response);
    }

    private String getJWTFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
