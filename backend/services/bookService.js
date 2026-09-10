// ============================================
// Book Service
// Business Logic สำหรับจัดการหนังสือ
// ============================================

const bookQueries = require('../database/queries/bookQueries');

// ดึงหนังสือทั้งหมด
async function getAllBooks(search, category) {
  const books = await bookQueries.getAllBooks(search, category);

  // เพิ่ม computed status ให้แต่ละหนังสือ
  return books.map(book => ({
    ...book,
    status: computeBookStatus(book)
  }));
}

// ดึงหนังสือตาม ID
async function getBookById(id) {
  const book = await bookQueries.getBookById(id);
  if (!book) return null;

  return {
    ...book,
    status: computeBookStatus(book)
  };
}

// เพิ่มหนังสือใหม่
async function createBook(bookData) {
  // ตรวจสอบข้อมูลที่จำเป็น
  validateBookData(bookData);

  const bookId = await bookQueries.createBook(bookData);
  return bookId;
}

// อัปเดตหนังสือ
async function updateBook(id, bookData) {
  const existingBook = await bookQueries.getBookById(id);
  if (!existingBook) {
    throw new Error('Book not found');
  }

  validateBookData(bookData);

  const updated = await bookQueries.updateBook(id, bookData);
  return updated;
}

// ลบหนังสือ
async function deleteBook(id) {
  const existingBook = await bookQueries.getBookById(id);
  if (!existingBook) {
    throw new Error('Book not found');
  }

  // ตรวจสอบว่ามีการยืมอยู่หรือไม่
  if (existingBook.available_quantity < existingBook.quantity) {
    throw new Error('Cannot delete book that is currently borrowed');
  }

  return await bookQueries.deleteBook(id);
}

// ดึง Category ทั้งหมด
async function getAllCategories() {
  return await bookQueries.getAllCategories();
}

// ดึงสถิติหนังสือ
async function getBookStats() {
  return await bookQueries.getBookStats();
}

// === Helper Functions ===

// คำนวณสถานะหนังสือจาก quantity
function computeBookStatus(book) {
  if (book.available_quantity === 0) return 'Out of Stock';
  if (book.available_quantity < book.quantity) return 'Borrowed';
  return 'Available';
}

// ตรวจสอบข้อมูลหนังสือ
function validateBookData(data) {
  if (!data.isbn || !data.isbn.trim()) {
    throw new Error('ISBN is required');
  }
  if (!data.title || !data.title.trim()) {
    throw new Error('Title is required');
  }
  if (!data.author || !data.author.trim()) {
    throw new Error('Author is required');
  }
  if (!data.category || !data.category.trim()) {
    throw new Error('Category is required');
  }
  if (data.quantity !== undefined && data.quantity < 0) {
    throw new Error('Quantity must be 0 or greater');
  }
}

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getAllCategories,
  getBookStats
};
