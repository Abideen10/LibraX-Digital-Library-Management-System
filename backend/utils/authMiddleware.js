// ============================================
// Auth Middleware
// ตรวจสอบ JWT Token ก่อนอนุญาตให้เข้าถึง API
// ============================================

const authService = require('../services/authService');
const { sendJson } = require('./helpers');

/**
 * Middleware ตรวจสอบ JWT Token จาก Authorization Header
 * ใช้งาน: verifyAuth(req, res, () => controller.action(req, res))
 */
function verifyAuth(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];

    // ตรวจสอบว่ามี Authorization Header ส่งมาหรือไม่
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendJson(res, 401, {
        success: false,
        message: 'Access denied. No token provided'
      });
    }

    // ดึง Token ออกจาก Header (ตัด "Bearer " นำหน้าออก)
    const token = authHeader.substring(7);

    // ตรวจสอบ Token และดึงข้อมูล user
    const decoded = authService.verifyToken(token);

    // แนบข้อมูล user เข้ากับ Request เพื่อให้ Controller นำไปใช้ต่อได้
    req.user = decoded;

    // อนุญาตให้ดำเนินการต่อ
    next();
  } catch (error) {
    return sendJson(res, 401, {
      success: false,
      message: 'Invalid or expired token. Please login again'
    });
  }
}

/**
 * Middleware ตรวจสอบว่า user มี Role ที่อนุญาตหรือไม่
 * ใช้งาน: verifyRole(['Admin', 'Staff'])(req, res, () => controller.action(req, res))
 */
function verifyRole(allowedRoles) {
  return function (req, res, next) {
    const user = req.user;

    if (!user || !allowedRoles.includes(user.role)) {
      return sendJson(res, 403, {
        success: false,
        message: `Access denied. Required role: ${allowedRoles.join(' or ')}`
      });
    }

    next();
  };
}

module.exports = { verifyAuth, verifyRole };
