-- ============================================
-- LibraX Digital Library Management System
-- Seed Data - ข้อมูลตัวอย่างสำหรับทดสอบ
-- ============================================

USE librax_db;

-- ============================================
-- Books (10 รายการ - หนังสือที่เหมาะกับมหาวิทยาลัย)
-- ============================================
INSERT INTO books (isbn, title, author, category, publisher, published_year, quantity, available_quantity, description) VALUES
('978-0-13-468599-1', 'Clean Code: A Handbook of Agile Software Craftsmanship', 'Robert C. Martin', 'Computer Science', 'Prentice Hall', 2008, 5, 3, 'A handbook of agile software craftsmanship that teaches developers how to write clean, maintainable code.'),
('978-0-201-63361-0', 'Design Patterns: Elements of Reusable Object-Oriented Software', 'Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides', 'Computer Science', 'Addison-Wesley', 1994, 3, 2, 'The classic book on software design patterns, written by the "Gang of Four".'),
('978-0-596-51774-8', 'JavaScript: The Good Parts', 'Douglas Crockford', 'Computer Science', 'O''Reilly Media', 2008, 4, 4, 'A deep dive into the beautiful and elegant parts of the JavaScript programming language.'),
('978-0-13-235088-4', 'The Pragmatic Programmer', 'David Thomas, Andrew Hunt', 'Computer Science', 'Addison-Wesley', 2019, 3, 1, 'A timeless guide for software developers covering best practices and pragmatic approaches.'),
('978-0-06-112008-4', 'To Kill a Mockingbird', 'Harper Lee', 'Literature', 'J.B. Lippincott & Co.', 1960, 6, 5, 'A classic novel of racial injustice and childhood innocence in the American South.'),
('978-0-14-028329-7', '1984', 'George Orwell', 'Literature', 'Secker & Warburg', 1949, 4, 3, 'A dystopian novel set in a totalitarian society ruled by Big Brother.'),
('978-0-07-340181-2', 'Fundamentals of Database Systems', 'Ramez Elmasri, Shamkant Navathe', 'Computer Science', 'Pearson', 2015, 5, 4, 'A comprehensive introduction to database systems fundamentals and design.'),
('978-0-13-468129-0', 'Introduction to Algorithms', 'Thomas H. Cormen, Charles E. Leiserson', 'Computer Science', 'MIT Press', 2022, 4, 2, 'The comprehensive textbook on algorithms, widely used in universities worldwide.'),
('978-0-19-853453-2', 'Principles of Economics', 'N. Gregory Mankiw', 'Economics', 'Cengage Learning', 2020, 5, 5, 'An introductory economics textbook covering both microeconomics and macroeconomics.'),
('978-0-32-154686-7', 'University Physics with Modern Physics', 'Hugh D. Young, Roger A. Freedman', 'Physics', 'Pearson', 2019, 4, 3, 'A comprehensive physics textbook for university-level courses.');


-- ============================================
-- Members (8 คน - นักศึกษา, อาจารย์, เจ้าหน้าที่)
-- ============================================
INSERT INTO members (member_code, first_name, last_name, email, phone, member_type) VALUES
('STD-2024-001', 'Somchai', 'Wongsakul', 'somchai.w@university.ac.th', '081-234-5678', 'Student'),
('STD-2024-002', 'Nattaporn', 'Srisuwan', 'nattaporn.s@university.ac.th', '082-345-6789', 'Student'),
('STD-2024-003', 'Pitchaya', 'Tanaka', 'pitchaya.t@university.ac.th', '083-456-7890', 'Student'),
('STD-2024-004', 'Kanokwan', 'Prasert', 'kanokwan.p@university.ac.th', '084-567-8901', 'Student'),
('TCH-2024-001', 'Dr. Apinya', 'Charoensuk', 'apinya.c@university.ac.th', '085-678-9012', 'Teacher'),
('TCH-2024-002', 'Prof. Wichai', 'Kamolrat', 'wichai.k@university.ac.th', '086-789-0123', 'Teacher'),
('STF-2024-001', 'Pranee', 'Boonmee', 'pranee.b@university.ac.th', '087-890-1234', 'Staff'),
('STF-2024-002', 'Sakchai', 'Intaraprasit', 'sakchai.i@university.ac.th', '088-901-2345', 'Staff');


-- ============================================
-- Borrowings - รายการยืมหนังสือ
-- ============================================

-- รายการยืม #1: Somchai ยืม 2 เล่ม - ยังไม่คืน
INSERT INTO borrowings (id, member_id, borrow_date, due_date, status) VALUES
(1, 1, '2024-08-15', '2024-08-29', 'Borrowed');

INSERT INTO borrowing_items (borrowing_id, book_id, status) VALUES
(1, 1, 'Borrowed'),
(1, 4, 'Borrowed');

-- รายการยืม #2: Nattaporn ยืม 1 เล่ม - คืนแล้ว
INSERT INTO borrowings (id, member_id, borrow_date, due_date, status) VALUES
(2, 2, '2024-08-10', '2024-08-24', 'Returned');

INSERT INTO borrowing_items (borrowing_id, book_id, return_date, status) VALUES
(2, 3, '2024-08-20', 'Returned');

-- รายการยืม #3: Dr. Apinya ยืม 2 เล่ม - คืนแล้ว
INSERT INTO borrowings (id, member_id, borrow_date, due_date, status) VALUES
(3, 5, '2024-08-05', '2024-08-19', 'Returned');

INSERT INTO borrowing_items (borrowing_id, book_id, return_date, status) VALUES
(3, 7, '2024-08-18', 'Returned'),
(3, 8, '2024-08-18', 'Returned');

-- รายการยืม #4: Pitchaya ยืม 1 เล่ม - เกินกำหนด
INSERT INTO borrowings (id, member_id, borrow_date, due_date, status) VALUES
(4, 3, '2024-07-20', '2024-08-03', 'Overdue');

INSERT INTO borrowing_items (borrowing_id, book_id, status) VALUES
(4, 2, 'Overdue');

-- รายการยืม #5: Pranee ยืม 1 เล่ม - ยังไม่คืน
INSERT INTO borrowings (id, member_id, borrow_date, due_date, status) VALUES
(5, 7, '2024-08-20', '2024-09-03', 'Borrowed');

INSERT INTO borrowing_items (borrowing_id, book_id, status) VALUES
(5, 5, 'Borrowed');

-- รายการยืม #6: Kanokwan ยืม 2 เล่ม - คืนแล้ว
INSERT INTO borrowings (id, member_id, borrow_date, due_date, status) VALUES
(6, 4, '2024-07-25', '2024-08-08', 'Returned');

INSERT INTO borrowing_items (borrowing_id, book_id, return_date, status) VALUES
(6, 6, '2024-08-05', 'Returned'),
(6, 9, '2024-08-05', 'Returned');

-- รายการยืม #7: Prof. Wichai ยืม 1 เล่ม - ยังไม่คืน
INSERT INTO borrowings (id, member_id, borrow_date, due_date, status) VALUES
(7, 6, '2024-08-22', '2024-09-05', 'Borrowed');

INSERT INTO borrowing_items (borrowing_id, book_id, status) VALUES
(7, 8, 'Borrowed');
