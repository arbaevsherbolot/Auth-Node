DROP DATABASE users_db;

CREATE DATABASE users_db;

USE users_db;

CREATE TABLE users (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(25) UNIQUE NOT NULL,
    `email` VARCHAR(40) NOT NULL,
    `password` VARCHAR(200) NOT NULL,
    `photo` VARCHAR(255)
);