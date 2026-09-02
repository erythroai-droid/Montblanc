package com.montblanc.montblanc.Controllers;

import com.montblanc.montblanc.Clases.Product;

import com.montblanc.montblanc.DTO.ProductDTO;
import com.montblanc.montblanc.Repositories.CategoryRepository;
import com.montblanc.montblanc.Repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
public class ProductFetchController {
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @GetMapping("/products")
    @ResponseBody
    public List<ProductDTO> getProducts(
            @RequestParam(name = "product_id", required = false) Long productId,
            @RequestParam(name = "category_id", required = false) Long categoryId) {

        List<Product> products;

        if (productId != null) {
            // Получаем один товар по ID
            Optional<Product> productOptional = productRepository.findById(productId);
            if (productOptional.isEmpty()) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Product with ID " + productId + " not found");
            }
            products = List.of(productOptional.get());  // Оборачиваем в список для унификации
        } else if (categoryId != null) {
            // Проверяем, существует ли категория
            if (!categoryRepository.existsById(categoryId)) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Category with ID " + categoryId + " not found");
            }
            products = productRepository.findByCategoryId(categoryId);
        } else {
            products = productRepository.findAll();
        }

        // Преобразуем в DTO
        return products.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Вспомогательный метод для конвертации
    private ProductDTO convertToDTO(Product product) {
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
    }
}