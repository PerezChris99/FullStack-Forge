"""
SQLite Database Example
======================

This module demonstrates how to work with SQLite databases in Python using the sqlite3 module.
SQLite is a lightweight disk-based database that doesn't require a separate server process.
"""

import sqlite3
import os
from datetime import datetime


class SQLiteExample:
    """A class to demonstrate SQLite database operations."""
    
    def __init__(self, db_file="example.db"):
        """Initialize the database connection."""
        # Get the directory of this file
        base_dir = os.path.dirname(os.path.abspath(__file__))
        self.db_path = os.path.join(base_dir, db_file)
        self.connection = None
    
    def connect(self):
        """Connect to the SQLite database."""
        try:
            self.connection = sqlite3.connect(self.db_path)
            # Enable foreign keys
            self.connection.execute("PRAGMA foreign_keys = ON")
            # Set the row factory to return rows as dictionaries
            self.connection.row_factory = sqlite3.Row
            print(f"Connected to database: {self.db_path}")
            return True
        except sqlite3.Error as e:
            print(f"Error connecting to database: {e}")
            return False
    
    def close(self):
        """Close the database connection."""
        if self.connection:
            self.connection.close()
            print("Database connection closed")
    
    def create_tables(self):
        """Create the tables for our example."""
        try:
            cursor = self.connection.cursor()
            
            # Create users table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT NOT NULL UNIQUE,
                    email TEXT NOT NULL UNIQUE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            # Create posts table with foreign key to users
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS posts (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    title TEXT NOT NULL,
                    content TEXT NOT NULL,
                    user_id INTEGER NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
                )
            ''')
            
            # Create comments table with foreign keys to users and posts
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS comments (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    content TEXT NOT NULL,
                    user_id INTEGER NOT NULL,
                    post_id INTEGER NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
                    FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE
                )
            ''')
            
            self.connection.commit()
            print("Tables created successfully")
            return True
        except sqlite3.Error as e:
            print(f"Error creating tables: {e}")
            return False
    
    def insert_user(self, username, email):
        """Insert a new user into the users table."""
        try:
            cursor = self.connection.cursor()
            cursor.execute(
                "INSERT INTO users (username, email) VALUES (?, ?)",
                (username, email)
            )
            self.connection.commit()
            print(f"User {username} inserted with ID: {cursor.lastrowid}")
            return cursor.lastrowid
        except sqlite3.IntegrityError:
            print(f"Error: Username or email already exists")
            return None
        except sqlite3.Error as e:
            print(f"Error inserting user: {e}")
            return None
    
    def insert_post(self, title, content, user_id):
        """Insert a new post into the posts table."""
        try:
            cursor = self.connection.cursor()
            cursor.execute(
                "INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)",
                (title, content, user_id)
            )
            self.connection.commit()
            print(f"Post '{title}' inserted with ID: {cursor.lastrowid}")
            return cursor.lastrowid
        except sqlite3.Error as e:
            print(f"Error inserting post: {e}")
            return None
    
    def insert_comment(self, content, user_id, post_id):
        """Insert a new comment into the comments table."""
        try:
            cursor = self.connection.cursor()
            cursor.execute(
                "INSERT INTO comments (content, user_id, post_id) VALUES (?, ?, ?)",
                (content, user_id, post_id)
            )
            self.connection.commit()
            print(f"Comment inserted with ID: {cursor.lastrowid}")
            return cursor.lastrowid
        except sqlite3.Error as e:
            print(f"Error inserting comment: {e}")
            return None
    
    def get_users(self):
        """Get all users from the users table."""
        try:
            cursor = self.connection.cursor()
            cursor.execute("SELECT * FROM users")
            users = [dict(row) for row in cursor.fetchall()]
            return users
        except sqlite3.Error as e:
            print(f"Error retrieving users: {e}")
            return []
    
    def get_posts(self, user_id=None):
        """
        Get posts from the posts table.
        If user_id is provided, only get posts from that user.
        """
        try:
            cursor = self.connection.cursor()
            if user_id:
                cursor.execute(
                    "SELECT * FROM posts WHERE user_id = ? ORDER BY created_at DESC",
                    (user_id,)
                )
            else:
                cursor.execute("SELECT * FROM posts ORDER BY created_at DESC")
            
            posts = [dict(row) for row in cursor.fetchall()]
            return posts
        except sqlite3.Error as e:
            print(f"Error retrieving posts: {e}")
            return []
    
    def get_post_with_comments(self, post_id):
        """Get a post and all its comments."""
        try:
            cursor = self.connection.cursor()
            # Get the post
            cursor.execute(
                """
                SELECT p.*, u.username 
                FROM posts p
                JOIN users u ON p.user_id = u.id
                WHERE p.id = ?
                """,
                (post_id,)
            )
            post = cursor.fetchone()
            
            if not post:
                print(f"Post with ID {post_id} not found")
                return None
            
            post_dict = dict(post)
            
            # Get the comments for the post
            cursor.execute(
                """
                SELECT c.*, u.username
                FROM comments c
                JOIN users u ON c.user_id = u.id
                WHERE c.post_id = ?
                ORDER BY c.created_at ASC
                """,
                (post_id,)
            )
            
            comments = [dict(row) for row in cursor.fetchall()]
            post_dict['comments'] = comments
            
            return post_dict
        except sqlite3.Error as e:
            print(f"Error retrieving post: {e}")
            return None
    
    def update_user(self, user_id, username=None, email=None):
        """Update a user's information."""
        try:
            cursor = self.connection.cursor()
            updates = []
            params = []
            
            if username:
                updates.append("username = ?")
                params.append(username)
            
            if email:
                updates.append("email = ?")
                params.append(email)
            
            if not updates:
                print("No updates provided")
                return False
            
            params.append(user_id)
            query = f"UPDATE users SET {', '.join(updates)} WHERE id = ?"
            
            cursor.execute(query, params)
            self.connection.commit()
            
            if cursor.rowcount > 0:
                print(f"User {user_id} updated successfully")
                return True
            else:
                print(f"User {user_id} not found")
                return False
        except sqlite3.IntegrityError:
            print(f"Error: Username or email already exists")
            return False
        except sqlite3.Error as e:
            print(f"Error updating user: {e}")
            return False
    
    def delete_post(self, post_id):
        """Delete a post by ID."""
        try:
            cursor = self.connection.cursor()
            cursor.execute("DELETE FROM posts WHERE id = ?", (post_id,))
            self.connection.commit()
            
            if cursor.rowcount > 0:
                print(f"Post {post_id} deleted successfully")
                return True
            else:
                print(f"Post {post_id} not found")
                return False
        except sqlite3.Error as e:
            print(f"Error deleting post: {e}")
            return False
    
    def search_posts(self, search_term):
        """Search for posts containing the search term in title or content."""
        try:
            cursor = self.connection.cursor()
            search_pattern = f"%{search_term}%"
            
            cursor.execute(
                """
                SELECT p.*, u.username 
                FROM posts p
                JOIN users u ON p.user_id = u.id
                WHERE p.title LIKE ? OR p.content LIKE ?
                ORDER BY p.created_at DESC
                """,
                (search_pattern, search_pattern)
            )
            
            results = [dict(row) for row in cursor.fetchall()]
            print(f"Found {len(results)} posts matching '{search_term}'")
            return results
        except sqlite3.Error as e:
            print(f"Error searching posts: {e}")
            return []
    
    def execute_transaction(self):
        """Demonstrate a transaction that ensures all operations complete or none do."""
        try:
            # Start a transaction
            self.connection.execute("BEGIN TRANSACTION")
            
            # Insert a user
            cursor = self.connection.cursor()
            cursor.execute(
                "INSERT INTO users (username, email) VALUES (?, ?)",
                ("transaction_user", "transaction@example.com")
            )
            user_id = cursor.lastrowid
            
            # Insert a post for the user
            cursor.execute(
                "INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)",
                ("Transaction Post", "This post is part of a transaction", user_id)
            )
            post_id = cursor.lastrowid
            
            # Insert a comment on the post
            cursor.execute(
                "INSERT INTO comments (content, user_id, post_id) VALUES (?, ?, ?)",
                ("Transaction comment", user_id, post_id)
            )
            
            # Commit the transaction
            self.connection.commit()
            print("Transaction completed successfully")
            return True
        except sqlite3.Error as e:
            # Roll back the transaction if any error occurs
            self.connection.rollback()
            print(f"Transaction failed: {e}")
            return False
    
    def demonstrate_joins(self):
        """Demonstrate SQL joins to retrieve related data."""
        try:
            cursor = self.connection.cursor()
            
            # Join users and posts to get user info with their post count
            print("\nUsers with post counts:")
            cursor.execute("""
                SELECT u.id, u.username, u.email, COUNT(p.id) as post_count
                FROM users u
                LEFT JOIN posts p ON u.id = p.user_id
                GROUP BY u.id
                ORDER BY post_count DESC
            """)
            
            users_with_counts = [dict(row) for row in cursor.fetchall()]
            for user in users_with_counts:
                print(f"User: {user['username']}, Posts: {user['post_count']}")
            
            # Join all three tables to get users, posts, and comment counts
            print("\nPosts with comment counts:")
            cursor.execute("""
                SELECT p.id, p.title, u.username as author, 
                       COUNT(c.id) as comment_count, p.created_at
                FROM posts p
                JOIN users u ON p.user_id = u.id
                LEFT JOIN comments c ON p.id = c.post_id
                GROUP BY p.id
                ORDER BY comment_count DESC, p.created_at DESC
            """)
            
            posts_with_counts = [dict(row) for row in cursor.fetchall()]
            for post in posts_with_counts:
                print(f"Post: {post['title']}, Author: {post['author']}, Comments: {post['comment_count']}")
            
            return {
                'users': users_with_counts,
                'posts': posts_with_counts
            }
        except sqlite3.Error as e:
            print(f"Error in join demonstration: {e}")
            return {}


# Example usage
if __name__ == "__main__":
    db = SQLiteExample()
    
    if db.connect():
        # Create tables
        db.create_tables()
        
        # Insert sample data
        print("\n=== Inserting Sample Data ===")
        user1_id = db.insert_user("john_doe", "john@example.com")
        user2_id = db.insert_user("jane_smith", "jane@example.com")
        
        if user1_id and user2_id:
            post1_id = db.insert_post(
                "Introduction to SQLite",
                "SQLite is a lightweight disk-based database that doesn't require a separate server process.",
                user1_id
            )
            
            post2_id = db.insert_post(
                "Python and Databases",
                "Python provides several ways to work with databases, including the sqlite3 module for SQLite.",
                user1_id
            )
            
            post3_id = db.insert_post(
                "Web Development with Python",
                "Python is great for web development with frameworks like Flask and Django.",
                user2_id
            )
            
            # Add some comments
            if post1_id:
                db.insert_comment("Great introduction!", user2_id, post1_id)
                db.insert_comment("I learned a lot from this post.", user2_id, post1_id)
            
            if post2_id:
                db.insert_comment("Python's database support is impressive.", user2_id, post2_id)
            
            if post3_id:
                db.insert_comment("I prefer Django over Flask.", user1_id, post3_id)
                db.insert_comment("Flask is more lightweight though.", user2_id, post3_id)
        
        # Retrieve and display data
        print("\n=== Retrieving Data ===")
        users = db.get_users()
        print(f"\nUsers ({len(users)}):")
        for user in users:
            print(f"  - {user['username']} ({user['email']})")
        
        posts = db.get_posts()
        print(f"\nPosts ({len(posts)}):")
        for post in posts:
            print(f"  - {post['title']} (by user_id: {post['user_id']})")
        
        # Get posts by a specific user
        if user1_id:
            user1_posts = db.get_posts(user1_id)
            print(f"\nPosts by user_id {user1_id} ({len(user1_posts)}):")
            for post in user1_posts:
                print(f"  - {post['title']}")
        
        # Get post with comments
        if post1_id:
            print(f"\nPost {post1_id} with comments:")
            post_with_comments = db.get_post_with_comments(post1_id)
            if post_with_comments:
                print(f"  Title: {post_with_comments['title']}")
                print(f"  Author: {post_with_comments['username']}")
                print(f"  Content: {post_with_comments['content']}")
                print(f"  Comments ({len(post_with_comments['comments'])}):")
                for comment in post_with_comments['comments']:
                    print(f"    - {comment['content']} (by {comment['username']})")
        
        # Update a user
        if user1_id:
            print("\n=== Updating Data ===")
            db.update_user(user1_id, email="john.doe@example.com")
        
        # Search for posts
        print("\n=== Searching Posts ===")
        search_results = db.search_posts("Python")
        if search_results:
            print(f"Search results for 'Python':")
            for post in search_results:
                print(f"  - {post['title']} (by {post['username']})")
        
        # Demonstrate a transaction
        print("\n=== Demonstrating Transaction ===")
        db.execute_transaction()
        
        # Demonstrate joins
        print("\n=== Demonstrating Joins ===")
        db.demonstrate_joins()
        
        # Close the connection
        db.close()
