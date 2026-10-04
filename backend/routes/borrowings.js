// ============================================
// Borrowings Routes
// กำหนดเส้นทาง API สำหรับการยืม-คืนหนังสือ
// ============================================

const borrowingsController = require('../controllers/borrowingsController');
const { verifyRole } = require('../utils/authMiddleware');

/**
 * จัดการ Route สำหรับ /api/borrowings
 */
function handleBorrowingsRoutes(req, res, pathname, method) {
  // GET /api/dashboard - ดึงข้อมูล Dashboard (เฉพาะ Admin, Staff)
  if (pathname === '/api/dashboard' && method === 'GET') {
    return verifyRole(['Admin', 'Staff'])(req, res, () => borrowingsController.getDashboard(req, res));
  }

  // GET /api/borrowings - ดึงรายการยืมทั้งหมด (เฉพาะ Admin, Staff)
  if (pathname === '/api/borrowings' && method === 'GET') {
    return verifyRole(['Admin', 'Staff'])(req, res, () => borrowingsController.getBorrowings(req, res));
  }

  // POST /api/borrowings - สร้างรายการยืม (เฉพาะ Admin, Staff)
  if (pathname === '/api/borrowings' && method === 'POST') {
    return verifyRole(['Admin', 'Staff'])(req, res, () => borrowingsController.createBorrowing(req, res));
  }

  // ตรวจสอบ Pattern: /api/borrowings/:id/return (เฉพาะ Admin, Staff)
  const returnMatch = pathname.match(/^\/api\/borrowings\/(\d+)\/return$/);
  if (returnMatch && method === 'PUT') {
    const borrowingId = parseInt(returnMatch[1], 10);
    return verifyRole(['Admin', 'Staff'])(req, res, () => borrowingsController.returnBorrowing(req, res, borrowingId));
  }

  // ตรวจสอบ Pattern: /api/borrowings/:id (เฉพาะ Admin, Staff)
  const borrowingIdMatch = pathname.match(/^\/api\/borrowings\/(\d+)$/);
  if (borrowingIdMatch && method === 'GET') {
    const borrowingId = parseInt(borrowingIdMatch[1], 10);
    return verifyRole(['Admin', 'Staff'])(req, res, () => borrowingsController.getBorrowingById(req, res, borrowingId));
  }

  return false;
}

module.exports = { handleBorrowingsRoutes };
