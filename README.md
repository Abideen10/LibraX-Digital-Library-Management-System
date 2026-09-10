# LibraX Digital Library Management System

ระบบจัดการห้องสมุดดิจิทัลสำหรับมหาวิทยาลัย พัฒนาด้วย HTML, Tailwind CSS, Vanilla JavaScript, Node.js และ MySQL

---

## 📚 Features

- **Dashboard** — ภาพรวมของระบบ: จำนวนหนังสือ, สมาชิก, การยืม
- **Book Management** — เพิ่ม, แก้ไข, ลบ, ค้นหา, กรองหนังสือ
- **Member Management** — จัดการสมาชิกห้องสมุด (Student, Teacher, Staff)
- **Borrow & Return** — ยืมและคืนหนังสือ พร้อมตรวจสอบเงื่อนไข
- **Borrowing History** — ดูประวัติการยืม-คืนทั้งหมด

---

## 🛠 Tech Stack

| Layer    | Technology                      |
| -------- | ------------------------------- |
| Frontend | HTML5, Tailwind CSS, Vanilla JS |
| Backend  | Node.js (HTTP Module)           |
| Database | MySQL / MariaDB (via XAMPP)     |
| Driver   | mysql2                          |

---

## 📁 Project Structure

```
librax/
├── frontend/
│   ├── index.html              # Dashboard
│   ├── pages/
│   │   ├── books.html          # Book Management
│   │   ├── book-detail.html    # Book Detail Page
│   │   ├── members.html        # Member Management
│   │   ├── borrow.html         # Borrow & Return
│   │   └── history.html        # Borrowing History
│   ├── css/style.css           # Custom Styles
│   ├── js/
│   │   ├── app.js              # Shared Functions
│   │   ├── books.js            # Books Page Logic
│   │   ├── members.js          # Members Page Logic
│   │   ├── borrow.js           # Borrow Page Logic
│   │   └── history.js          # History Page Logic
│   └── assets/                 # Images & Icons
│
├── backend/
│   ├── server.js               # HTTP Server (Entry Point)
│   ├── routes/                 # URL Routing
│   ├── controllers/            # Request Handlers
│   ├── services/               # Business Logic
│   ├── database/
│   │   ├── connection.js       # MySQL Connection Pool
│   │   └── queries/            # SQL Query Functions
│   └── utils/helpers.js        # Utility Functions
│
├── database/
│   ├── schema.sql              # Database Schema
│   └── seed.sql                # Sample Data
│
├── docs/                       # Documentation
├── .env                        # Environment Variables
├── .gitignore
├── package.json
└── README.md
```

---

## 🚀 Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [XAMPP](https://www.apachefriends.org/) (for MySQL/MariaDB)
- [Git](https://git-scm.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/LibraX-Digital-Library-Management.git
cd LibraX-Digital-Library-Management
```

### 2. Install Dependencies

```bash
npm install
```

---

## 🗄 XAMPP Setup

1. ดาวน์โหลดและติดตั้ง XAMPP
2. เปิด XAMPP Control Panel
3. Start **Apache** (สำหรับ phpMyAdmin)
4. Start **MySQL**
5. เปิด phpMyAdmin: http://localhost/phpmyadmin

---

## 🗃 Database Setup

### ผ่าน phpMyAdmin:

1. เปิด phpMyAdmin
2. สร้าง Database ใหม่ชื่อ `librax_db`
3. เลือก Database `librax_db`
4. ไปที่แท็บ **Import**
5. Import ไฟล์ `database/schema.sql`
6. Import ไฟล์ `database/seed.sql`

### ผ่าน Command Line:

```bash
# สร้าง Database และ Tables
mysql -u root < database/schema.sql

# เพิ่มข้อมูลตัวอย่าง
mysql -u root < database/seed.sql
```

---

## ⚙ Environment Variables

สร้างไฟล์ `.env` ที่ root ของโปรเจกต์ (หรือแก้ไขไฟล์ที่มีอยู่):

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=librax_db
PORT=3000
```

> **หมายเหตุ**: XAMPP โดยทั่วไปใช้ user `root` โดยไม่มี password

---

## ▶ How to Run

### 1. Start XAMPP MySQL

เปิด XAMPP Control Panel แล้ว Start MySQL

### 2. Start the Server

```bash
# Production mode
npm start

# Development mode (auto-restart on file changes)
npm run dev
```

### 3. Open in Browser

- **Frontend**: http://localhost:3000
- **API**: http://localhost:3000/api

---

## 📡 API Overview

### Books

| Method | Endpoint             | Description      |
| ------ | -------------------- | ---------------- |
| GET    | /api/books           | List all books   |
| GET    | /api/books/:id       | Get book by ID   |
| POST   | /api/books           | Create new book  |
| PUT    | /api/books/:id       | Update book      |
| DELETE | /api/books/:id       | Delete book      |
| GET    | /api/books/categories| Get all categories |

### Members

| Method | Endpoint                     | Description            |
| ------ | ---------------------------- | ---------------------- |
| GET    | /api/members                 | List all members       |
| GET    | /api/members/:id             | Get member by ID       |
| POST   | /api/members                 | Create new member      |
| PUT    | /api/members/:id             | Update member          |
| DELETE | /api/members/:id             | Delete member          |
| GET    | /api/members/:id/borrowings  | Get member borrowings  |

### Borrowings

| Method | Endpoint                      | Description          |
| ------ | ----------------------------- | -------------------- |
| GET    | /api/borrowings               | List all borrowings  |
| GET    | /api/borrowings/:id           | Get borrowing by ID  |
| POST   | /api/borrowings               | Create new borrowing |
| PUT    | /api/borrowings/:id/return    | Return borrowing     |

### Dashboard

| Method | Endpoint       | Description         |
| ------ | -------------- | ------------------- |
| GET    | /api/dashboard | Get dashboard data  |

### API Response Format

```json
// Success
{
  "success": true,
  "data": { ... }
}

// Error
{
  "success": false,
  "message": "Error description"
}
```

---

## 📋 What's Next

- [ ] เพิ่มระบบ Authentication (Login/Register)
- [ ] เพิ่มระบบ Role-based Access Control
- [ ] เพิ่ม Pagination สำหรับข้อมูลจำนวนมาก
- [ ] เพิ่มการ Export รายงานเป็น PDF/Excel
- [ ] เพิ่มระบบแจ้งเตือนหนังสือเกินกำหนดคืน
- [ ] Deploy ขึ้น Server จริง
- [ ] เปลี่ยนจาก Tailwind CDN เป็น Build Process

---

## 📄 License

This project is for educational purposes.
