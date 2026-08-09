package com.montblanc.montblanc.Controllers;

import com.montblanc.montblanc.Clases.User;
import com.montblanc.montblanc.DTO.RegisterRequest;
import com.montblanc.montblanc.DTO.RegisterResponse;
import com.montblanc.montblanc.DTO.UserSessionDTO;
import com.montblanc.montblanc.Repositories.UserRepository;
import jakarta.servlet.http.HttpSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    private static final String CATEGORY_USER = "user";

    @Autowired
    private UserRepository userRepository;

    @CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:8080", "https://pizza-na-dom.mk.ua"}, allowCredentials = "true")
    @GetMapping("/me")
    public ResponseEntity<UserSessionDTO> me(HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) {
            return ResponseEntity.ok(new UserSessionDTO(null, null));
        }
        String name = user.getName() != null && !user.getName().isBlank() ? user.getName() : user.getLogin();
        return ResponseEntity.ok(new UserSessionDTO(name, user.getLogin()));
    }

    @CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:8080", "https://pizza-na-dom.mk.ua"}, allowCredentials = "true")
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok().build();
    }

    @CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:8080", "https://pizza-na-dom.mk.ua"})
    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@RequestBody RegisterRequest request) {
        if (request.getLogin() == null || request.getLogin().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(new RegisterResponse(false, "Login is required"));
        }
        if (request.getPassword() == null || request.getPassword().length() < 6) {
            return ResponseEntity.badRequest()
                    .body(new RegisterResponse(false, "Password must be at least 6 characters"));
        }
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(new RegisterResponse(false, "Email is required"));
        }
        if (request.getName() == null || request.getName().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(new RegisterResponse(false, "Name is required"));
        }

        if (userRepository.existsByLogin(request.getLogin().trim())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new RegisterResponse(false, "This login is already taken"));
        }
        if (userRepository.existsByEmail(request.getEmail().trim())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new RegisterResponse(false, "This email is already registered"));
        }

        User user = new User();
        user.setName(request.getName().trim());
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setLogin(request.getLogin().trim());
        user.setPassword(request.getPassword());
        user.setCategory(CATEGORY_USER);

        userRepository.save(user);
        logger.info("New user registered: login={}, email={}", user.getLogin(), user.getEmail());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new RegisterResponse(true, "Registration successful"));
    }
}
