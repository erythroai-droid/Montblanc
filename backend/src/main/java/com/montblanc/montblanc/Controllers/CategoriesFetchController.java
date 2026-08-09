package com.montblanc.montblanc.Controllers;

import com.montblanc.montblanc.Clases.Categories;
import com.montblanc.montblanc.Repositories.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class CategoriesFetchController {
    @Autowired
    private CategoryRepository categoryRepository;

    @CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:8080" ,"https://pizza-na-dom.mk.ua"})
    @GetMapping("/categories")
    @ResponseBody
    public List<Categories> getAllCategories(){
        return categoryRepository.findAll();
    }

}
