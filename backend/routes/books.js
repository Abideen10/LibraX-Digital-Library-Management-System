// ============================================
// Books Routes
// กำหนดเส้นทาง API สำหรับหนังสือ
// ============================================

const booksController = require('../controllers/booksController');

/**
 * จัดการ Route สำหรับ /api/books
 * @param {object} req - HTTP Request
 * @param {object} res - HTTP Response
 * @param {string} pathname - URL path (ไม่รวม query string)
 * @param {string} method - HTTP Method
 */
function handleBooksRoutes(req, res, pathname, method) {
  // GET /api/books/categories - ดึง Category ทั้งหมด
  if (pathname === '/api/books/categories' && method === 'GET') {
    return booksController.getCategories(req, res);
  }

  // GET /api/books - ดึงหนังสือทั้งหมด
  if (pathname === '/api/books' && method === 'GET') {
    return booksController.getBooks(req, res);
  }

  // POST /api/books - เพิ่มหนังสือ
  if (pathname === '/api/books' && method === 'POST') {
    return booksController.createBook(req, res);
  }

  // ตรวจสอบ Pattern: /api/books/:id
  const bookIdMatch = pathname.match(/^\/api\/books\/(\d+)$/);
  if (bookIdMatch) {
    const bookId = parseInt(bookIdMatch[1], 10);

    if (method === 'GET') return booksController.getBookById(req, res, bookId);
    if (method === 'PUT') return booksController.updateBook(req, res, bookId);
    if (method === 'DELETE') return booksController.deleteBook(req, res, bookId);
  }

  return false; // Route ไม่ตรง
}

module.exports = { handleBooksRoutes };
