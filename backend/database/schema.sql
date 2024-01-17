-- Products Table
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
    productId VARCHAR(255) NOT NULL PRIMARY KEY,
    brand VARCHAR(255) NOT NULL,
    productName VARCHAR(255) NOT NULL,
    productCategory VARCHAR(255) NOT NULL,
    reducedPrice DECIMAL(10, 2) NOT NULL,
    reducedQuantity INT NOT NULL
);


-- ----------------------------------------------------------

-- Salons Table
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS salons (
   country VARCHAR(80) NOT NULL, 
   salonId VARCHAR(255) NOT NULL PRIMARY KEY,
   systemCreationDate VARCHAR(255) NOT NULL,
   salonName VARCHAR(255) NOT NULL,
   city VARCHAR(80) NOT NULL
);


-- ----------------------------------------------------------

-- Orders table
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
    country VARCHAR(80) NOT NULL,
    orderId VARCHAR(255) NOT NULL PRIMARY KEY,
    salonId VARCHAR(255) NOT NULL,
    orderDateTime DATETIME NULL,
    totalAmount INT NOT NULL,
    totalQuantity INT NOT NULL
);


-- ----------------------------------------------------------

-- Emails table
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS emails (
    stylistId VARCHAR(255) NOT NULL,
    emailId VARCHAR(255) NOT NULL PRIMARY KEY,
    emailName VARCHAR(255) NOT NULL,
    sendDateTime DATETIME NULL,
    openDateTime DATETIME NULL,
    clickDateTime DATETIME NULL
);


-- ----------------------------------------------------------


-- Order_lines Table
-- ----------------------------------------------------------

CREATE TABLE IF NOT EXISTS order_lines (
    country VARCHAR(255) NOT NULL,
    orderId VARCHAR(255) NOT NULL,
    salonId VARCHAR(255) NOT NULL,
    orderDateTime DATETIME NULL,
    productId VARCHAR(255) NOT NULL,
    productBasePrice INT NOT NULL,
    productQuantity INT NOT NULL,
    productTotalPrice INT NOT NULL
);


-- ----------------------------------------------------------
-- Table Stylist
-- ----------------------------------------------------------

CREATE TABLE IF NOT EXISTS stylists (
    country VARCHAR(255) NOT NULL,
    stylistId VARCHAR(255) NOT NULL PRIMARY KEY,
    salonId VARCHAR(255) NOT NULL,
    systemCreationDate DATETIME NULL,
    firstName VARCHAR(255) NULL,
    lastName VARCHAR(255) NULL,
    stylistRole VARCHAR(255) NULL,
    optinValue BOOLEAN DEFAULT FALSE NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    stylistId VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(512) NOT NULL,
    admin BOOLEAN DEFAULT FALSE NOT NULL,
    token VARCHAR(255) NULL,
    last_login DATETIME NULL
);


-- ----------------------------------------------------------




ALTER TABLE stylists ADD CONSTRAINT fk_salonId_stylists FOREIGN KEY (salonId) REFERENCES salons (salonId) ON UPDATE CASCADE;

ALTER TABLE orders ADD CONSTRAINT fk_salonId_orders FOREIGN KEY (salonId) REFERENCES salons (salonId);

ALTER TABLE order_lines ADD CONSTRAINT fk_productId_orderlines FOREIGN KEY (productId) REFERENCES products (productId);
ALTER TABLE order_lines ADD CONSTRAINT fk_orderId_orderlines FOREIGN KEY (orderId) REFERENCES orders (orderId);
ALTER TABLE order_lines ADD CONSTRAINT fk_salonId_orderlines FOREIGN KEY (salonId) REFERENCES salons (salonId);

ALTER TABLE emails ADD CONSTRAINT fk_stylistId_emails FOREIGN KEY (stylistId) REFERENCES stylists (stylistId);

ALTER TABLE users ADD CONSTRAINT fk_stylistId_users FOREIGN KEY (stylistId) REFERENCES stylists (stylistId);