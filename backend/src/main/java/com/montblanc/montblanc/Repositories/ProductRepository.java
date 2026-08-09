package com.montblanc.montblanc.Repositories;

import com.montblanc.montblanc.Clases.Product;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {

    @Override
    @EntityGraph(attributePaths = {"category"})
    List<Product> findAll();

    @EntityGraph(attributePaths = {"category"})
    List<Product> findByCategoryId(Long categoryId);

    @Override
    @EntityGraph(attributePaths = {"category"})
    Optional<Product> findById(Long id);

    Optional<List<Product>> findByName(String name);
}