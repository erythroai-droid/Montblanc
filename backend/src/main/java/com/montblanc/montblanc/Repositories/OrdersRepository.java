package com.montblanc.montblanc.Repositories;

import com.montblanc.montblanc.Clases.Orders;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrdersRepository extends JpaRepository<Orders, Long> {

    List<Orders> findByUserId(Long userId);

    List<Orders> findByUserIdOrderByIdDesc(Long userId);

    List<Orders> findByUserIdOrEmailOrderByIdDesc(Long userId, String email);

    long countByUserId(Long userId);

    long countByUserIdOrEmail(Long userId, String email);
}