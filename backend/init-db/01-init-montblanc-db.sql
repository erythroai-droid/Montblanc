-- ==========================================================
-- Montblanc Initial Database Schema and Seed Data (MariaDB / MySQL)
-- ==========================================================

CREATE DATABASE IF NOT EXISTS `montblanc_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `montblanc_db`;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 1. Table: categories
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `name_ru` VARCHAR(255) DEFAULT NULL,
  `name_he` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `categories` (`id`, `name`, `name_ru`, `name_he`) VALUES
(1, 'Farm gastronomy', 'Фермерская гастрономия', 'גסטרונומיה של משק'),
(2, 'Italian cheeses', 'Итальянские сыры', 'גבינות איטלקיות'),
(3, 'Meat delicacies', 'Мясные деликатесы', 'מעדני בשר'),
(4, 'Italian pasta', 'Итальянская паста', 'פסטה איטלקית'),
(5, 'Olive oil', 'Оливковое масло', 'שמן זית');

-- 2. Table: user
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `login` VARCHAR(255) DEFAULT NULL,
  `email` VARCHAR(255) DEFAULT NULL,
  `password` VARCHAR(255) DEFAULT NULL,
  `name` VARCHAR(255) DEFAULT NULL,
  `category` VARCHAR(255) DEFAULT 'user',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_login` (`login`),
  UNIQUE KEY `uk_user_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `user` (`id`, `login`, `email`, `password`, `name`, `category`) VALUES
(1, 'admin', 'admin@montblanc.com', '12345', 'Administrator', 'admin'),
(2, 'webmechanik@gmail.com', 'webmechanik@gmail.com', '12345', 'Vadim', 'admin');

-- 3. Table: product
DROP TABLE IF EXISTS `product`;
CREATE TABLE `product` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `price` VARCHAR(255) NOT NULL,
  `description` LONGTEXT DEFAULT NULL,
  `image` LONGTEXT DEFAULT NULL,
  `special_offers` BIT(1) NOT NULL DEFAULT b'0',
  `discount` BIGINT DEFAULT 0,
  `category_id` BIGINT DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_product_category` (`category_id`),
  CONSTRAINT `fk_product_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Table: orders
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) DEFAULT NULL,
  `email` VARCHAR(255) DEFAULT NULL,
  `phone` VARCHAR(255) DEFAULT NULL,
  `address` VARCHAR(255) DEFAULT NULL,
  `delivery` VARCHAR(255) DEFAULT NULL,
  `payment` VARCHAR(255) DEFAULT NULL,
  `comment` VARCHAR(255) DEFAULT NULL,
  `total` VARCHAR(255) DEFAULT NULL,
  `user_id` BIGINT DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_orders_user` (`user_id`),
  CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Table: order_products
DROP TABLE IF EXISTS `order_products`;
CREATE TABLE `order_products` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) DEFAULT NULL,
  `price` VARCHAR(255) DEFAULT NULL,
  `value` VARCHAR(255) DEFAULT NULL,
  `image` LONGTEXT DEFAULT NULL,
  `order_id` BIGINT DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_order_products_order` (`order_id`),
  CONSTRAINT `fk_order_products_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
