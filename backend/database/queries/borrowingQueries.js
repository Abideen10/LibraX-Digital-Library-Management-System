// ============================================
// Borrowing Queries
// SQL Query ทั้งหมดที่เกี่ยวกับการยืม-คืนหนังสือ
// ============================================

const { pool } = require('../connection');

// ดึงรายการยืมทั้งหมด (JOIN กับ user เพื่อแสดงชื่อ)
async function getAllBorrowings(search = '', status = '') {
  let sql = `
    SELECT b.*, u.member_code, u.first_name, u.last_name, u.role as member_type, u.role
    FROM borrowings b
    JOIN users u ON b.user_id = u.id
    WHERE 1=1
  `;
  const params = [];

  if (search) {
    sql += ' AND (u.first_name LIKE ? OR u.last_name LIKE ? OR u.member_code LIKE ?)';
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }

  if (status) {
    sql += ' AND b.status = ?';
    params.push(status);
  }

  sql += ' ORDER BY b.created_at DESC';

  const [rows] = await pool.execute(sql, params);
  return rows;
}

// ดึงรายการยืมตาม ID (รวม items)
async function getBorrowingById(id) {
  // ดึงข้อมูลรายการยืมหลัก
  const [borrowings] = await pool.execute(`
    SELECT b.*, u.member_code, u.first_name, u.last_name, u.role as member_type, u.role, u.email
    FROM borrowings b
    JOIN users u ON b.user_id = u.id
    WHERE b.id = ?
  `, [id]);

  if (borrowings.length === 0) return null;

  // ดึง items ของรายการยืม
  const [items] = await pool.execute(`
    SELECT bi.*, bk.title, bk.isbn, bk.author
    FROM borrowing_items bi
    JOIN books bk ON bi.book_id = bk.id
    WHERE bi.borrowing_id = ?
  `, [id]);

  return {
    ...borrowings[0],
    items: items
  };
}

// สร้างรายการยืมใหม่
async function createBorrowing(memberId, borrowDate, dueDate, bookIds) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    // ปิดระบบบันทึกอัตโนมัติชั่วคราว: โดยปกติ MySQL จะเปิดระบบ Auto-Commit ไว้ คือเมื่อส่งคำสั่ง INSERT หรือ UPDATE ข้อมูลจะถูกเซฟลงตารางจริงทันที แต่คำสั่ง beginTransaction() จะสั่งให้ฐานข้อมูล "พักไว้ก่อน อย่าเพิ่งบันทึกลงดิสก์จริง" จนกว่าจะตรวจสอบจนแน่ใจว่าทุกคำสั่งทำงานสำเร็จครบถ้วน

    // สร้าง borrowing record
    const [borrowResult] = await connection.execute(
      'INSERT INTO borrowings (user_id, borrow_date, due_date, status) VALUES (?, ?, ?, ?)',
      [memberId, borrowDate, dueDate, 'Borrowed']
    );
    const borrowingId = borrowResult.insertId;

    // สร้าง borrowing_items และลด available_quantity ของแต่ละหนังสือ
    for (const bookId of bookIds) {
      await connection.execute(
        'INSERT INTO borrowing_items (borrowing_id, book_id, status) VALUES (?, ?, ?)',
        [borrowingId, bookId, 'Borrowed']
      );

      // ลด available_quantity
      const [updateResult] = await connection.execute(
        'UPDATE books SET available_quantity = available_quantity - 1 WHERE id = ? AND available_quantity > 0',
        [bookId]
      );

      if (updateResult.affectedRows === 0) {
        throw new Error(`Book ID ${bookId} is not available for borrowing`);
      }
    }

    await connection.commit();
    return borrowingId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// คืนหนังสือ (คืนทั้งรายการยืม)
async function returnBorrowing(borrowingId) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // ดึง items ที่ยังไม่คืน
    const [items] = await connection.execute(
      "SELECT * FROM borrowing_items WHERE borrowing_id = ? AND status != 'Returned'",
      [borrowingId]
    );

    if (items.length === 0) {
      throw new Error('No items to return or already returned');
    }

    const today = new Date().toISOString().split('T')[0];

    // อัปเดตแต่ละ item เป็น Returned และเพิ่ม available_quantity
    for (const item of items) {
      await connection.execute(
        "UPDATE borrowing_items SET status = 'Returned', return_date = ? WHERE id = ?",
        [today, item.id]
      );

      await connection.execute(
        'UPDATE books SET available_quantity = available_quantity + 1 WHERE id = ?',
        [item.book_id]
      );
    }

    // อัปเดตสถานะ borrowing หลัก
    await connection.execute(
      "UPDATE borrowings SET status = 'Returned' WHERE id = ?",
      [borrowingId]
    );

    await connection.commit();
    return true;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// ดึงสถิติการยืมสำหรับ Dashboard
async function getBorrowingStats() {
  const [rows] = await pool.execute(`
    SELECT
      COUNT(*) as total_borrowings,
      SUM(CASE WHEN status = 'Borrowed' THEN 1 ELSE 0 END) as active_borrowings,
      SUM(CASE WHEN status = 'Overdue' THEN 1 ELSE 0 END) as overdue_borrowings,
      SUM(CASE WHEN status = 'Returned' THEN 1 ELSE 0 END) as returned_borrowings
    FROM borrowings
  `);
  return rows[0];
}

// ดึงรายการยืมล่าสุด
async function getRecentBorrowings(limit = 5) {
  const [rows] = await pool.execute(`
    SELECT b.*, u.member_code, u.first_name, u.last_name
    FROM borrowings b
    JOIN users u ON b.user_id = u.id
    ORDER BY b.created_at DESC
    LIMIT ?
  `, [limit]);
  return rows;
}

// ดึงรายการยืมตามสมาชิก
async function getBorrowingsByMemberId(memberId) {
  const [rows] = await pool.execute(`
    SELECT b.*, u.member_code, u.first_name, u.last_name
    FROM borrowings b
    JOIN users u ON b.user_id = u.id
    WHERE b.user_id = ?
    ORDER BY b.created_at DESC
  `, [memberId]);
  return rows;
}

module.exports = {
  getAllBorrowings,
  getBorrowingById,
  createBorrowing,
  returnBorrowing,
  getBorrowingStats,
  getRecentBorrowings,
  getBorrowingsByMemberId
};
