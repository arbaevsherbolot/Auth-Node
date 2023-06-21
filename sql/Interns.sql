    CREATE TABLE interns_wedevx (
      `id` INT AUTO_INCREMENT PRIMARY KEY,
      `firstName` VARCHAR(28) NOT NULL,
      `lastName` VARCHAR(28) NOT NULL,
      `specialty` VARCHAR(30) NOT NULL,
      `phoneNumber` VARCHAR(50) NOT NULL,
      `email` VARCHAR(55) NOT NULL,
      `location` VARCHAR(45) NOT NULL,
      `remote` BOOLEAN
    );