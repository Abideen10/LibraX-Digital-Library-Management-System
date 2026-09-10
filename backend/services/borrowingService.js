// ============================================
// Borrowing Service
// Business Logic สำหรับการยืม-คืนหนังสือ
// ============================================

const borrowingQueries = require('../database/queries/borrowingQueries');
const bookQueries = require('../database/queries/bookQueries');
const memberQueries = require('../database/queries/memberQueries');

// ดึงรายการยืมทั้งหมด
async function getAllBorrowings(search, status) {
  return await borrowingQueries.getAllBorrowings(search, status);
}

// ดึงรายการยืมตาม ID
async function getBorrowingById(id) {
  return await borrowingQueries.getBorrowingById(id);
}

// สร้างรายการยืมใหม่
async function createBorrowing(data) {
  const { member_id, book_ids, borrow_date, due_date } = data;

  // ตรวจสอบข้อมูลที่จำเป็น
  if (!member_id) throw new Error('Member ID is required');
  if (!book_ids || book_ids.length === 0) throw new Error('At least one book is required');
  if (!borrow_date) throw new Error('Borrow date is required');
  if (!due_date) throw new Error('Due date is required');

  // ตรวจสอบว่าวันกำหนดคืนต้องอยู่หลังวันยืม
  if (new Date(due_date) <= new Date(borrow_date)) {
    throw new Error('Due date must be after borrow date');
  }

  // ตรวจสอบว่าสมาชิกมีอยู่จริง
  const member = await memberQueries.getMemberById(member_id);
  if (!member) throw new Error('Member not found');

  // จำกัดจำนวนการยืมพร้อมกัน (สูงสุด 5 รายการ)
  const activeCount = await memberQueries.getActiveBorrowCount(member_id);
  if (activeCount >= 5) {
    throw new Error('Member has reached the maximum borrowing limit (5 active borrowings)');
  }

  // ตรวจสอบว่าหนังสือแต่ละเล่มยังมีให้ยืม
  for (const bookId of book_ids) {
    const book = await bookQueries.getBookById(bookId);
    if (!book) throw new Error(`Book ID ${bookId} not found`);
    if (book.available_quantity <= 0) {
      throw new Error(`Book "${book.title}" is not available for borrowing`);
    }
  }

  // สร้างรายการยืม
  const borrowingId = await borrowingQueries.createBorrowing(
    member_id, borrow_date, due_date, book_ids
  );

  return borrowingId;
}

// คืนหนังสือ
async function returnBorrowing(borrowingId) {
  const borrowing = await borrowingQueries.getBorrowingById(borrowingId);
  if (!borrowing) throw new Error('Borrowing record not found');

  if (borrowing.status === 'Returned') {
    throw new Error('This borrowing has already been returned');
  }

  return await borrowingQueries.returnBorrowing(borrowingId);
}

// ดึงสถิติการยืม
async function getBorrowingStats() {
  return await borrowingQueries.getBorrowingStats();
}

// ดึงรายการยืมล่าสุด
async function getRecentBorrowings(limit) {
  return await borrowingQueries.getRecentBorrowings(limit);
}

// ดึงรายการยืมของสมาชิก
async function getBorrowingsByMemberId(memberId) {
  return await borrowingQueries.getBorrowingsByMemberId(memberId);
}

module.exports = {
  getAllBorrowings,
  getBorrowingById,
  createBorrowing,
  returnBorrowing,
  getBorrowingStats,
  getRecentBorrowings,
  getBorrowingsByMemberId
};
