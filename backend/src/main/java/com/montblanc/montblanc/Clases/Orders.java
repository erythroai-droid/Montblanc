package com.montblanc.montblanc.Clases;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;


@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Orders {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String address;

    /** Id пользователя, если заказ оформлен под авторизованным пользователем; null для гостевых заказов */
    private Long userId;
    private String phone;
    private String comment;
    private String delivery;
    private String payment;
    private String total;

    @OneToMany(mappedBy = "orders", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderProducts> products = new ArrayList<>();
}