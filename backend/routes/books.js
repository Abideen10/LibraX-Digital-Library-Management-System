// ============================================
// Books Routes
// กำหนดเส้นทาง API สำหรับหนังสือ
// ============================================

const booksController = require('../controllers/booksController');
const { verifyRole } = require('../utils/authMiddleware');

/**
 * จัดการ Route สำหรับ /api/books
 * @param {object} req - HTTP Request
 * @param {object} res - HTTP Response
 * @param {string} pathname - URL path (ไม่รวม query string)
 * @param {string} method - HTTP Method
 */
function handleBooksRoutes(req, res, pathname, method) {
  // GET /api/books/categories - ดึง Category ทั้งหมด (ทุก Role เข้าได้)
  if (pathname === '/api/books/categories' && method === 'GET') {
    return booksController.getCategories(req, res);
  }

  // GET /api/books - ดึงหนังสือทั้งหมด (ทุก Role เข้าได้)
  if (pathname === '/api/books' && method === 'GET') {
    return booksController.getBooks(req, res);
  }

  // POST /api/books - เพิ่มหนังสือ (เฉพาะ Admin, Staff)
  if (pathname === '/api/books' && method === 'POST') {
    return verifyRole(['Admin', 'Staff'])(req, res, () => booksController.createBook(req, res));
  }

  // ตรวจสอบ Pattern: /api/books/:id
  const bookIdMatch = pathname.match(/^\/api\/books\/(\d+)$/);
  if (bookIdMatch) {
    const bookId = parseInt(bookIdMatch[1], 10);

    // GET หนังสือตาม ID (ทุก Role เข้าได้)
    if (method === 'GET') return booksController.getBookById(req, res, bookId);

    // PUT แก้ไขหนังสือ (เฉพาะ Admin, Staff)
    if (method === 'PUT') return verifyRole(['Admin', 'Staff'])(req, res, () => booksController.updateBook(req, res, bookId));

    // DELETE ลบหนังสือ (เฉพาะ Admin เท่านั้น)
    if (method === 'DELETE') return verifyRole(['Admin'])(req, res, () => booksController.deleteBook(req, res, bookId));
  }

  return false; // Route ไม่ตรง
}

module.exports = { handleBooksRoutes };
