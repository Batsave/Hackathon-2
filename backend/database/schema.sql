

-- Mise a jour Table USER ADMIN
-- ----------------------------------------------------------
CREATE TABLE new_user (
    id int AUTO_INCREMENT NOT NULL PRIMARY KEY,
    nom VARCHAR(80) NOT NULL,
    prenom VARCHAR(80) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(512) NOT NULL,
    admin BOOLEAN DEFAULT FALSE NOT NULL,
    token VARCHAR(255) NULL,
    last_login DATETIME NULL
    
);


-- ----------------------------------------------------------

-- Mise a jour Table Transaction
-- ----------------------------------------------------------
CREATE TABLE new_transaction (
    id int AUTO_INCREMENT NOT NULL PRIMARY KEY,
    amount DECIMAL(10, 2) NULL,
    currency VARCHAR(3) NULL,
    paiementType VARCHAR(255) NULL, 
    status VARCHAR(255) NULL,
    date DATETIME NULL,
    transaction_code VARCHAR(255) NULL,
    customer_id VARCHAR(255) NULL,
    description VARCHAR(255) NULL,
    checkout_reference VARCHAR(255) NULL
    
);


-- ----------------------------------------------------------

-- Mise a jour Table Type_Paiement
-- ----------------------------------------------------------
CREATE TABLE new_type_paiement (
    id int AUTO_INCREMENT NOT NULL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL
);


-- ----------------------------------------------------------

-- Mise a jour Table Method_Prise_Rdv
-- ----------------------------------------------------------
CREATE TABLE new_method_prise_rdv (
    id int AUTO_INCREMENT NOT NULL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL
);


-- ----------------------------------------------------------


-- Mise a jour Table RDV
-- ----------------------------------------------------------

CREATE TABLE new_rdv (
    id int AUTO_INCREMENT NOT NULL PRIMARY KEY,
    client_id int NOT NULL,
    date_rdv DATE NOT NULL,
    heure_rdv TIME NOT NULL,
    massage_id int NOT NULL,
    method_prise_rdv INT NULL
);


-- ----------------------------------------------------------



-- Mise a jour Table Massage
-- ----------------------------------------------------------

CREATE TABLE new_massage (
    id int AUTO_INCREMENT NOT NULL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    duree int NOT NULL,
    prix DECIMAL(10, 2) NOT NULL,
    informations TEXT NULL,
    description_id int NULL,
    terapeutique BOOLEAN  DEFAULT FALSE NOT NULL,
    type_table_id int NULL,
    habille BOOLEAN DEFAULT FALSE NOT NULL,
    type_huile_id int NULL  
);


-- ----------------------------------------------------------


-- Mise a jour Table forfait
-- ----------------------------------------------------------
CREATE TABLE new_forfait (
    id int AUTO_INCREMENT NOT NULL PRIMARY KEY,
    forfait_info_id int NOT NULL,
    massage_id int NOT NULL
);


-- ----------------------------------------------------------


-- Mise a jour Table forfait_info
-- ----------------------------------------------------------
CREATE TABLE new_forfait_info (
    id int AUTO_INCREMENT NOT NULL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    nb_seance int DEFAULT 1 NOT NULL,
    description TEXT NULL,
    prix DECIMAL(10, 2) NOT NULL  
);


-- ----------------------------------------------------------

