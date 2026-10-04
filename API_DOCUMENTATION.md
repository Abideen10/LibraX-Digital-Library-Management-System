# 📚 LibraX API Documentation

เอกสารรวบรวม Endpoint ทั้งหมดของระบบ LibraX Digital Library Management System สำหรับทดสอบผ่าน Postman หรือเชื่อมต่อกับ Frontend

---

## 🌐 ข้อมูลเบื้องต้น (Base Information)

* **Base URL:** `http://localhost:3000/api`
* **Default Content-Type:** `application/json`
* **Authentication:** ใช้ **Bearer Token (JWT)**
  * ใน Postman: ไปที่แท็บ **Authorization** -> Type: **Bearer Token** -> ใส่ Token
  * Header ตัวเต็ม: `Authorization: Bearer <token>`

---

## 🔑 บัญชีทดสอบ (Demo Accounts)

| บทบาท (Role) | Email | Password | สิทธิ์การเข้าถึง |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@librax.com` | `Admin@123` | จัดการได้ทุกอย่าง (เพิ่ม/ลบ/แก้ไข/ยืม/คืน) |
| **Student** | `somchai.w@university.ac.th` | `Student@123` | ดูหนังสือ, ดูประวัติการยืมของตัวเอง |

---

## 📋 สรุป Route ทั้งหมด (Quick Cheat Sheet)

| Method | Endpoint | สิทธิ์ (Role) | ต้องใส่ Body (raw JSON)? | คำอธิบาย |
| :---: | :--- | :---: | :---: | :--- |
| **POST** | `/api/auth/login` | ทุกคน | ✅ มี | เข้าสู่ระบบเพื่อรับ Token |
| **GET** | `/api/auth/me` | ทุกคนที่มี Token | ❌ ไม่มี | ดูข้อมูลโปรไฟล์ตนเอง |
| **GET** | `/api/dashboard` | Admin, Staff | ❌ ไม่มี | สถิติภาพรวมระบบ |
| **GET** | `/api/books` | ทุกคน | ❌ ไม่มี | รายการหนังสือทั้งหมด (ค้นหา/กรองได้) |
| **GET** | `/api/books/:id` | ทุกคน | ❌ ไม่มี | รายละเอียดหนังสือตาม ID |
| **GET** | `/api/books/categories` | ทุกคน | ❌ ไม่มี | รายการหมวดหมู่หนังสือทั้งหมด |
| **POST** | `/api/books` | Admin, Staff | ✅ มี | เพิ่มหนังสือใหม่ |
| **PUT** | `/api/books/:id` | Admin, Staff | ✅ มี | แก้ไขข้อมูลหนังสือ |
| **DELETE** | `/api/books/:id` | Admin | ❌ ไม่มี | ลบหนังสือ (ต้องไม่มีคนยืมค้าง) |
| **GET** | `/api/members` | Admin, Staff | ❌ ไม่มี | รายการสมาชิกทั้งหมด |
| **GET** | `/api/members/:id` | Admin, Staff, เจ้าตัว | ❌ ไม่มี | ข้อมูลสมาชิกตาม ID |
| **GET** | `/api/members/:id/borrowings` | Admin, Staff, เจ้าตัว | ❌ ไม่มี | ประวัติการยืมของสมาชิกรายบุคคล |
| **POST** | `/api/members` | Admin, Staff | ✅ มี | เพิ่มสมาชิกใหม่ |
| **PUT** | `/api/members/:id` | Admin, Staff | ✅ มี | แก้ไขข้อมูลสมาชิก |
| **DELETE** | `/api/members/:id` | Admin | ❌ ไม่มี | ลบสมาชิก (ต้องไม่มียืมค้าง) |
| **GET** | `/api/borrowings` | Admin, Staff | ❌ ไม่มี | รายการยืมทั้งหมดของห้องสมุด |
| **GET** | `/api/borrowings/:id` | Admin, Staff | ❌ ไม่มี | รายละเอียดการยืมตาม ID |
| **POST** | `/api/borrowings` | Admin, Staff | ✅ มี | สร้างรายการยืมหนังสือ |
| **PUT** | `/api/borrowings/:id/return` | Admin, Staff | ❌ ไม่มี | คืนหนังสือตาม ID รายการยืม |

---

## 📖 รายละเอียดแต่ละ Endpoint

---

### 1. หมวดการยืนยันตัวตน (Authentication)

#### 1.1 เข้าสู่ระบบ (Login)
* **Method:** `POST`
* **URL:** `http://localhost:3000/api/auth/login`
* **Auth:** ไม่ต้องใส่
* **Body (`raw` -> `JSON`):**
  ```json
  {
    "email": "admin@librax.com",
    "password": "Admin@123"
  }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR...",
      "user": {
        "id": 1,
        "name": "Library Administrator",
        "email": "admin@librax.com",
        "role": "Admin"
      }
    }
  }
  ```

#### 1.2 ดูข้อมูลผู้ใช้ปัจจุบัน (Get Current User Profile)
* **Method:** `GET`
* **URL:** `http://localhost:3000/api/auth/me`
* **Auth:** Bearer Token

---

### 2. หมวดแดชบอร์ด (Dashboard)

#### 2.1 ดึงสถิติภาพรวม
* **Method:** `GET`
* **URL:** `http://localhost:3000/api/dashboard`
* **Auth:** Bearer Token (Admin, Staff)
* **Response (200 OK):** แสดงสถิติจำนวนหนังสือ, สมาชิก, รายการยืมที่ค้างคืน, รายการยืมเกินกำหนด

---

### 3. หมวดจัดการหนังสือ (Books)

#### 3.1 ดึงรายการหนังสือทั้งหมด (ค้นหาและกรองได้)
* **Method:** `GET`
* **URL:** `http://localhost:3000/api/books`
* **Query Parameters (ระบุหรือไม่ก็ได้):**
  * `?search=clean` (ค้นหาจากชื่อหนังสือ, ผู้แต่ง, ISBN)
  * `?category=Technology` (กรองตามหมวดหมู่)
  * `?status=Available` (กรองสถานะ: `Available`, `Borrowed`, `Out of Stock`)
  * `?page=1&limit=10` (แบ่งหน้า)
* **ตัวอย่าง:** `http://localhost:3000/api/books?search=Code&category=Technology`

#### 3.2 ดึงหมวดหมู่หนังสือทั้งหมด
* **Method:** `GET`
* **URL:** `http://localhost:3000/api/books/categories`

#### 3.3 ดึงข้อมูลหนังสือรายเล่ม
* **Method:** `GET`
* **URL:** `http://localhost:3000/api/books/1`

#### 3.4 เพิ่มหนังสือใหม่
* **Method:** `POST`
* **URL:** `http://localhost:3000/api/books`
* **Auth:** Bearer Token (Admin, Staff)
* **Body (`raw` -> `JSON`):**
  ```json
  {
    "isbn": "978-0132350884",
    "title": "Clean Code: A Handbook of Agile Software Craftsmanship",
    "author": "Robert C. Martin",
    "category": "Technology",
    "publisher": "Prentice Hall",
    "publish_year": 2008,
    "quantity": 5,
    "shelf_location": "A-102",
    "description": "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees."
  }
  ```

#### 3.5 แก้ไขหนังสือ
* **Method:** `PUT`
* **URL:** `http://localhost:3000/api/books/1`
* **Auth:** Bearer Token (Admin, Staff)
* **Body (`raw` -> `JSON`):**
  ```json
  {
    "title": "Clean Code (Updated)",
    "quantity": 8
  }
  ```

#### 3.6 ลบหนังสือ
* **Method:** `DELETE`
* **URL:** `http://localhost:3000/api/books/1`
* **Auth:** Bearer Token (Admin เท่านั้น)
* *หมายเหตุ:* ถ้าหนังสือเล่มนั้นยังมีสถานะถูกยืมค้างอยู่ ระบบจะไม่อนุญาตให้ลบ

---

### 4. หมวดสมาชิก (Members)

#### 4.1 ดูรายชื่อสมาชิกทั้งหมด
* **Method:** `GET`
* **URL:** `http://localhost:3000/api/members`
* **Query Params:**
  * `?search=somchai`
  * `?type=Student` (`Admin`, `Staff`, `Teacher`, `Student`)
* **Auth:** Bearer Token (Admin, Staff)

#### 4.2 ดูข้อมูลสมาชิกรายคน
* **Method:** `GET`
* **URL:** `http://localhost:3000/api/members/1`
* **Auth:** Bearer Token

#### 4.3 ดูประวัติการยืมของสมาชิกคนนั้น
* **Method:** `GET`
* **URL:** `http://localhost:3000/api/members/1/borrowings`
* **Auth:** Bearer Token

#### 4.4 เพิ่มสมาชิกใหม่
* **Method:** `POST`
* **URL:** `http://localhost:3000/api/members`
* **Auth:** Bearer Token (Admin, Staff)
* **Body (`raw` -> `JSON`):**
  ```json
  {
    "member_code": "MEM-2026-001",
    "first_name": "กิตติ",
    "last_name": "มั่นคง",
    "email": "kitti.m@university.ac.th",
    "phone": "0812345678",
    "role": "Student"
  }
  ```

#### 4.5 แก้ไขสมาชิก
* **Method:** `PUT`
* **URL:** `http://localhost:3000/api/members/1`
* **Auth:** Bearer Token (Admin, Staff)
* **Body (`raw` -> `JSON`):**
  ```json
  {
    "phone": "0899998888"
  }
  ```

#### 4.6 ลบสมาชิก
* **Method:** `DELETE`
* **URL:** `http://localhost:3000/api/members/1`
* **Auth:** Bearer Token (Admin เท่านั้น)

---

### 5. หมวดการยืม-คืนหนังสือ (Borrowings)

#### 5.1 ดูรายการยืมทั้งหมดของห้องสมุด
* **Method:** `GET`
* **URL:** `http://localhost:3000/api/borrowings`
* **Query Params:**
  * `?status=Borrowed` (ยังไม่คืน)
  * `?status=Returned` (คืนแล้ว)
  * `?status=Overdue` (เลยกำหนดคืน)
  * `?search=somchai`
* **Auth:** Bearer Token (Admin, Staff)

#### 5.2 ดูรายละเอียดรายการยืมตาม ID
* **Method:** `GET`
* **URL:** `http://localhost:3000/api/borrowings/1`
* **Auth:** Bearer Token (Admin, Staff)

#### 5.3 สร้างรายการยืมหนังสือ (Borrow)
* **Method:** `POST`
* **URL:** `http://localhost:3000/api/borrowings`
* **Auth:** Bearer Token (Admin, Staff)
* **Body (`raw` -> `JSON`):**
  ```json
  {
    "member_id": 1,
    "book_ids": [1],
    "borrow_date": "2026-10-04",
    "due_date": "2026-10-18"
  }
  ```
* **Success Response (201 Created):**
  ```json
  {
    "success": true,
    "data": { "id": 10 },
    "message": "Borrowing created successfully"
  }
  ```

#### 5.4 คืนหนังสือ (Return)
* **Method:** `PUT`
* **URL:** `http://localhost:3000/api/borrowings/10/return`
* **Auth:** Bearer Token (Admin, Staff)
* **Body:** ไม่ต้องใส่ (`none`)
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Books returned successfully"
  }
  ```

---

## 🛠 คำสั่งเมื่อต้องการกู้คืนหรือ Reset ฐานข้อมูล
หากทดสอบ Create หรือ Delete จนข้อมูลหมด หรืออยากรีเซ็ตกลับมาเป็นค่าเริ่มต้น:
```bash
npm run seed
```
ระบบจะทำการเคลียร์ข้อมูลและลงข้อมูลตัวอย่างเริ่มต้นให้อัตโนมัติทันที
