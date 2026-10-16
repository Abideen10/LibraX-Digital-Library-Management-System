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

// POST /api/auth/register - สมัครสมาชิกใหม่
async function register(req, res) {
  try {
    const body = await parseBody(req);
    const { first_name, last_name, email, password, phone } = body;

    const newUser = await authService.register({ first_name, last_name, email, password, phone });

    sendJson(res, 201, {
      success: true,
      message: 'Account created successfully',
      data: newUser
    });
  } catch (error) {
    // แยก error ที่ user ทำผิด (400/409) ออกจาก error ของระบบ (500)
    const isClientError = error.message.includes('required')
      || error.message.includes('already registered');

    sendJson(res, isClientError ? (error.message.includes('already registered') ? 409 : 400) : 500, {
      success: false,
      message: error.message
    });
  }
}

module.exports = {
  login,
  register,
  getMe
};
