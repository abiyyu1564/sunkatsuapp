package com.sunkatsu.backend.config;

import com.sunkatsu.backend.models.*;
import com.sunkatsu.backend.repositories.CustomerRepository;
import com.sunkatsu.backend.repositories.OwnerRepository;
import com.sunkatsu.backend.repositories.StaffRepository;
import com.sunkatsu.backend.services.MyUserDetailService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import static org.springframework.http.HttpMethod.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final CustomerRepository customerRepository;
    private final StaffRepository staffRepository;
    private final OwnerRepository ownerRepository;
    private final JwtAuthFilter jwtAuthFilter;
    private final MyUserDetailService userDetailService;
    private static final String[] WHITE_LIST_URL = {"/api/auth/**",
            "/v2/api-docs",
            "/v3/api-docs",
            "/v3/api-docs/**",
            "/swagger-resources",
            "/swagger-resources/**",
            "/configuration/ui",
            "/configuration/security",
            "/swagger-ui/**",
            "/webjars/**",
            "/swagger-ui.html",
            "/chatbot",
            "/stream",
            "/chat.html",
            "/chat",
            "/messages/**",
            "/js/**",
            "/user",
            "/queue",
            "/app",
            "/img/**",
            "/api/users/**",
            "/api/users/status/**",
            "/ws/**",
            "/css/**",
            "/stream.html"};

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(customizer -> customizer.disable())
                .authorizeHttpRequests(req ->
                        req.requestMatchers(WHITE_LIST_URL)
                                .permitAll()
                                .requestMatchers(POST, "/api/menus/some-secure-action/**").hasAnyAuthority(Permission.OWNER_CREATE.name())
                                .requestMatchers("/api/staff/** ").hasAnyAuthority("STAFF", "OWNER")
                                .requestMatchers("/api/owner/**").hasAuthority("OWNER")

                                .requestMatchers(GET, "/api/customers").hasAuthority("OWNER")
                                .requestMatchers(POST, "/api/customers").hasAuthority("OWNER")

                                .requestMatchers(DELETE, "/api/favorites/**").hasAuthority("OWNER")
                                .requestMatchers(PATCH, "/api/favorites/**").hasAuthority("OWNER")

                                .requestMatchers(GET, "/api/orders/**").hasAnyAuthority("CUSTOMER", "STAFF", "OWNER")
                                .requestMatchers(PATCH, "/api/orders/**").hasAnyAuthority( "STAFF", "OWNER")
                                .requestMatchers(DELETE, "/api/orders/**").hasAnyAuthority( "STAFF", "OWNER")

                                .requestMatchers(GET, "/api/carts/**").hasAnyAuthority("CUSTOMER", "STAFF", "OWNER")
                                .requestMatchers(POST, "/api/carts/**").hasAnyAuthority("CUSTOMER", "STAFF", "OWNER")
                                .requestMatchers(DELETE, "/api/carts/**").hasAnyAuthority("CUSTOMER", "STAFF", "OWNER")
                                .requestMatchers(PATCH,"/api/carts/**").hasAnyAuthority("CUSTOMER", "STAFF", "OWNER")

                                .requestMatchers(GET, "/api/menus/**").hasAnyAuthority("CUSTOMER", "STAFF", "OWNER")
                                .requestMatchers(POST, "/api/menus/**").hasAuthority("OWNER")
                                .requestMatchers(PATCH, "/api/menus/**").hasAuthority("OWNER")
                                .requestMatchers(DELETE, "/api/menus/**").hasAuthority("OWNER")

                                .anyRequest()
                                .authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public AuthenticationProvider authenticationProvider(){
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

}
