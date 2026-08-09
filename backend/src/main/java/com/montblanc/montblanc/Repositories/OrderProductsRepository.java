package com.montblanc.montblanc.Repositories;

import com.montblanc.montblanc.Clases.OrderProducts;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderProductsRepository extends JpaRepository<OrderProducts, Long> {
}
