# ER Diagram - LibraX Database

## Database Relationship Diagram

```
┌─────────────────────┐
│       members       │
├─────────────────────┤
│ PK  id              │
│     member_code     │ UNIQUE
│     first_name      │
│     last_name       │
│     email           │ UNIQUE
│     phone           │
│     member_type     │ ENUM: Student, Teacher, Staff
│     created_at      │
│     updated_at      │
└──────────┬──────────┘
           │
           │ 1 : M
           │
┌──────────▼──────────┐
│     borrowings      │
├─────────────────────┤
│ PK  id              │
│ FK  member_id       │ → members.id
│     borrow_date     │
│     due_date        │
│     status          │ ENUM: Borrowed, Returned, Overdue
│     notes           │
│     created_at      │
│     updated_at      │
└──────────┬──────────┘
           │
           │ 1 : M
           │
┌──────────▼──────────┐
│   borrowing_items   │
├─────────────────────┤
│ PK  id              │
│ FK  borrowing_id    │ → borrowings.id (CASCADE DELETE)
│ FK  book_id         │ → books.id
│     return_date     │
│     status          │ ENUM: Borrowed, Returned, Overdue
│     created_at      │
│     updated_at      │
└──────────┬──────────┘
           │
           │ M : 1
           │
┌──────────▼──────────┐
│       books         │
├─────────────────────┤
│ PK  id              │
│     isbn            │ UNIQUE
│     title           │
│     author          │
│     category        │
│     publisher       │
│     published_year  │
│     quantity        │ CHECK >= 0
│     available_quantity│ CHECK >= 0 AND <= quantity
│     description     │
│     created_at      │
│     updated_at      │
└─────────────────────┘
```

## Relationships

### Member → Borrowings (One-to-Many)
- สมาชิก 1 คน สามารถมีรายการยืมได้หลายรายการ
- ใช้ `member_id` เป็น Foreign Key ใน `borrowings`
- ON DELETE RESTRICT: ไม่สามารถลบสมาชิกที่ยังมีรายการยืมอยู่

### Borrowing → Borrowing Items (One-to-Many)
- รายการยืม 1 รายการ สามารถมีหนังสือหลายเล่ม
- ใช้ `borrowing_id` เป็น Foreign Key ใน `borrowing_items`
- ON DELETE CASCADE: ลบ items ทั้งหมดเมื่อลบรายการยืม

### Book → Borrowing Items (One-to-Many)
- หนังสือ 1 เล่ม สามารถถูกยืมได้หลายครั้ง (ในรายการยืมต่างกัน)
- ใช้ `book_id` เป็น Foreign Key ใน `borrowing_items`
- ON DELETE RESTRICT: ไม่สามารถลบหนังสือที่ถูกยืมอยู่

## Indexes

| Table           | Index                        | Purpose                    |
| --------------- | ---------------------------- | -------------------------- |
| books           | idx_books_title              | ค้นหาหนังสือตามชื่อ       |
| books           | idx_books_author             | ค้นหาหนังสือตามผู้แต่ง    |
| books           | idx_books_category           | กรองหนังสือตามหมวดหมู่    |
| books           | idx_books_isbn               | ค้นหาหนังสือตาม ISBN      |
| members         | idx_members_code             | ค้นหาสมาชิกตามรหัส        |
| members         | idx_members_name             | ค้นหาสมาชิกตามชื่อ        |
| members         | idx_members_type             | กรองสมาชิกตามประเภท       |
| borrowings      | idx_borrowings_member        | ดูรายการยืมของสมาชิก      |
| borrowings      | idx_borrowings_status        | กรองตามสถานะ               |
| borrowing_items | idx_items_borrowing          | ดึง items ของแต่ละรายการยืม|
| borrowing_items | idx_items_book               | ดูว่าหนังสือถูกยืมที่ไหน  |

## Constraints

- **books.quantity** ≥ 0
- **books.available_quantity** ≥ 0 AND ≤ quantity
- **books.isbn** — UNIQUE
- **members.member_code** — UNIQUE
- **members.email** — UNIQUE
- **members.member_type** — ENUM('Student', 'Teacher', 'Staff')
- **borrowings.status** — ENUM('Borrowed', 'Returned', 'Overdue')
- **borrowing_items.status** — ENUM('Borrowed', 'Returned', 'Overdue')
