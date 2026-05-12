CREATE DATABASE IF NOT EXISTS creative_craft_workshop;
USE creative_craft_workshop;

CREATE TABLE IF NOT EXISTS contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fname VARCHAR(20) NOT NULL,
    lname VARCHAR(20) NOT NULL,
    email VARCHAR(50) NOT NULL,
    mobile VARCHAR(10) NOT NULL,
    birthdate DATE NOT NULL,
    gender VARCHAR(10) NOT NULL,
    language VARCHAR(20) NOT NULL,
    message VARCHAR(200) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS workshop_registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    workshop VARCHAR(20) NOT NULL,
    fullname VARCHAR(40) NOT NULL,
    email VARCHAR(50) NOT NULL,
    mobile VARCHAR(10) NOT NULL,
    gender VARCHAR(10) NOT NULL,
    workshop_date DATE NOT NULL,
    workshop_time TIME NOT NULL,
    notes VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
