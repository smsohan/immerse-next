CREATE DATABASE immerse_next;

USE immerse_db;

-- Create table
CREATE TABLE todos (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Insert 10 rows of data
INSERT INTO todos (title) VALUES
  ("Buy groceries: milk, bread, eggs, bananas"),
  ("Finish reading Chapter 5 of Introduction to AI"),
  ("Prepare presentation slides for client meeting"),
  ("Pay electricity bill before due date"),
  ("Book flight tickets for upcoming vacation"),
  ("Schedule car maintenance appointment"),
  ("Call to confirm dentist appointment"),
  ("Clean and organize workspace"),
  ("Complete online course assignment"),
  ("Write birthday card for grandma");