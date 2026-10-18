// ============================================
// Borrowings Controller
// จัดการ Request/Response สำหรับการยืม-คืนหนังสือ
// ============================================

const borrowingService = require('../services/borrowingService');
const { sendJson, parseBody, getQueryParams } = require('../utils/helpers');

// GET /api/borrowings
async function getBorrowings(req, res) {
  try {
    const params = getQueryParams(req.url);
    const search = params.search || '';
    const status = params.status || '';

    const borrowings = await borrowingService.getAllBorrowings(search, status);
    sendJson(res, 200, { success: true, data: borrowings });
  } catch (error) {
    sendJson(res, 500, { success: false, message: error.message });
  }
}

// GET /api/borrowings/:id
async function getBorrowingById(req, res, id) {
  try {
    const borrowing = await borrowingService.getBorrowingById(id);
    if (!borrowing) {
      return sendJson(res, 404, { success: false, message: 'Borrowing record not found' });
    }
    sendJson(res, 200, { success: true, data: borrowing });
  } catch (error) {
    sendJson(res, 500, { success: false, message: error.message });
  }
}

// POST /api/borrowings
async function createBorrowing(req, res) {
  try {
    const body = await parseBody(req);
    const borrowingId = await borrowingService.createBorrowing(body);
    sendJson(res, 201, { success: true, data: { id: borrowingId }, message: 'Borrowing created successfully' });
  } catch (error) {
    const statusCode = error.message.includes('required') || error.message.includes('not found')
      || error.message.includes('not available') || error.message.includes('limit') ? 400 : 500;
    sendJson(res, statusCode, { success: false, message: error.message });
  }
}

// PUT /api/borrowings/:id/return
async function returnBorrowing(req, res, id) {
  try {
    await borrowingService.returnBorrowing(id);
    sendJson(res, 200, { success: true, message: 'Books returned successfully' });
  } catch (error) {
    const statusCode = error.message.includes('not found') ? 404 : 400;
    sendJson(res, statusCode, { success: false, message: error.message });
  }
}

// GET /api/dashboard
async function getDashboard(req, res) {
  try {
    const bookService = require('../services/bookService');
    const memberService = require('../services/memberService');

    const [bookStats, borrowingStats, memberCount, recentBorrowings] = await Promise.all([
      bookService.getBookStats(),
      borrowingService.getBorrowingStats(),
      memberService.getMemberCount(),
      borrowingService.getRecentBorrowings(5)
    ]);

    sendJson(res, 200, {
      success: true,
      data: {
        books: bookStats,
        borrowings: borrowingStats,
        total_members: memberCount,
        recent_borrowings: recentBorrowings
      }
    });
  } catch (error) {
    sendJson(res, 500, { success: false, message: error.message });
  }
}

// POST /api/borrowings/request (Student, Staff ส่งคำขอยืมของตัวเอง)
async function requestBorrowing(req, res) {
  try {
    const body = await parseBody(req);
    const userId = req.user.id;
    const borrowingId = await borrowingService.createBorrowRequest({ ...body, userId });
    sendJson(res, 201, {
      success: true,
      data: { id: borrowingId },
      message: 'Borrow request submitted successfully. Waiting for admin approval.'
    });
  } catch (error) {
    const statusCode = error.message.includes('required') || error.message.includes('limit')
      || error.message.includes('not found') || error.message.includes('out of stock') ? 400 : 500;
    sendJson(res, statusCode, { success: false, message: error.message });
  }
}

// GET /api/borrowings/my (ดึงรายการยืมของ User ที่กำลัง Login อยู่)
async function getMyBorrowings(req, res) {
  try {
    const userId = req.user.id;
    const borrowings = await borrowingService.getMyBorrowings(userId);
    sendJson(res, 200, { success: true, data: borrowings });
  } catch (error) {
    sendJson(res, 500, { success: false, message: error.message });
  }
}

// PUT /api/borrowings/:id/approve (Admin อนุมัติคำขอยืม)
async function approveBorrowing(req, res, id) {
  try {
    await borrowingService.approveBorrowing(id);
    sendJson(res, 200, { success: true, message: 'Borrowing request approved successfully' });
  } catch (error) {
    const statusCode = error.message.includes('not found') ? 404
      : (error.message.includes('status') || error.message.includes('out of stock') || error.message.includes('available')) ? 400 : 500;
    sendJson(res, statusCode, { success: false, message: error.message });
  }
}

// PUT /api/borrowings/:id/reject (Admin ปฏิเสธคำขอยืม)
async function rejectBorrowing(req, res, id) {
  try {
    const body = await parseBody(req).catch(() => ({}));
    await borrowingService.rejectBorrowing(id, body.reason || '');
    sendJson(res, 200, { success: true, message: 'Borrowing request rejected successfully' });
  } catch (error) {
    const statusCode = error.message.includes('not found') ? 404 : 400;
    sendJson(res, statusCode, { success: false, message: error.message });
  }
}

module.exports = {
  getBorrowings,
  getBorrowingById,
  createBorrowing,
  returnBorrowing,
  getDashboard,
  requestBorrowing,
  getMyBorrowings,
  approveBorrowing,
  rejectBorrowing
};
