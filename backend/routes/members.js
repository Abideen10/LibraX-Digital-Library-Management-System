// ============================================
// Members Routes
// กำหนดเส้นทาง API สำหรับสมาชิก
// ============================================

const membersController = require('../controllers/membersController');
const { verifyRole } = require('../utils/authMiddleware');

/**
 * จัดการ Route สำหรับ /api/members
 */
function handleMembersRoutes(req, res, pathname, method) {
  // GET /api/members - ดึงสมาชิกทั้งหมด (เฉพาะ Admin, Staff)
  if (pathname === '/api/members' && method === 'GET') {
    return verifyRole(['Admin', 'Staff'])(req, res, () => membersController.getMembers(req, res));
  }

  // POST /api/members - เพิ่มสมาชิก (เฉพาะ Admin, Staff)
  if (pathname === '/api/members' && method === 'POST') {
    return verifyRole(['Admin', 'Staff'])(req, res, () => membersController.createMember(req, res));
  }

  // ตรวจสอบ Pattern: /api/members/:id/borrowings (Admin, Staff หรือตัวผู้ใช้เอง)
  const memberBorrowingsMatch = pathname.match(/^\/api\/members\/(\d+)\/borrowings$/);
  if (memberBorrowingsMatch && method === 'GET') {
    const memberId = parseInt(memberBorrowingsMatch[1], 10);
    // อนุญาตถ้าเป็น Admin/Staff หรือเป็น ID ของตัวเอง
    if (['Admin', 'Staff'].includes(req.user.role) || req.user.id === memberId) {
      return membersController.getMemberBorrowings(req, res, memberId);
    }
    const { sendJson } = require('../utils/helpers');
    return sendJson(res, 403, { success: false, message: 'Access denied to other members records' });
  }

  // ตรวจสอบ Pattern: /api/members/:id
  const memberIdMatch = pathname.match(/^\/api\/members\/(\d+)$/);
  if (memberIdMatch) {
    const memberId = parseInt(memberIdMatch[1], 10);

    // ดูข้อมูลสมาชิก (Admin/Staff หรือตัวผู้ใช้เอง)
    if (method === 'GET') {
      if (['Admin', 'Staff'].includes(req.user.role) || req.user.id === memberId) {
        return membersController.getMemberById(req, res, memberId);
      }
      const { sendJson } = require('../utils/helpers');
      return sendJson(res, 403, { success: false, message: 'Access denied' });
    }

    // แก้ไขข้อมูลสมาชิก (Admin, Staff)
    if (method === 'PUT') return verifyRole(['Admin', 'Staff'])(req, res, () => membersController.updateMember(req, res, memberId));

    // ลบสมาชิก (เฉพาะ Admin เท่านั้น)
    if (method === 'DELETE') return verifyRole(['Admin'])(req, res, () => membersController.deleteMember(req, res, memberId));
  }

  return false;
}

module.exports = { handleMembersRoutes };
