package com.project.IOT.Config;

import com.project.IOT.Entities.UserAccount;
import com.project.IOT.services.UserAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final UserAccountService userAccountService;

    @Autowired
    public SecurityConfig(UserAccountService userAccountService) {
        this.userAccountService = userAccountService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/device/**").hasAnyRole("ADMIN", "OWNER", "MEMBER")
                .requestMatchers("/api/device-control/**").hasAnyRole("ADMIN", "OWNER", "MEMBER")
                .requestMatchers("/api/otp/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/homeowner/**").hasAnyRole("ADMIN", "OWNER", "MEMBER")
                .requestMatchers("/api/contract/**").hasAnyRole("ADMIN", "OWNER", "MEMBER")
                .requestMatchers("/api/device-control-history/**").hasAnyRole("ADMIN", "OWNER", "MEMBER")
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED) // Bật session
                .invalidSessionUrl("/api/auth/session-invalid") 
                .maximumSessions(1) 
                .expiredUrl("/api/auth/session-expired") 
            );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> {
            UserAccount user = userAccountService.findByUsername(username);
            
            if (user == null) {
                throw new UsernameNotFoundException("User not found: " + username);
            }
            List<SimpleGrantedAuthority> authorities = user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.getName().toUpperCase()))
                .collect(Collectors.toList());
            return new org.springframework.security.core.userdetails.User(
                user.getUsername(), user.getPasswordHash(), authorities);
        };
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}