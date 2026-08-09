package com.montblanc.montblanc.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.DefaultOAuth2AuthorizationRequestResolver;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizationRequestRedirectFilter;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;
import org.springframework.security.oauth2.core.endpoint.PkceParameterNames;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.SecurityFilterChain;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private static final int PKCE_CODE_VERIFIER_LENGTH = 96;

    private final GoogleOAuth2SuccessHandler googleOAuth2SuccessHandler;

    public SecurityConfig(GoogleOAuth2SuccessHandler googleOAuth2SuccessHandler) {
        this.googleOAuth2SuccessHandler = googleOAuth2SuccessHandler;
    }

    @Bean
    public OAuth2UserService<OAuth2UserRequest, OAuth2User> oauth2UserService() {
        DefaultOAuth2UserService defaultService = new DefaultOAuth2UserService();
        TwitterOAuth2UserService twitterService = new TwitterOAuth2UserService();
        return request -> {
            if ("twitter".equals(request.getClientRegistration().getRegistrationId())) {
                return twitterService.loadUser(request);
            }
            return defaultService.loadUser(request);
        };
    }

    /**
     * PKCE customizer для Twitter/X — добавляет code_challenge и code_challenge_method=S256.
     * Twitter требует PKCE для OAuth 2.0 Authorization Code Flow.
     */
    private static void addPkceParameters(OAuth2AuthorizationRequest.Builder builder) {
        String codeVerifier = generateCodeVerifier();
        String codeChallenge = createS256CodeChallenge(codeVerifier);

        builder.attributes(attrs -> attrs.put(PkceParameterNames.CODE_VERIFIER, codeVerifier));
        builder.additionalParameters(params -> {
            params.put(PkceParameterNames.CODE_CHALLENGE, codeChallenge);
            params.put(PkceParameterNames.CODE_CHALLENGE_METHOD, "S256");
        });
    }

    private static String generateCodeVerifier() {
        SecureRandom secureRandom = new SecureRandom();
        byte[] bytes = new byte[PKCE_CODE_VERIFIER_LENGTH];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private static String createS256CodeChallenge(String codeVerifier) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256").digest(codeVerifier.getBytes(StandardCharsets.US_ASCII));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(digest);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 not available", e);
        }
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, ClientRegistrationRepository clientRegistrationRepository) throws Exception {
        DefaultOAuth2AuthorizationRequestResolver resolver = new DefaultOAuth2AuthorizationRequestResolver(
                clientRegistrationRepository,
                OAuth2AuthorizationRequestRedirectFilter.DEFAULT_AUTHORIZATION_REQUEST_BASE_URI
        );
        resolver.setAuthorizationRequestCustomizer(SecurityConfig::addPkceParameters);

        http
                .cors(org.springframework.security.config.Customizer.withDefaults())
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll()
                )
                .oauth2Login(oauth2 -> oauth2
                        .authorizationEndpoint(auth -> auth
                                .authorizationRequestResolver(resolver)
                        )
                        .userInfoEndpoint(userInfo -> userInfo
                                .userService(oauth2UserService())
                        )
                        .successHandler(googleOAuth2SuccessHandler)
                )
                .csrf(csrf -> csrf.ignoringRequestMatchers(
                        "/api/**", "/login", "/order", "/deleteOrder/**", "/products/**", "/categories/**", "/addProduct/**", "/addCategory/**"
                ));

        return http.build();
    }
}
