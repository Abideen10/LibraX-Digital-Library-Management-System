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

module.exports = {
  getBorrowings,
  getBorrowingById,
  createBorrowing,
  returnBorrowing,
  getDashboard
};
