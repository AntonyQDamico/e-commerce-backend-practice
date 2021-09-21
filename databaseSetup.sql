CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name text,
  price money,
  stock number
);

CREATE TABLE carts (
  id SERIAL PRIMARY KEY,
  user_id int,
  created date
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  password varchar(50),
  email varchar(50),
  first_name varchar(20),
  last_name varchar(20)
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id int,
  status varchar(25),
  created date,
  CONSTRAINT FK_orders_user_id
    FOREIGN KEY (user_id)
      REFERENCES users(id)
);

CREATE TABLE product_description (
  product_id int UNIQUE,
  description text,
  CONSTRAINT FK_product_description_product_id
    FOREIGN KEY (product_id)
      REFERENCES products(id)
);

CREATE TABLE orders_items (
  order_id int,
  product_id int,
  quantity int,
  price money,
  CONSTRAINT FK_orders_items_order_id
    FOREIGN KEY (order_id)
      REFERENCES orders(id),
  CONSTRAINT FK_orders_items_product_id
    FOREIGN KEY (product_id)
      REFERENCES products(id),
  PRIMARY KEY (order_id, product_id)
);

CREATE TABLE carts_items (
  cart_id int,
  product_id int,
  quantity int,
  CONSTRAINT FK_carts_items_cart_id
    FOREIGN KEY (cart_id)
      REFERENCES carts(id),
  CONSTRAINT FK_carts_items_product_id
    FOREIGN KEY (product_id)
      REFERENCES products(id),
  PRIMARY KEY (cart_id, product_id)
);

