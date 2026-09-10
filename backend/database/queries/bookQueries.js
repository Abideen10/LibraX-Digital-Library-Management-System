// ============================================
// Book Queries
// SQL Query ทั้งหมดที่เกี่ยวกับหนังสือ
// ============================================

const { pool } = require('../connection');

// ดึงหนังสือทั้งหมด (รองรับ search และ filter)
async function getAllBooks(search = '', category = '') {
  let sql = 'SELECT * FROM books WHERE 1=1';
  const params = [];

  if (search) {
    sql += ' AND (title LIKE ? OR author LIKE ? OR isbn LIKE ?)';
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }

  if (category) {
    sql += ' AND category = ?';
    params.push(category);
  }

  sql += ' ORDER BY created_at DESC';

  const [rows] = await pool.execute(sql, params);
  return rows;
}

// ดึงหนังสือตาม ID
async function getBookById(id) {
  const [rows] = await pool.execute('SELECT * FROM books WHERE id = ?', [id]);
  return rows[0] || null;
}

// เพิ่มหนังสือใหม่
async function createBook(bookData) {
  const { isbn, title, author, category, publisher, published_year, quantity, description } = bookData;
  const [result] = await pool.execute(
    `INSERT INTO books (isbn, title, author, category, publisher, published_year, quantity, available_quantity, description)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [isbn, title, author, category, publisher, published_year, quantity, quantity, description]
  );
  return result.insertId;
}

// อัปเดตหนังสือ
async function updateBook(id, bookData) {
  const { isbn, title, author, category, publisher, published_year, quantity, available_quantity, description } = bookData;
  const [result] = await pool.execute(
    `UPDATE books SET isbn = ?, title = ?, author = ?, category = ?, publisher = ?,
     published_year = ?, quantity = ?, available_quantity = ?, description = ?
     WHERE id = ?`,
    [isbn, title, author, category, publisher, published_year, quantity, available_quantity, description, id]
  );
  return result.affectedRows > 0;
}

// ลบหนังสือ
async function deleteBook(id) {
  const [result] = await pool.execute('DELETE FROM books WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

// ดึง Category ทั้งหมดที่มี
async function getAllCategories() {
  const [rows] = await pool.execute('SELECT DISTINCT category FROM books ORDER BY category');
  return rows.map(row => row.category);
}

// อัปเดต available_quantity (เมื่อยืมหรือคืน)
async function updateAvailableQuantity(bookId, change) {
  const [result] = await pool.execute(
    'UPDATE books SET available_quantity = available_quantity + ? WHERE id = ? AND available_quantity + ? >= 0',
    [change, bookId, change]
  );
  return result.affectedRows > 0;
}

// ดึงสถิติหนังสือสำหรับ Dashboard
async function getBookStats() {
  const [rows] = await pool.execute(`
    SELECT
      COUNT(*) as total_books,
      SUM(quantity) as total_copies,
      SUM(available_quantity) as available_copies,
      SUM(quantity - available_quantity) as borrowed_copies
    FROM books
  `);
  return rows[0];
}

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getAllCategories,
  updateAvailableQuantity,
  getBookStats
};
