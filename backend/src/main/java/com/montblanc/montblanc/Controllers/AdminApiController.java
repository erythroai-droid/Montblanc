package com.montblanc.montblanc.Controllers;

import com.montblanc.montblanc.Clases.Categories;
import com.montblanc.montblanc.Clases.Orders;
import com.montblanc.montblanc.Clases.Product;
import com.montblanc.montblanc.Clases.User;
import com.montblanc.montblanc.DTO.ProductDTO;
import com.montblanc.montblanc.Repositories.CategoryRepository;
import com.montblanc.montblanc.Repositories.OrdersRepository;
import com.montblanc.montblanc.Repositories.ProductRepository;
import com.montblanc.montblanc.Repositories.UserRepository;
import jakarta.servlet.http.HttpSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminApiController {

    private static final Logger logger = LoggerFactory.getLogger(AdminApiController.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrdersRepository ordersRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    private boolean checkAdmin(HttpSession session) {
        User currentUser = (User) session.getAttribute("user");
        return currentUser != null && "admin".equals(currentUser.getCategory());
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats(HttpSession session) {
        User currentUser = (User) session.getAttribute("user");
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("authenticated", false));
        }

        boolean isAdmin = "admin".equals(currentUser.getCategory());
        Map<String, Object> stats = new HashMap<>();
        stats.put("authenticated", true);
        stats.put("isAdmin", isAdmin);
        stats.put("userName", currentUser.getName() != null && !currentUser.getName().isBlank() ? currentUser.getName() : currentUser.getLogin());
        stats.put("userEmail", currentUser.getEmail());
        stats.put("userId", currentUser.getId());

        if (isAdmin) {
            stats.put("orderCount", ordersRepository.count());
            stats.put("productCount", productRepository.count());
            stats.put("categoryCount", categoryRepository.count());
        } else {
            long userOrdersCount = (currentUser.getEmail() != null && !currentUser.getEmail().isBlank())
                    ? ordersRepository.countByUserIdOrEmail(currentUser.getId(), currentUser.getEmail())
                    : ordersRepository.countByUserId(currentUser.getId());
            stats.put("orderCount", userOrdersCount);
            stats.put("userOrderCount", userOrdersCount);
            stats.put("productCount", 0);
            stats.put("categoryCount", 0);
        }

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/orders")
    public ResponseEntity<?> getOrders(HttpSession session) {
        User currentUser = (User) session.getAttribute("user");
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Unauthorized"));
        }

        if ("admin".equals(currentUser.getCategory())) {
            List<Orders> orders = ordersRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
            return ResponseEntity.ok(orders);
        } else {
            List<Orders> userOrders;
            if (currentUser.getEmail() != null && !currentUser.getEmail().isBlank()) {
                userOrders = ordersRepository.findByUserIdOrEmailOrderByIdDesc(currentUser.getId(), currentUser.getEmail());
            } else {
                userOrders = ordersRepository.findByUserIdOrderByIdDesc(currentUser.getId());
            }
            return ResponseEntity.ok(userOrders);
        }
    }

    @DeleteMapping("/orders/{id}")
    public ResponseEntity<?> deleteOrder(@PathVariable("id") Long id, HttpSession session) {
        if (!checkAdmin(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Forbidden"));
        }
        if (ordersRepository.existsById(id)) {
            ordersRepository.deleteById(id);
            logger.info("Admin deleted order ID: {}", id);
            return ResponseEntity.ok(Map.of("status", "success", "message", "Order deleted"));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Order not found"));
    }

    @GetMapping("/products")
    public ResponseEntity<?> getProducts() {
        List<Product> products = productRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
        List<ProductDTO> dtos = products.stream().map(product -> {
            ProductDTO dto = new ProductDTO();
            dto.setId(product.getId());
            dto.setName(product.getName());
            dto.setPrice(product.getPrice());
            dto.setImage(product.getImage());
            dto.setDescription(product.getDescription());
            dto.setDiscount(product.getDiscount());
            dto.setSpecialOffers(product.isSpecialOffers());
            dto.setCategoryName(product.getCategory() != null ? product.getCategory().getName() : null);
            return dto;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PostMapping("/products")
    public ResponseEntity<?> addProduct(
            @RequestParam("name") String name,
            @RequestParam("price") String price,
            @RequestParam("categoryId") Long categoryId,
            @RequestParam(value = "special", defaultValue = "false") boolean specialOffers,
            @RequestParam(value = "discount", defaultValue = "0") Long discount,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam(value = "imageBase64", required = false) String imageBase64,
            HttpSession session) {

        if (!checkAdmin(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Forbidden"));
        }

        try {
            String finalImageBase64 = imageBase64;
            if (image != null && !image.isEmpty()) {
                byte[] imageBytes = image.getBytes();
                finalImageBase64 = Base64.getEncoder().encodeToString(imageBytes);
            }

            Categories category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new IllegalArgumentException("Invalid category ID: " + categoryId));

            Product product = new Product();
            product.setName(name);
            product.setPrice(price);
            product.setCategory(category);
            product.setSpecialOffers(specialOffers);
            product.setDiscount(discount);
            product.setDescription(description != null ? description : "");
            if (finalImageBase64 != null) {
                product.setImage(finalImageBase64);
            }

            productRepository.save(product);
            logger.info("Admin created product: {}", product.getName());
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("status", "success", "message", "Product created", "id", product.getId()));
        } catch (Exception e) {
            logger.error("Error creating product", e);
            return ResponseEntity.badRequest().body(Map.of("status", "error", "message", e.getMessage()));
        }
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable("id") Long id, HttpSession session) {
        if (!checkAdmin(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Forbidden"));
        }
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            logger.info("Admin deleted product ID: {}", id);
            return ResponseEntity.ok(Map.of("status", "success", "message", "Product deleted"));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Product not found"));
    }

    @GetMapping("/categories")
    public ResponseEntity<?> getCategories() {
        return ResponseEntity.ok(categoryRepository.findAll());
    }

    @PostMapping("/categories")
    public ResponseEntity<?> addCategory(
            @RequestParam("name") String name,
            @RequestParam(value = "name_ru", required = false) String nameRu,
            @RequestParam(value = "name_he", required = false) String nameHe,
            HttpSession session) {

        if (!checkAdmin(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Forbidden"));
        }

        try {
            Categories category = new Categories();
            category.setName(name.trim());
            if (nameRu != null && !nameRu.isBlank()) category.setName_ru(nameRu.trim());
            if (nameHe != null && !nameHe.isBlank()) category.setName_he(nameHe.trim());

            categoryRepository.save(category);
            logger.info("Admin created category: {}", category.getName());
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("status", "success", "message", "Category created", "id", category.getId()));
        } catch (Exception e) {
            logger.error("Error creating category", e);
            return ResponseEntity.badRequest().body(Map.of("status", "error", "message", e.getMessage()));
        }
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable("id") Long id, HttpSession session) {
        if (!checkAdmin(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Forbidden"));
        }
        if (categoryRepository.existsById(id)) {
            categoryRepository.deleteById(id);
            logger.info("Admin deleted category ID: {}", id);
            return ResponseEntity.ok(Map.of("status", "success", "message", "Category deleted"));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Category not found"));
    }
}
