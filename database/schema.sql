-- ============================================
-- LibraX Digital Library Management System
-- Database Schema
-- ============================================

-- สร้าง Database
CREATE DATABASE IF NOT EXISTS librax_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE librax_db;

-- ============================================
-- Table: books
-- เก็บข้อมูลหนังสือทั้งหมดในห้องสมุด
-- ============================================
CREATE TABLE IF NOT EXISTS books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  isbn VARCHAR(20) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  publisher VARCHAR(255) DEFAULT NULL,
  published_year INT DEFAULT NULL,
  quantity INT NOT NULL DEFAULT 1,
  available_quantity INT NOT NULL DEFAULT 1,
  description TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  -- available_quantity ต้องไม่เกิน quantity และไม่ติดลบ
  CONSTRAINT chk_quantity CHECK (quantity >= 0),
  CONSTRAINT chk_available CHECK (available_quantity >= 0 AND available_quantity <= quantity),

  INDEX idx_books_title (title),
  INDEX idx_books_author (author),
  INDEX idx_books_category (category),
  INDEX idx_books_isbn (isbn)
) ENGINE=InnoDB;


-- ============================================
-- Table: members
-- เก็บข้อมูลสมาชิกห้องสมุด
-- ============================================
CREATE TABLE IF NOT EXISTS members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  member_code VARCHAR(20) NOT NULL UNIQUE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20) DEFAULT NULL,
  member_type ENUM('Student', 'Teacher', 'Staff') NOT NULL DEFAULT 'Student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_members_code (member_code),
  INDEX idx_members_name (first_name, last_name),
  INDEX idx_members_type (member_type)
) ENGINE=InnoDB;


-- ============================================
-- Table: borrowings
-- เก็บข้อมูลรายการยืมหนังสือ (1 รายการยืม = 1 สมาชิก)
-- ============================================
CREATE TABLE IF NOT EXISTS borrowings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  member_id INT NOT NULL,
  borrow_date DATE NOT NULL,
  due_date DATE NOT NULL,
  status ENUM('Borrowed', 'Returned', 'Overdue') NOT NULL DEFAULT 'Borrowed',
  notes TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_borrowings_member
    FOREIGN KEY (member_id) REFERENCES members(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,

  INDEX idx_borrowings_member (member_id),
  INDEX idx_borrowings_status (status),
  INDEX idx_borrowings_borrow_date (borrow_date),
  INDEX idx_borrowings_due_date (due_date)
) ENGINE=InnoDB;


-- ============================================
-- Table: borrowing_items
-- เก็บรายละเอียดหนังสือแต่ละเล่มในรายการยืม
-- (1 รายการยืม มีได้หลายหนังสือ)
-- ============================================
CREATE TABLE IF NOT EXISTS borrowing_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  borrowing_id INT NOT NULL,
  book_id INT NOT NULL,
  return_date DATE DEFAULT NULL,
  status ENUM('Borrowed', 'Returned', 'Overdue') NOT NULL DEFAULT 'Borrowed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_items_borrowing
    FOREIGN KEY (borrowing_id) REFERENCES borrowings(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

  CONSTRAINT fk_items_book
    FOREIGN KEY (book_id) REFERENCES books(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,

  INDEX idx_items_borrowing (borrowing_id),
  INDEX idx_items_book (book_id),
  INDEX idx_items_status (status)
) ENGINE=InnoDB;
