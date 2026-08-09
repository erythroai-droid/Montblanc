package com.montblanc.montblanc.Controllers;

import com.montblanc.montblanc.Clases.Categories;
import com.montblanc.montblanc.Repositories.CategoryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
public class CategoryController {

    private static final Logger logger = LoggerFactory.getLogger(CategoryController.class);

    @Autowired
    private CategoryRepository categoryRepository;

    @GetMapping("/addCategory")
    public String showCategoryList(Model model){
        List<Categories> categories = categoryRepository.findAll();
        model.addAttribute("categories", categories);
        return "/WEB-INF/views/addCategory.jsp";
    }

    @PostMapping("/addCategory")
    @ResponseBody
    public Map<String, String> addCategory(
            @RequestParam("name") String name) {
        Map<String, String> response = new HashMap<>();
        try {
            Categories categories = new Categories();
            categories.setName(name);

            categoryRepository.save(categories);
            response.put("status", "success");
            response.put("message", "Category added");
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Error: " + e.getMessage());
        }
        return response;
    }

    @PostMapping("/deleteCategory")
    @ResponseBody
    public Map<String, String> deleteCategory(@RequestParam("id") Long id) {
        logger.info("Request to delete category with id={}", id);
        Map<String, String> response = new HashMap<>();
        try {
            if (categoryRepository.existsById(id)) {
                categoryRepository.deleteById(id);
                response.put("status", "success");
                response.put("message", "Category removed");
            } else {
                response.put("status", "error");
                response.put("message", "Category with ID " + id + " not found");
            }
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Error while deleting: " + e.getMessage());
        }
        return response;
    }
}