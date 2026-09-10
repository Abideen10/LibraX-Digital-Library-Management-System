// ============================================
// Borrowings Routes
// กำหนดเส้นทาง API สำหรับการยืม-คืนหนังสือ
// ============================================

const borrowingsController = require('../controllers/borrowingsController');

/**
 * จัดการ Route สำหรับ /api/borrowings
 */
function handleBorrowingsRoutes(req, res, pathname, method) {
  // GET /api/dashboard - ดึงข้อมูล Dashboard
  if (pathname === '/api/dashboard' && method === 'GET') {
    return borrowingsController.getDashboard(req, res);
  }

  // GET /api/borrowings - ดึงรายการยืมทั้งหมด
  if (pathname === '/api/borrowings' && method === 'GET') {
    return borrowingsController.getBorrowings(req, res);
  }

  // POST /api/borrowings - สร้างรายการยืม
  if (pathname === '/api/borrowings' && method === 'POST') {
    return borrowingsController.createBorrowing(req, res);
  }

  // ตรวจสอบ Pattern: /api/borrowings/:id/return
  const returnMatch = pathname.match(/^\/api\/borrowings\/(\d+)\/return$/);
  if (returnMatch && method === 'PUT') {
    const borrowingId = parseInt(returnMatch[1], 10);
    return borrowingsController.returnBorrowing(req, res, borrowingId);
  }

  // ตรวจสอบ Pattern: /api/borrowings/:id
  const borrowingIdMatch = pathname.match(/^\/api\/borrowings\/(\d+)$/);
  if (borrowingIdMatch && method === 'GET') {
    const borrowingId = parseInt(borrowingIdMatch[1], 10);
    return borrowingsController.getBorrowingById(req, res, borrowingId);
  }

  return false;
}

module.exports = { handleBorrowingsRoutes };
