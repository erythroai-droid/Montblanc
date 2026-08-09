-- Добавление связи заказов с пользователем (для разграничения в админке).
-- Существующие заказы остаются с user_id = NULL (гостевые).

USE montblanc_db;

ALTER TABLE orders
  ADD COLUMN user_id BIGINT NULL,
  ADD CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES user(id);
