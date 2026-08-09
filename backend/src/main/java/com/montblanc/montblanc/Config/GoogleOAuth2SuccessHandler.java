package com.montblanc.montblanc.Config;

import com.montblanc.montblanc.Clases.User;
import com.montblanc.montblanc.Repositories.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;

@Component
public class GoogleOAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private static final Logger logger = LoggerFactory.getLogger(GoogleOAuth2SuccessHandler.class);
    private static final String CATEGORY_USER = "user";
    private static final String OAUTH_PASSWORD_GOOGLE = "OAUTH_GOOGLE";
    private static final String OAUTH_PASSWORD_X = "OAUTH_X";

    @Value("${app.base-url:http://localhost:3000}")
    private String appBaseUrl;

    private final UserRepository userRepository;

    public GoogleOAuth2SuccessHandler(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        try {
            OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
            Map<String, Object> attributes = oauth2User.getAttributes();

            String provider = authentication instanceof OAuth2AuthenticationToken token
                    ? token.getAuthorizedClientRegistrationId()
                    : "google";

            String email;
            String name;
            String passwordPlaceholder;

            if ("twitter".equals(provider)) {
                // X (Twitter): id, name, username
                String username = (String) attributes.get("username");
                name = (String) attributes.get("name");
                Object idObj = attributes.get("id");
                if (username == null || username.isBlank()) {
                    username = idObj != null ? String.valueOf(idObj) : "unknown";
                }
                email = (username != null && !username.isBlank())
                        ? username.toLowerCase().trim() + "@x.local"
                        : "x_" + (idObj != null ? idObj : "unknown") + "@x.local";
                name = (name != null && !name.isBlank()) ? name.trim() : (username != null ? username : "X User");
                passwordPlaceholder = OAUTH_PASSWORD_X;
            } else {
                // Google
                email = (String) attributes.get("email");
                name = (String) attributes.get("name");
                if (email == null || email.isBlank()) {
                    email = oauth2User.getName();
                }
                if (name == null || name.isBlank()) {
                    name = email;
                }
                email = email != null ? email.trim().toLowerCase() : "unknown@google.local";
                name = name != null ? name.trim() : email;
                passwordPlaceholder = OAUTH_PASSWORD_GOOGLE;
            }

            User user = userRepository.findByEmail(email);
            if (user == null) {
                user = userRepository.findByLogin(email);
            }
            if (user == null) {
                user = new User();
                user.setName(name);
                user.setEmail(email);
                user.setLogin(email);
                user.setPassword(passwordPlaceholder);
                user.setCategory(CATEGORY_USER);
                userRepository.save(user);
                logger.info("Created new user from {}: email={}, name={}", provider, email, name);
            } else {
                if (user.getName() == null || user.getName().isBlank()) {
                    user.setName(name);
                    userRepository.save(user);
                }
                logger.info("Existing user logged in via {}: email={}", provider, email);
            }

            HttpSession session = request.getSession(true);
            session.setAttribute("user", user);

            String redirectTarget = "admin".equals(user.getCategory()) ? "/admin" : "/";
            String baseUrl = (appBaseUrl != null && !appBaseUrl.isBlank()) ? appBaseUrl.replaceAll("/$", "") : "";
            response.sendRedirect(baseUrl + redirectTarget);
        } catch (Exception e) {
            logger.error("OAuth2 authentication success handler failed", e);
            String baseUrl = (appBaseUrl != null && !appBaseUrl.isBlank()) ? appBaseUrl.replaceAll("/$", "") : "";
            response.sendRedirect(baseUrl + "/sign-in?error=oauth");
        }
    }
}
