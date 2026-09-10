# System Flow - LibraX Digital Library

## Overall Architecture

```
┌──────────────────────────────────────────┐
│               Frontend                    │
│  HTML + Tailwind CSS + Vanilla JavaScript │
│                                          │
│   index.html  │  books.html  │  ...      │
│   app.js      │  books.js    │  ...      │
└──────────┬───────────────────────────────┘
           │ fetch() API calls
           ▼
┌──────────────────────────────────────────┐
│             Backend (Node.js)             │
│                                          │
│  ┌─────────────────────────────────┐     │
│  │  server.js (HTTP Server)        │     │
│  │  - Static File Serving          │     │
│  │  - API Request Routing          │     │
│  └──────────┬──────────────────────┘     │
│             │                            │
│  ┌──────────▼──────────────────────┐     │
│  │  Routes                          │     │
│  │  - books.js                      │     │
│  │  - members.js                    │     │
│  │  - borrowings.js                 │     │
│  │  (URL Pattern Matching)          │     │
│  └──────────┬──────────────────────┘     │
│             │                            │
│  ┌──────────▼──────────────────────┐     │
│  │  Controllers                     │     │
│  │  - Parse Request                 │     │
│  │  - Call Service                  │     │
│  │  - Send Response                 │     │
│  └──────────┬──────────────────────┘     │
│             │                            │
│  ┌──────────▼──────────────────────┐     │
│  │  Services                        │     │
│  │  - Business Logic                │     │
│  │  - Validation                    │     │
│  │  - Data Transformation           │     │
│  └──────────┬──────────────────────┘     │
│             │                            │
│  ┌──────────▼──────────────────────┐     │
│  │  Database Layer                  │     │
│  │  - connection.js (Pool)          │     │
│  │  - queries/ (SQL Functions)      │     │
│  └──────────┬──────────────────────┘     │
└─────────────┼────────────────────────────┘
              │ mysql2
              ▼
┌──────────────────────────────────────────┐
│          MySQL Database (XAMPP)           │
│                                          │
│  books │ members │ borrowings │ items    │
└──────────────────────────────────────────┘
```

---

## Borrow Book Flow

```
1. User เปิดหน้า Borrow & Return
   └── ดูรายการยืมที่ยังไม่คืน

2. User คลิก "New Borrowing"
   └── Frontend เรียก GET /api/members
   └── Frontend เรียก GET /api/books
   └── แสดง Modal: เลือกสมาชิก + เลือกหนังสือ + วันที่

3. User เลือกข้อมูลและกดบันทึก
   └── Frontend เรียก POST /api/borrowings
       │
       ▼
4. Backend รับ Request
   ├── Route: POST /api/borrowings → borrowingsController
   ├── Controller: parse body → borrowingService.createBorrowing()
   │
   ▼
5. Service ตรวจสอบเงื่อนไข:
   ├── สมาชิกมีอยู่จริง?
   ├── สมาชิกยืมเกิน 5 รายการ?
   ├── หนังสือยังมีให้ยืม (available_quantity > 0)?
   └── วัน due_date > borrow_date?
   │
   ▼
6. Database (Transaction):
   ├── INSERT INTO borrowings
   ├── INSERT INTO borrowing_items (แต่ละเล่ม)
   └── UPDATE books SET available_quantity = available_quantity - 1
   │
   ▼
7. Response → Frontend
   └── แสดง Toast: "Borrowing created successfully"
   └── Refresh รายการ
```

---

## Return Book Flow

```
1. User เปิดหน้า Borrow & Return
   └── เห็นรายการยืมที่ยังไม่คืน

2. User คลิก "Return" ที่รายการที่ต้องการ
   └── ยืนยันด้วย confirm dialog
   │
   ▼
3. Frontend เรียก PUT /api/borrowings/:id/return
   │
   ▼
4. Backend รับ Request
   ├── Route: PUT /api/borrowings/:id/return → borrowingsController
   ├── Controller → borrowingService.returnBorrowing()
   │
   ▼
5. Service ตรวจสอบ:
   ├── รายการยืมมีอยู่จริง?
   └── ยังไม่ได้คืน (status != 'Returned')?
   │
   ▼
6. Database (Transaction):
   ├── SELECT borrowing_items WHERE status != 'Returned'
   ├── UPDATE borrowing_items SET status='Returned', return_date=today
   ├── UPDATE books SET available_quantity = available_quantity + 1
   └── UPDATE borrowings SET status='Returned'
   │
   ▼
7. Response → Frontend
   └── แสดง Toast: "Books returned successfully"
   └── Refresh รายการ
```

---

## Request-Response Flow (ตัวอย่าง GET /api/books)

```
Browser
  │
  ├── fetch('http://localhost:3000/api/books?search=java')
  │
  ▼
server.js (handleRequest)
  │
  ├── method = 'GET'
  ├── pathname = '/api/books'
  ├── pathname.startsWith('/api/') → true
  │
  ▼
routes/books.js (handleBooksRoutes)
  │
  ├── pathname === '/api/books' && method === 'GET' → true
  │
  ▼
controllers/booksController.js (getBooks)
  │
  ├── getQueryParams(req.url) → { search: 'java' }
  ├── bookService.getAllBooks('java', '')
  │
  ▼
services/bookService.js (getAllBooks)
  │
  ├── bookQueries.getAllBooks('java', '')
  ├── เพิ่ม computed status ให้แต่ละหนังสือ
  │
  ▼
database/queries/bookQueries.js (getAllBooks)
  │
  ├── SQL: SELECT * FROM books WHERE title LIKE '%java%' OR ...
  ├── pool.execute(sql, params) → ใช้ Parameterized Query
  │
  ▼
MySQL Database
  │
  ├── Return matching rows
  │
  ▼
Response: { success: true, data: [...books] }
  │
  ▼
Browser
  ├── JavaScript parse JSON
  └── Update UI (render table)
```

---

## Static File Serving Flow

```
Browser requests: http://localhost:3000/pages/books.html
  │
  ▼
server.js
  ├── pathname = '/pages/books.html'
  ├── ไม่เริ่มด้วย '/api/' → serve static file
  ├── path.join(__dirname, '..', 'frontend', '/pages/books.html')
  ├── ตรวจสอบ Path Traversal
  ├── fs.readFile() → send file content
  └── Content-Type: text/html
```
