package com.montblanc.montblanc.Repositories;


import org.springframework.data.jpa.repository.JpaRepository;
import com.montblanc.montblanc.Clases.Categories;


public interface CategoryRepository extends JpaRepository<Categories, Long> {
}
