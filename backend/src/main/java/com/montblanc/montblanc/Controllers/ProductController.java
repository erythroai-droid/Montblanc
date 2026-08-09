package com.montblanc.montblanc.Controllers;

import com.montblanc.montblanc.Clases.Categories;
import com.montblanc.montblanc.Clases.Product;
import com.montblanc.montblanc.Repositories.CategoryRepository;
import com.montblanc.montblanc.Repositories.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
public class ProductController {

    private static final Logger logger = LoggerFactory.getLogger(ProductController.class);

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;


    @GetMapping("/addProduct")
    public String showAddProductForm(Model model) {
        List<Product> products = productRepository.findAll();
        List<Categories> categories = categoryRepository.findAll();
        model.addAttribute("products", products);
        model.addAttribute("categories", categories);
        return "/WEB-INF/views/addProduct.jsp";
    }


    @PostMapping("/addProduct")
    @ResponseBody
    public Map<String, String> addProduct(
            @RequestParam("name") String name,
            @RequestParam("price") String price,
            @RequestParam("categoryId") Long categoryId,
            @RequestParam("special") boolean specialOffers,
            @RequestParam("discount") Long discount,
            @RequestParam("description") String description,
            @RequestParam("image") MultipartFile image) {
        Map<String, String> response = new HashMap<>();
        try {
            byte[] imageBytes = image.getBytes();
            String base64Image = Base64.getEncoder().encodeToString(imageBytes);
            Categories category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new IllegalArgumentException("Invalid category ID"));
            Product product = new Product();
            product.setName(name);
            product.setPrice(price);
            product.setCategory(category);
            product.setSpecialOffers(specialOffers);
            product.setDiscount(discount);
            product.setDescription(description);
            product.setImage(base64Image);
            productRepository.save(product);
            response.put("status", "success");
            response.put("message", "Product added");
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Error: " + e.getMessage());
        }
        return response;
    }


    @GetMapping("/productsView")
    @ResponseBody
    public List<Product> getProducts() {
        return productRepository.findAll();
    }


    @PostMapping("/deleteProduct")
    @ResponseBody
    public Map<String, String> deleteProduct(@RequestParam("id") Long id) {
        logger.info("Request to delete product with id={}", id);
        Map<String, String> response = new HashMap<>();
        try {
            if (productRepository.existsById(id)) {
                productRepository.deleteById(id);
                response.put("status", "success");
                response.put("message", "Product removed");
            } else {
                response.put("status", "error");
                response.put("message", "Product with ID " + id + " not found");
            }
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Error while deleting: " + e.getMessage());
        }
        return response;
    }

}

