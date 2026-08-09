package com.montblanc.montblanc.DTO;

import lombok.Data;

@Data
public class ProductDTO {
    private Long id;
    private String name;
    private String price;
    private String image;
    private String categoryName;
    private String description;
    private Long discount;
    private boolean specialOffers;
}
