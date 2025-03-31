/*
SQL Basics
==========
This file demonstrates fundamental SQL concepts and operations.
*/

-- Creating a database
CREATE DATABASE IF NOT EXISTS fullstack_forge;

-- Using the database
USE fullstack_forge;

-- Creating tables with data types, constraints, and relationships
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash CHAR(60) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    date_of_birth DATE,
    registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    profile_picture VARCHAR(255),
    CONSTRAINT chk_email CHECK (email LIKE '%@%.%')
);

CREATE TABLE posts (
    post_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    view_count INT DEFAULT 0,
    is_published BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE comments (
    comment_id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255)
);

-- Junction table for many-to-many relationship
CREATE TABLE post_categories (
    post_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (post_id, category_id),
    FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE
);

-- Inserting data
INSERT INTO users (username, email, password_hash, first_name, last_name, date_of_birth)
VALUES 
    ('johndoe', 'john@example.com', 'hashed_password_123', 'John', 'Doe', '1990-05-15'),
    ('janedoe', 'jane@example.com', 'hashed_password_456', 'Jane', 'Doe', '1992-08-22'),
    ('bobsmith', 'bob@example.com', 'hashed_password_789', 'Bob', 'Smith', '1985-12-10');

INSERT INTO categories (name, description)
VALUES 
    ('Technology', 'Posts about tech trends and innovations'),
    ('Travel', 'Travel experiences and tips'),
    ('Food', 'Recipes and food reviews'),
    ('Health', 'Health tips and wellness advice');

INSERT INTO posts (user_id, title, content)
VALUES 
    (1, 'Getting Started with SQL', 'SQL (Structured Query Language) is a powerful tool for managing relational databases...'),
    (1, 'My Trip to Paris', 'Last summer, I had the opportunity to visit Paris, and it was an incredible experience...'),
    (2, 'Healthy Breakfast Ideas', 'Starting your day with a nutritious breakfast is essential for maintaining energy...'),
    (3, 'Latest Tech Trends', 'Artificial intelligence and machine learning are revolutionizing various industries...');

INSERT INTO comments (post_id, user_id, content)
VALUES 
    (1, 2, 'Great introduction to SQL! Looking forward to more database content.'),
    (1, 3, 'This helped me understand the basics. Thanks!'),
    (2, 3, 'Paris is on my bucket list. Any recommendations for accommodations?'),
    (3, 1, 'I tried the smoothie recipe and loved it!');

INSERT INTO post_categories (post_id, category_id)
VALUES 
    (1, 1), -- Technology
    (2, 2), -- Travel
    (3, 3), -- Food
    (3, 4), -- Health
    (4, 1); -- Technology

-- Basic SELECT queries
-- Selecting all columns from a table
SELECT * FROM users;

-- Selecting specific columns
SELECT username, email, first_name, last_name FROM users;

-- Filtering with WHERE clause
SELECT * FROM posts WHERE user_id = 1;

-- Ordering results
SELECT * FROM posts ORDER BY created_at DESC;

-- Limiting results
SELECT * FROM posts LIMIT 2;

-- Pagination
SELECT * FROM posts LIMIT 2 OFFSET 2;

-- Counting results
SELECT COUNT(*) FROM comments;

-- Aggregation functions
SELECT 
    user_id, 
    COUNT(*) as post_count, 
    MAX(created_at) as last_post_date 
FROM posts 
GROUP BY user_id;

-- JOINs for related tables
-- Inner join
SELECT 
    p.post_id, 
    p.title, 
    u.username AS author
FROM posts p
INNER JOIN users u ON p.user_id = u.user_id;

-- Left join
SELECT 
    u.username, 
    COUNT(p.post_id) AS post_count
FROM users u
LEFT JOIN posts p ON u.user_id = p.user_id
GROUP BY u.username;

-- Multiple joins
SELECT 
    p.title, 
    u.username AS author, 
    c.content AS comment, 
    cu.username AS commenter
FROM posts p
INNER JOIN users u ON p.user_id = u.user_id
LEFT JOIN comments c ON p.post_id = c.post_id
LEFT JOIN users cu ON c.user_id = cu.user_id;

-- Many-to-many relationship
SELECT 
    p.title, 
    GROUP_CONCAT(c.name) AS categories
FROM posts p
JOIN post_categories pc ON p.post_id = pc.post_id
JOIN categories c ON pc.category_id = c.category_id
GROUP BY p.post_id;

-- Filtering with complex conditions
SELECT * FROM posts 
WHERE (user_id = 1 OR user_id = 2) 
AND created_at >= '2023-01-01';

-- String operations
SELECT * FROM users 
WHERE username LIKE 'j%' 
OR first_name LIKE '%n%';

-- Calculations in SELECT
SELECT 
    post_id, 
    title, 
    DATEDIFF(NOW(), created_at) AS days_since_creation
FROM posts;

-- Updating data
UPDATE users 
SET profile_picture = 'default_avatar.jpg' 
WHERE profile_picture IS NULL;

UPDATE posts 
SET view_count = view_count + 1 
WHERE post_id = 1;

-- Deleting data
DELETE FROM comments 
WHERE post_id = 4 AND user_id = 2;

-- Transaction example
START TRANSACTION;

INSERT INTO posts (user_id, title, content) 
VALUES (2, 'My New Post', 'This is the content of my new post.');

SET @new_post_id = LAST_INSERT_ID();

INSERT INTO post_categories (post_id, category_id) 
VALUES (@new_post_id, 1), (@new_post_id, 3);

COMMIT;

-- Creating a view
CREATE VIEW post_details AS
SELECT 
    p.post_id, 
    p.title, 
    p.content, 
    p.created_at, 
    u.username AS author,
    COUNT(c.comment_id) AS comment_count
FROM posts p
JOIN users u ON p.user_id = u.user_id
LEFT JOIN comments c ON p.post_id = c.post_id
GROUP BY p.post_id;

-- Using the view
SELECT * FROM post_details WHERE comment_count > 0;

-- Creating an index for performance
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_comments_post_id ON comments(post_id);

-- Advanced queries with subqueries
SELECT username 
FROM users 
WHERE user_id IN (
    SELECT DISTINCT user_id 
    FROM posts 
    WHERE post_id IN (
        SELECT post_id 
        FROM post_categories 
        WHERE category_id = 1
    )
);

-- Common Table Expressions (CTEs)
WITH PostStats AS (
    SELECT 
        user_id, 
        COUNT(*) as post_count
    FROM posts 
    GROUP BY user_id
)
SELECT 
    u.username, 
    COALESCE(ps.post_count, 0) as post_count
FROM users u
LEFT JOIN PostStats ps ON u.user_id = ps.user_id
ORDER BY post_count DESC;

-- CASE statement for conditional logic
SELECT 
    username,
    CASE 
        WHEN date_of_birth > '1990-01-01' THEN 'Gen Z/Millennial'
        WHEN date_of_birth > '1970-01-01' THEN 'Gen X'
        ELSE 'Baby Boomer'
    END AS generation
FROM users;

-- Creating a stored procedure
DELIMITER //
CREATE PROCEDURE GetUserActivity(IN user_id_param INT)
BEGIN
    SELECT 
        u.username,
        COUNT(DISTINCT p.post_id) AS post_count,
        COUNT(DISTINCT c.comment_id) AS comment_count
    FROM users u
    LEFT JOIN posts p ON u.user_id = p.user_id
    LEFT JOIN comments c ON u.user_id = c.user_id
    WHERE u.user_id = user_id_param
    GROUP BY u.username;
END //
DELIMITER ;

-- Calling the stored procedure
CALL GetUserActivity(1);

-- Creating a trigger
DELIMITER //
CREATE TRIGGER after_post_insert
AFTER INSERT ON posts
FOR EACH ROW
BEGIN
    INSERT INTO post_categories (post_id, category_id)
    VALUES (NEW.post_id, 1); -- Default to Technology category
END //
DELIMITER ;

-- Note on best practices:
/*
1. Always use appropriate data types
2. Add proper constraints (PRIMARY KEY, FOREIGN KEY, UNIQUE, etc.)
3. Use indexes for frequently queried columns
4. Normalize your database to reduce redundancy
5. Use transactions for operations that need to be atomic
6. Consider security aspects like SQL injection prevention
7. Backup your database regularly
8. Optimize queries for performance
*/
