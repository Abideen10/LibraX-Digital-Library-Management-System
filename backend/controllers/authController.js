// ============================================
// Auth Controller
// จัดการ Request/Response สำหรับการยืนยันตัวตน
// ============================================

const authService = require('../services/authService');
const { sendJson, parseBody } = require('../utils/helpers');

// POST /api/auth/login
async function login(req, res) {
  try {
    const body = await parseBody(req);
    const { email, password } = body;

    const result = await authService.login(email, password);

    sendJson(res, 200, {
      success: true,
      message: 'Login successful',
      data: {
        token: result.token,
        user: result.user
      }
    });
  } catch (error) {
    // แยกข้อความ error ที่เกี่ยวกับ credentials ผิด vs error อื่น
    const isAuthError = error.message.includes('Invalid email or password')
      || error.message.includes('required')
      || error.message.includes('Password not set');

    sendJson(res, isAuthError ? 401 : 500, {
      success: false,
      message: error.message
    });
  }
}

// GET /api/auth/me - ดึงข้อมูลผู้ใช้ปัจจุบันจาก Token
async function getMe(req, res) {
  try {
    // ข้อมูล user ถูกแนบมาโดย authMiddleware แล้ว
    const user = req.user;

    sendJson(res, 200, {
      success: true,
      data: user
    });
  } catch (error) {
    sendJson(res, 500, { success: false, message: error.message });
  }
}

module.exports = {
  login,
  getMe
};
