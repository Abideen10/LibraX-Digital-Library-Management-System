// ============================================
// Members Routes
// กำหนดเส้นทาง API สำหรับสมาชิก
// ============================================

const membersController = require('../controllers/membersController');

/**
 * จัดการ Route สำหรับ /api/members
 */
function handleMembersRoutes(req, res, pathname, method) {
  // GET /api/members - ดึงสมาชิกทั้งหมด
  if (pathname === '/api/members' && method === 'GET') {
    return membersController.getMembers(req, res);
  }

  // POST /api/members - เพิ่มสมาชิก
  if (pathname === '/api/members' && method === 'POST') {
    return membersController.createMember(req, res);
  }

  // ตรวจสอบ Pattern: /api/members/:id/borrowings
  const memberBorrowingsMatch = pathname.match(/^\/api\/members\/(\d+)\/borrowings$/);
  if (memberBorrowingsMatch && method === 'GET') {
    const memberId = parseInt(memberBorrowingsMatch[1], 10);
    return membersController.getMemberBorrowings(req, res, memberId);
  }

  // ตรวจสอบ Pattern: /api/members/:id
  const memberIdMatch = pathname.match(/^\/api\/members\/(\d+)$/);
  if (memberIdMatch) {
    const memberId = parseInt(memberIdMatch[1], 10);

    if (method === 'GET') return membersController.getMemberById(req, res, memberId);
    if (method === 'PUT') return membersController.updateMember(req, res, memberId);
    if (method === 'DELETE') return membersController.deleteMember(req, res, memberId);
  }

  return false;
}

module.exports = { handleMembersRoutes };
