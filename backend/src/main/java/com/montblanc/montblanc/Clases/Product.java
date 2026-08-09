package com.montblanc.montblanc.Clases;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Cacheable
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE, region = "com.montblanc.montblanc.Clases.Product")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String price;
    private boolean specialOffers;
    private Long discount;

    @Column(columnDefinition = "LONGTEXT")
    private String description;


    @ManyToOne
    @JoinColumn(name = "category_id")
    private Categories category;

    @Column(columnDefinition = "LONGTEXT")
    private String image;

}
