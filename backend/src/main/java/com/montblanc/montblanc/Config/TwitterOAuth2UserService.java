package com.montblanc.montblanc.Config;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.*;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.client.RestTemplate;

import java.util.*;

/**
 * Custom OAuth2UserService for X (Twitter) — обрабатывает вложенный формат ответа API /2/users/me
 */
public class TwitterOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        String userInfoUri = userRequest.getClientRegistration().getProviderDetails().getUserInfoEndpoint().getUri();
        String uri = userInfoUri + "?user.fields=id,name,username,profile_image_url";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(userRequest.getAccessToken().getTokenValue());
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<String> response = restTemplate.exchange(uri, HttpMethod.GET, entity, String.class);
        if (response.getStatusCode() != HttpStatus.OK || response.getBody() == null) {
            throw new OAuth2AuthenticationException(new OAuth2Error("invalid_user_info_response", "Failed to fetch X user info", null));
        }

        try {
            JsonNode root = objectMapper.readTree(response.getBody());
            JsonNode data = root.get("data");
            if (data == null) {
                throw new OAuth2AuthenticationException(new OAuth2Error("invalid_user_info_response", "X user info missing 'data'", null));
            }

            Map<String, Object> attributes = new HashMap<>();
            String id = data.has("id") ? data.get("id").asText() : "";
            String name = data.has("name") ? data.get("name").asText() : "";
            String username = data.has("username") ? data.get("username").asText() : "";

            attributes.put("id", id);
            attributes.put("name", name);
            attributes.put("username", username);
            if (data.has("profile_image_url")) {
                attributes.put("profile_image_url", data.get("profile_image_url").asText());
            }

            return new DefaultOAuth2User(
                    Collections.singleton(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_USER")),
                    attributes,
                    "username"
            );
        } catch (Exception e) {
            throw new OAuth2AuthenticationException(new OAuth2Error("invalid_user_info_response", "Failed to parse X user info", null), e);
        }
    }
}
