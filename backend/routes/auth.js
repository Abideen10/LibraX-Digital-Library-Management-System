// ============================================
// Auth Routes
// กำหนดเส้นทาง API สำหรับการยืนยันตัวตน
// ============================================

const authController = require('../controllers/authController');
const { verifyAuth } = require('../utils/authMiddleware');

/**
 * จัดการ Route สำหรับ /api/auth
 */
function handleAuthRoutes(req, res, pathname, method) {
  // POST /api/auth/login - เข้าสู่ระบบ (ไม่ต้องใช้ Token)
  if (pathname === '/api/auth/login' && method === 'POST') {
    return authController.login(req, res);
  }

  // GET /api/auth/me - ดึงข้อมูลผู้ใช้ปัจจุบัน (ต้องมี Token)
  if (pathname === '/api/auth/me' && method === 'GET') {
    return verifyAuth(req, res, () => authController.getMe(req, res));
  }

  return false;
}

module.exports = { handleAuthRoutes };
