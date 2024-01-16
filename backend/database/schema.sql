DROP PROCEDURE IF EXISTS DeleteForeignKey;
CREATE PROCEDURE DeleteForeignKey()
BEGIN
    -- Table : massage 
    IF EXISTS (SELECT * FROM information_schema.tables WHERE table_schema = 'Epimeleia_Massage_DB' AND table_name = 'massage')
        THEN 
            IF EXISTS (SELECT * FROM information_schema.key_column_usage WHERE table_schema = 'Epimeleia_Massage_DB' AND table_name = 'massage' AND CONSTRAINT_NAME = 'fk_type_huile')
            THEN ALTER TABLE massage DROP FOREIGN KEY fk_type_huile;
            END IF;

            IF EXISTS (SELECT * FROM information_schema.key_column_usage WHERE table_schema = 'Epimeleia_Massage_DB' AND table_name = 'massage' AND CONSTRAINT_NAME = 'fk_type_table') 
            THEN ALTER TABLE massage DROP FOREIGN KEY fk_type_table; 
            END IF;

            IF EXISTS (SELECT * FROM information_schema.key_column_usage WHERE table_schema = 'Epimeleia_Massage_DB' AND table_name = 'massage' AND CONSTRAINT_NAME = 'fk_description')
            THEN ALTER TABLE massage DROP FOREIGN KEY fk_description;
            END IF; 
    END IF;

    -- Table : forfait_souscrit 
    IF EXISTS (SELECT * FROM information_schema.tables WHERE table_schema = 'Epimeleia_Massage_DB' AND table_name = 'forfait_souscrit')
        THEN 
            IF EXISTS (SELECT * FROM information_schema.key_column_usage WHERE table_schema = 'Epimeleia_Massage_DB' AND table_name = 'forfait_souscrit' AND CONSTRAINT_NAME = 'fk_forfait_souscrit_client')
            THEN ALTER TABLE forfait_souscrit DROP FOREIGN KEY fk_forfait_souscrit_client;
            END IF;
            IF EXISTS (SELECT * FROM information_schema.key_column_usage WHERE table_schema = 'Epimeleia_Massage_DB' AND table_name = 'forfait_souscrit' AND CONSTRAINT_NAME = 'fk_forfait_souscrit_forfait')
            THEN ALTER TABLE forfait_souscrit DROP FOREIGN KEY fk_forfait_souscrit_forfait;
            END IF;
    END IF;

    -- Table : carte_cadeau 
    IF EXISTS (SELECT * FROM information_schema.tables WHERE table_schema = 'Epimeleia_Massage_DB' AND table_name = 'carte_cadeau') 
        THEN 
            IF EXISTS (SELECT * FROM information_schema.key_column_usage WHERE table_schema = 'Epimeleia_Massage_DB' AND table_name = 'carte_cadeau' AND CONSTRAINT_NAME = 'fk_carte_cadeau_client') 
            THEN ALTER TABLE carte_cadeau DROP FOREIGN KEY fk_carte_cadeau_client; 
            END IF; 

            IF EXISTS (SELECT * FROM information_schema.key_column_usage WHERE table_schema = 'Epimeleia_Massage_DB' AND table_name = 'carte_cadeau' AND CONSTRAINT_NAME = 'fk_carte_cadeau_acheteur') 
            THEN ALTER TABLE carte_cadeau DROP FOREIGN KEY fk_carte_cadeau_acheteur; 
            END IF;

            IF EXISTS (SELECT * FROM information_schema.key_column_usage WHERE table_schema = 'Epimeleia_Massage_DB' AND table_name = 'carte_cadeau' AND CONSTRAINT_NAME = 'fk_carte_cadeau_forfait') 
            THEN ALTER TABLE carte_cadeau DROP FOREIGN KEY fk_carte_cadeau_forfait;
            END IF;

            IF EXISTS (SELECT * FROM information_schema.key_column_usage WHERE table_schema = 'Epimeleia_Massage_DB' AND table_name = 'carte_cadeau' AND CONSTRAINT_NAME = 'fk_carte_cadeau_massage')
            THEN ALTER TABLE carte_cadeau DROP FOREIGN KEY fk_carte_cadeau_massage;
            END IF; 

            IF EXISTS (SELECT * FROM information_schema.key_column_usage WHERE table_schema = 'Epimeleia_Massage_DB' AND table_name = 'carte_cadeau' AND CONSTRAINT_NAME = 'fk_type_paiement')
            THEN ALTER TABLE carte_cadeau DROP FOREIGN KEY fk_type_paiement;
            END IF;
    END IF;
  
   -- Table : rdv
    IF EXISTS (SELECT * FROM information_schema.tables WHERE table_schema = 'Epimeleia_Massage_DB' AND table_name = 'rdv')
        THEN 
            IF EXISTS (SELECT * FROM information_schema.key_column_usage WHERE table_schema = 'Epimeleia_Massage_DB' AND table_name = 'rdv' AND CONSTRAINT_NAME = 'fk_method_prise_rdv')
            THEN ALTER TABLE rdv DROP FOREIGN KEY fk_method_prise_rdv;
            END IF;

            IF EXISTS (SELECT * FROM information_schema.key_column_usage WHERE table_schema = 'Epimeleia_Massage_DB' AND table_name = 'rdv' AND CONSTRAINT_NAME = 'fk_rdv_massage')
            THEN ALTER TABLE rdv DROP FOREIGN KEY fk_rdv_massage;
            END IF;

            IF EXISTS (SELECT * FROM information_schema.key_column_usage WHERE table_schema = 'Epimeleia_Massage_DB' AND table_name = 'rdv' AND CONSTRAINT_NAME = 'fk_rdv_client')
            THEN ALTER TABLE rdv DROP FOREIGN KEY fk_rdv_client;
        END IF;

    END IF;

    -- Table : forfait
    IF EXISTS (SELECT * FROM information_schema.tables WHERE table_schema = 'Epimeleia_Massage_DB' AND table_name = 'forfait')
        THEN 
            IF EXISTS (SELECT * FROM information_schema.key_column_usage WHERE table_schema = 'Epimeleia_Massage_DB' AND table_name = 'forfait' AND CONSTRAINT_NAME = 'fk_forfait_info')
            THEN ALTER TABLE forfait DROP FOREIGN KEY fk_forfait_info;
            END IF;

            IF EXISTS (SELECT * FROM information_schema.key_column_usage WHERE table_schema = 'Epimeleia_Massage_DB' AND table_name = 'forfait' AND CONSTRAINT_NAME = 'fk_forfait_massage')
            THEN ALTER TABLE forfait DROP FOREIGN KEY fk_forfait_massage;
            END IF;
    END IF;

END; 

DROP PROCEDURE IF EXISTS CopyDataIfUserExists;
CREATE PROCEDURE CopyDataIfUserExists()
BEGIN
    IF EXISTS (SELECT * FROM information_schema.tables WHERE table_schema = 'Epimeleia_Massage_DB' AND table_name = 'user') THEN
        INSERT INTO new_user (nom, prenom, email, password, admin, token, last_login)
        SELECT nom, prenom, email, password, admin, token, last_login FROM user;
    END IF;
END;

DROP PROCEDURE IF EXISTS CopyDataIfTypePaiementsExists;
CREATE PROCEDURE CopyDataIfTypePaiementsExists()
BEGIN
    IF EXISTS (SELECT * FROM information_schema.tables WHERE table_schema = 'Epimeleia_Massage_DB' AND table_name = 'type_paiement') THEN
        INSERT INTO new_type_paiement (id, nom)
        SELECT id, nom FROM type_paiement;
    END IF;
END;

DROP PROCEDURE IF EXISTS CopyDataIfTransactionExists;
CREATE PROCEDURE CopyDataIfTransactionExists()
BEGIN
    IF EXISTS (SELECT * FROM information_schema.tables WHERE table_schema = 'Epimeleia_Massage_DB' AND table_name = 'transaction') THEN
        INSERT INTO new_transaction (id, amount, currency, paiementType, status, date, transaction_code, customer_id, description, checkout_reference)
        SELECT id, amount, currency, paiementType, status, date, transaction_code, customer_id, description, checkout_reference FROM transaction;
    END IF;
END;

DROP PROCEDURE IF EXISTS CopyDataIfMethod_Prise_RdvExists;
CREATE PROCEDURE CopyDataIfMethod_Prise_RdvExists()
BEGIN
    IF EXISTS (SELECT * FROM information_schema.tables WHERE table_schema = 'Epimeleia_Massage_DB' AND table_name = 'method_prise_rdv') THEN
        INSERT INTO new_method_prise_rdv (id, nom)
        SELECT id, nom FROM method_prise_rdv;
    END IF;
END;

DROP PROCEDURE IF EXISTS CopyDataIfRdvExists;
CREATE PROCEDURE CopyDataIfRdvExists()
BEGIN
    IF EXISTS (SELECT * FROM information_schema.tables WHERE table_schema = 'Epimeleia_Massage_DB' AND table_name = 'rdv') THEN
        INSERT INTO new_rdv (id, client_id, date_rdv, heure_rdv, massage_id)
        SELECT id, client_id, date_rdv, heure_rdv, massage_id FROM rdv;
        
    END IF;
END;

DROP PROCEDURE IF EXISTS CopyDataIfMassageExists;
CREATE PROCEDURE CopyDataIfMassageExists()
BEGIN
    IF EXISTS (SELECT * FROM information_schema.tables WHERE table_schema = 'Epimeleia_Massage_DB' AND table_name = 'massage') THEN
        INSERT INTO new_massage (id, nom, duree, prix, informations, description_id, terapeutique, type_table_id, habille, type_huile_id)
        SELECT id, nom, duree, prix, informations, description_id, terapeutique, type_table_id, habille, type_huile_id FROM massage;
    END IF;
END;

DROP PROCEDURE IF EXISTS CopyDataIfForfaitInfoExists;
CREATE PROCEDURE CopyDataIfForfaitInfoExists()
BEGIN
    IF EXISTS (SELECT * FROM information_schema.tables WHERE table_schema = 'Epimeleia_Massage_DB' AND table_name = 'forfait_info') THEN
        INSERT INTO new_forfait_info (id, nom, nb_seance, description, prix)
        SELECT id, nom, nb_seance, description, prix FROM forfait_info;
    END IF;
END;

DROP PROCEDURE IF EXISTS CopyDataIfForfaitExists;
CREATE PROCEDURE CopyDataIfForfaitExists()
BEGIN
    IF EXISTS (SELECT * FROM information_schema.tables WHERE table_schema = 'Epimeleia_Massage_DB' AND table_name = 'forfait') THEN
        INSERT INTO new_forfait (id, forfait_info_id, massage_id)
        SELECT id, forfait_info_id, massage_id FROM forfait;
    END IF;
END;

DROP PROCEDURE IF EXISTS CopyDataIfForfait_SouscritExists;
CREATE PROCEDURE CopyDataIfForfait_SouscritExists()
BEGIN
    IF EXISTS (SELECT * FROM information_schema.tables WHERE table_schema = 'Epimeleia_Massage_DB' AND table_name = 'forfait_souscrit') THEN
        INSERT INTO new_forfait_souscrit (id, forfait_id, client_id, nb_seance_restante, date_achat, date_expiration)
        SELECT id, forfait_id, client_id, nb_seance_restante, date_achat, date_expiration FROM forfait_souscrit;
    END IF;
END;

DROP PROCEDURE IF EXISTS  CopyDataIfType_HuileExists;
CREATE PROCEDURE CopyDataIfType_HuileExists()
BEGIN
    IF EXISTS (SELECT * FROM information_schema.tables WHERE table_schema = 'Epimeleia_Massage_DB' AND table_name = 'type_huile') THEN
        INSERT INTO new_type_huile (id, nom)
        SELECT id, nom FROM type_huile;
    END IF;
END;

DROP PROCEDURE IF EXISTS CopyDataIfType_TableExists;
CREATE PROCEDURE CopyDataIfType_TableExists()
BEGIN
    IF EXISTS (SELECT * FROM information_schema.tables WHERE table_schema = 'Epimeleia_Massage_DB' AND table_name = 'type_table') THEN
        INSERT INTO new_type_table (id, nom)
        SELECT id, nom FROM type_table;
    END IF;
END;

DROP PROCEDURE IF EXISTS CopyDataIfDescriptionExists;
CREATE PROCEDURE CopyDataIfDescriptionExists()
BEGIN
    IF EXISTS (SELECT * FROM information_schema.tables WHERE table_schema = 'Epimeleia_Massage_DB' AND table_name = 'description') THEN
        INSERT INTO new_description (id, origine, description, bienfaits, contre_indications)
        SELECT id, origine, description, bienfaits, contre_indications FROM description;
    END IF;
END;

DROP PROCEDURE IF EXISTS CopyDataIfCarte_CadeauExists;
CREATE PROCEDURE CopyDataIfCarte_CadeauExists()
BEGIN
    IF EXISTS (SELECT * FROM information_schema.tables WHERE table_schema = 'Epimeleia_Massage_DB' AND table_name = 'carte_cadeau') THEN
        INSERT INTO new_carte_cadeau (id, client_id, massage_id, forfait_id, montant, paiementType, acheteur_id, date_achat, date_expiration, utilise)
        SELECT id, client_id, massage_id, forfait_id, montant, paiementType, acheteur_id, date_achat, date_expiration, utilise FROM carte_cadeau;
    END IF;
END;

DROP PROCEDURE IF EXISTS CopyDataIfClientExists;
CREATE PROCEDURE CopyDataIfClientExists()
BEGIN
    IF EXISTS (SELECT * FROM information_schema.tables WHERE table_schema = 'Epimeleia_Massage_DB' AND table_name = 'client') THEN
        INSERT INTO new_client (id, nom, prenom, email, telephone, adresse, code_postal, ville, notes, creation_date)
        SELECT id, nom, prenom, email, telephone, adresse, code_postal, ville, notes, creation_date FROM client;
    END IF;
END;


CALL DeleteForeignKey();

-- Mise a jour Table USER ADMIN
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS new_user (
    id int AUTO_INCREMENT NOT NULL PRIMARY KEY,
    nom VARCHAR(80) NOT NULL,
    prenom VARCHAR(80) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(512) NOT NULL,
    admin BOOLEAN DEFAULT FALSE NOT NULL,
    token VARCHAR(255) NULL,
    last_login DATETIME NULL
    
);
CALL CopyDataIfUserExists();
DROP TABLE IF EXISTS user;
ALTER TABLE new_user RENAME TO user;

-- ----------------------------------------------------------

-- Mise a jour Table Transaction
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS new_transaction (
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
CALL CopyDataIfTransactionExists();
DROP TABLE IF EXISTS transaction;
ALTER TABLE new_transaction RENAME TO transaction;

-- ----------------------------------------------------------

-- Mise a jour Table Type_Paiement
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS new_type_paiement (
    id int AUTO_INCREMENT NOT NULL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL
);
CALL CopyDataIfTypePaiementsExists();
DROP TABLE IF EXISTS type_paiement;
ALTER TABLE new_type_paiement RENAME TO type_paiement;

-- ----------------------------------------------------------

-- Mise a jour Table Method_Prise_Rdv
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS new_method_prise_rdv (
    id int AUTO_INCREMENT NOT NULL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL
);
CALL CopyDataIfMethod_Prise_RdvExists();
DROP TABLE IF EXISTS method_prise_rdv;
ALTER TABLE new_method_prise_rdv RENAME TO method_prise_rdv;

-- ----------------------------------------------------------


-- Mise a jour Table RDV
-- ----------------------------------------------------------

CREATE TABLE IF NOT EXISTS new_rdv (
    id int AUTO_INCREMENT NOT NULL PRIMARY KEY,
    client_id int NOT NULL,
    date_rdv DATE NOT NULL,
    heure_rdv TIME NOT NULL,
    massage_id int NOT NULL,
    method_prise_rdv INT NULL
);
CALL CopyDataIfRdvExists();

DROP TABLE IF EXISTS rdv;
ALTER TABLE new_rdv RENAME TO rdv;

-- ----------------------------------------------------------



-- Mise a jour Table Massage
-- ----------------------------------------------------------

CREATE TABLE IF NOT EXISTS new_massage (
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
CALL CopyDataIfMassageExists();

DROP TABLE IF EXISTS massage;
ALTER TABLE new_massage RENAME TO massage;

-- ----------------------------------------------------------


-- Mise a jour Table forfait
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS new_forfait (
    id int AUTO_INCREMENT NOT NULL PRIMARY KEY,
    forfait_info_id int NOT NULL,
    massage_id int NOT NULL
);
CALL CopyDataIfForfaitExists();

DROP TABLE IF EXISTS forfait;
ALTER TABLE new_forfait RENAME TO forfait;

-- ----------------------------------------------------------


-- Mise a jour Table forfait_info
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS new_forfait_info (
    id int AUTO_INCREMENT NOT NULL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    nb_seance int DEFAULT 1 NOT NULL,
    description TEXT NULL,
    prix DECIMAL(10, 2) NOT NULL  
);
CALL CopyDataIfForfaitInfoExists();

DROP TABLE IF EXISTS forfait_info;
ALTER TABLE new_forfait_info RENAME TO forfait_info;

-- ----------------------------------------------------------



-- Mise a jour Table Forfait_Souscrit
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS new_forfait_souscrit (
    id int AUTO_INCREMENT NOT NULL PRIMARY KEY,
    forfait_id int NOT NULL,
    client_id int NOT NULL,
    nb_seance_restante int NOT NULL,
    date_achat DATE NOT NULL,
    date_expiration DATE NOT NULL
);
CALL CopyDataIfForfait_SouscritExists();

DROP TRIGGER IF EXISTS set_default_forfait_souscrit_date_expiration;
CREATE TRIGGER set_default_forfait_souscrit_date_expiration
BEFORE INSERT ON new_forfait_souscrit
FOR EACH ROW
SET NEW.date_expiration = IFNULL(NEW.date_expiration, DATE_ADD(NOW(), INTERVAL 1 YEAR));

DROP TABLE IF EXISTS forfait_souscrit;
ALTER TABLE new_forfait_souscrit RENAME TO forfait_souscrit;

-- ----------------------------------------------------------



-- Mise a jour Table Type_Huile
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS new_type_huile (
    id int AUTO_INCREMENT NOT NULL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL
);
CALL CopyDataIfType_HuileExists();
DROP TABLE IF EXISTS type_huile;
ALTER TABLE new_type_huile RENAME TO type_huile;

-- ----------------------------------------------------------




-- Mise a jour Table Type_Table
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS new_type_table (
    id int AUTO_INCREMENT NOT NULL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL
);
CALL CopyDataIfType_TableExists();
DROP TABLE IF EXISTS type_table;
ALTER TABLE new_type_table RENAME TO type_table;

-- ----------------------------------------------------------





-- Mise a jour Table Description
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS new_description (
    id int AUTO_INCREMENT NOT NULL PRIMARY KEY,
    origine TEXT NULL,
    description TEXT NULL,
    bienfaits TEXT NULL,
    contre_indications TEXT NULL
);
CALL CopyDataIfDescriptionExists();

DROP TABLE IF EXISTS description;
ALTER TABLE new_description RENAME TO description;

-- ----------------------------------------------------------





-- Mise a jour Table Carte_Cadeau
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS new_carte_cadeau (
    id int AUTO_INCREMENT NOT NULL PRIMARY KEY,
    client_id int NOT NULL,
    massage_id int NULL,
    forfait_id int NULL,
    montant DECIMAL(10, 2) NOT NULL,
    paiementType INT NULL,
    acheteur_id int NULL,
    date_achat DATE NOT NULL,
    date_expiration DATE NOT NULL,
    utilise BOOLEAN DEFAULT FALSE NOT NULL

);
CALL CopyDataIfCarte_CadeauExists();


DROP TRIGGER IF EXISTS set_default_date_expiration;
CREATE TRIGGER set_default_date_expiration
BEFORE INSERT ON new_carte_cadeau
FOR EACH ROW
SET NEW.date_expiration = IFNULL(NEW.date_expiration, DATE_ADD(NOW(), INTERVAL 1 YEAR));




DROP TABLE IF EXISTS carte_cadeau;
ALTER TABLE new_carte_cadeau RENAME TO carte_cadeau;

-- ----------------------------------------------------------




-- Mise a jour Table Client
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS new_client (
    id int AUTO_INCREMENT NOT NULL PRIMARY KEY,
    nom VARCHAR(80) NOT NULL,
    prenom VARCHAR(80) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telephone VARCHAR(13) NOT NULL,
    adresse VARCHAR(80) NULL,
    code_postal VARCHAR(5) NULL,
    ville VARCHAR(80) NULL,
    notes TEXT NULL,
    creation_date DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    last_update DATETIME NULL
);
CALL CopyDataIfClientExists();

DROP TABLE IF EXISTS client;
ALTER TABLE new_client RENAME TO client;

-- ----------------------------------------------------------






ALTER TABLE massage ADD CONSTRAINT fk_type_huile FOREIGN KEY (type_huile_id) REFERENCES type_huile (id);
ALTER TABLE massage ADD CONSTRAINT fk_type_table FOREIGN KEY (type_table_id) REFERENCES type_table (id);
ALTER TABLE massage ADD CONSTRAINT fk_description FOREIGN KEY (description_id) REFERENCES description (id);


ALTER TABLE forfait_souscrit ADD CONSTRAINT fk_forfait_souscrit_client FOREIGN KEY (client_id) REFERENCES client (id);
ALTER TABLE forfait_souscrit ADD CONSTRAINT fk_forfait_souscrit_forfait FOREIGN KEY (forfait_id) REFERENCES forfait (id);

ALTER TABLE carte_cadeau ADD CONSTRAINT fk_carte_cadeau_client FOREIGN KEY (client_id) REFERENCES client (id);
ALTER TABLE carte_cadeau ADD CONSTRAINT fk_carte_cadeau_acheteur FOREIGN KEY (acheteur_id) REFERENCES client (id);
ALTER TABLE carte_cadeau ADD CONSTRAINT fk_carte_cadeau_forfait FOREIGN KEY (forfait_id) REFERENCES forfait (id);
ALTER TABLE carte_cadeau ADD CONSTRAINT fk_carte_cadeau_massage FOREIGN KEY (massage_id) REFERENCES massage (id);

ALTER TABLE rdv ADD CONSTRAINT fk_method_prise_rdv FOREIGN KEY (method_prise_rdv) REFERENCES method_prise_rdv (id);
ALTER TABLE rdv ADD CONSTRAINT fk_rdv_massage FOREIGN KEY (massage_id) REFERENCES massage (id);
ALTER TABLE rdv ADD CONSTRAINT fk_rdv_client FOREIGN KEY (client_id) REFERENCES client (id);


ALTER TABLE forfait ADD CONSTRAINT fk_forfait_info FOREIGN KEY (forfait_info_id) REFERENCES forfait_info (id);
ALTER TABLE forfait ADD CONSTRAINT fk_forfait_massage FOREIGN KEY (massage_id) REFERENCES massage (id);

ALTER TABLE carte_cadeau ADD CONSTRAINT fk_type_paiement FOREIGN KEY (paiementType) REFERENCES type_paiement (id);

