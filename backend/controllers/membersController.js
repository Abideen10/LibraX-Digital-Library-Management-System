// ============================================
// Members Controller
// จัดการ Request/Response สำหรับสมาชิก
// ============================================

const memberService = require('../services/memberService');
const borrowingService = require('../services/borrowingService');
const { sendJson, parseBody, getQueryParams } = require('../utils/helpers');

// GET /api/members
async function getMembers(req, res) {
  try {
    const params = getQueryParams(req.url);
    const search = params.search || '';
    const memberType = params.member_type || '';

    const members = await memberService.getAllMembers(search, memberType);
    sendJson(res, 200, { success: true, data: members });
  } catch (error) {
    sendJson(res, 500, { success: false, message: error.message });
  }
}

// GET /api/members/:id
async function getMemberById(req, res, id) {
  try {
    const member = await memberService.getMemberById(id);
    if (!member) {
      return sendJson(res, 404, { success: false, message: 'Member not found' });
    }
    sendJson(res, 200, { success: true, data: member });
  } catch (error) {
    sendJson(res, 500, { success: false, message: error.message });
  }
}

// POST /api/members
async function createMember(req, res) {
  try {
    const body = await parseBody(req);
    const memberId = await memberService.createMember(body);
    sendJson(res, 201, { success: true, data: { id: memberId }, message: 'Member created successfully' });
  } catch (error) {
    const statusCode = error.message.includes('required') || error.message.includes('Invalid') ? 400 : 500;
    sendJson(res, statusCode, { success: false, message: error.message });
  }
}

// PUT /api/members/:id
async function updateMember(req, res, id) {
  try {
    const body = await parseBody(req);
    await memberService.updateMember(id, body);
    sendJson(res, 200, { success: true, message: 'Member updated successfully' });
  } catch (error) {
    const statusCode = error.message.includes('not found') ? 404 : 400;
    sendJson(res, statusCode, { success: false, message: error.message });
  }
}

// DELETE /api/members/:id
async function deleteMember(req, res, id) {
  try {
    await memberService.deleteMember(id);
    sendJson(res, 200, { success: true, message: 'Member deleted successfully' });
  } catch (error) {
    const statusCode = error.message.includes('not found') ? 404 : 400;
    sendJson(res, statusCode, { success: false, message: error.message });
  }
}

// GET /api/members/:id/borrowings
async function getMemberBorrowings(req, res, id) {
  try {
    const member = await memberService.getMemberById(id);
    if (!member) {
      return sendJson(res, 404, { success: false, message: 'Member not found' });
    }

    const borrowings = await borrowingService.getBorrowingsByMemberId(id);
    sendJson(res, 200, { success: true, data: borrowings });
  } catch (error) {
    sendJson(res, 500, { success: false, message: error.message });
  }
}

module.exports = {
  getMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
  getMemberBorrowings
};
