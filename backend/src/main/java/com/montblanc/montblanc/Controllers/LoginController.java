package com.montblanc.montblanc.Controllers;

import com.montblanc.montblanc.Clases.User;
import com.montblanc.montblanc.DTO.UserSessionDTO;
import com.montblanc.montblanc.Repositories.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;

@RestController
public class LoginController {
    private static final Logger logger = LoggerFactory.getLogger(LoginController.class);

    @Autowired
    private UserRepository userRepository;

    @Value("${app.base-url:http://localhost:3000}")
    private String appBaseUrl;

    @PostMapping("/login")
    public void formLogin(
            @RequestParam("login") String login,
            @RequestParam("password") String password,
            HttpSession session,
            HttpServletResponse response) throws IOException {

        User user = userRepository.findByLogin(login.trim());
        if (user == null) {
            user = userRepository.findByEmail(login.trim().toLowerCase());
        }

        String baseUrl = (appBaseUrl != null && !appBaseUrl.isBlank()) ? appBaseUrl.replaceAll("/$", "") : "";

        if (user != null && user.getPassword().equals(password)) {
            logger.info("User '{}' successfully authenticated", login);
            session.setAttribute("user", user);
            if ("admin".equals(user.getCategory())) {
                response.sendRedirect(baseUrl + "/admin");
            } else {
                response.sendRedirect(baseUrl + "/");
            }
        } else {
            logger.warn("Failed login attempt for user '{}'", login);
            response.sendRedirect(baseUrl + "/sign-in?error=invalid_credentials");
        }
    }

    @PostMapping("/api/login")
    public ResponseEntity<?> apiLogin(@RequestBody Map<String, String> body, HttpSession session) {
        String login = body.get("login");
        String password = body.get("password");

        if (login == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Login and password required"));
        }

        User user = userRepository.findByLogin(login.trim());
        if (user == null) {
            user = userRepository.findByEmail(login.trim().toLowerCase());
        }

        if (user != null && user.getPassword().equals(password)) {
            logger.info("User '{}' authenticated via API", login);
            session.setAttribute("user", user);
            boolean isAdmin = "admin".equals(user.getCategory());
            String name = user.getName() != null && !user.getName().isBlank() ? user.getName() : user.getLogin();
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "isAdmin", isAdmin,
                    "userName", name,
                    "email", user.getEmail() != null ? user.getEmail() : ""
            ));
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("success", false, "message", "Invalid login or password"));
    }
}
