// ============================================
// Books Controller
// จัดการ Request/Response สำหรับหนังสือ
// ============================================

const bookService = require('../services/bookService');
const { sendJson, parseBody, getQueryParams } = require('../utils/helpers');

// GET /api/books
async function getBooks(req, res) {
  try {
    const params = getQueryParams(req.url);
    const search = params.search || '';
    const category = params.category || '';

    const books = await bookService.getAllBooks(search, category);
    sendJson(res, 200, { success: true, data: books });
  } catch (error) {
    sendJson(res, 500, { success: false, message: error.message });
  }
}

// GET /api/books/:id
async function getBookById(req, res, id) {
  try {
    const book = await bookService.getBookById(id);
    if (!book) {
      return sendJson(res, 404, { success: false, message: 'Book not found' });
    }
    sendJson(res, 200, { success: true, data: book });
  } catch (error) {
    sendJson(res, 500, { success: false, message: error.message });
  }
}

// POST /api/books
async function createBook(req, res) {
  try {
    const body = await parseBody(req);
    const bookId = await bookService.createBook(body);
    sendJson(res, 201, { success: true, data: { id: bookId }, message: 'Book created successfully' });
  } catch (error) {
    const statusCode = error.message.includes('required') ? 400 : 500;
    sendJson(res, statusCode, { success: false, message: error.message });
  }
}

// PUT /api/books/:id
async function updateBook(req, res, id) {
  try {
    const body = await parseBody(req);
    await bookService.updateBook(id, body);
    sendJson(res, 200, { success: true, message: 'Book updated successfully' });
  } catch (error) {
    const statusCode = error.message.includes('not found') ? 404 : 400;
    sendJson(res, statusCode, { success: false, message: error.message });
  }
}

// DELETE /api/books/:id
async function deleteBook(req, res, id) {
  try {
    await bookService.deleteBook(id);
    sendJson(res, 200, { success: true, message: 'Book deleted successfully' });
  } catch (error) {
    const statusCode = error.message.includes('not found') ? 404 : 400;
    sendJson(res, statusCode, { success: false, message: error.message });
  }
}

// GET /api/books/categories
async function getCategories(req, res) {
  try {
    const categories = await bookService.getAllCategories();
    sendJson(res, 200, { success: true, data: categories });
  } catch (error) {
    sendJson(res, 500, { success: false, message: error.message });
  }
}

module.exports = {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getCategories
};
