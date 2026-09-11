// ============================================
// LibraX Digital Library Management System
// Main Server - Node.js HTTP Module
// ============================================

const http = require('http');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const { testConnection } = require('./database/connection');
const { sendJson, getPathname } = require('./utils/helpers');

// Import Routes
const { handleBooksRoutes } = require('./routes/books');
const { handleMembersRoutes } = require('./routes/members');
const { handleBorrowingsRoutes } = require('./routes/borrowings');

const PORT = process.env.PORT || 3000;

// MIME Types สำหรับ Static Files
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

/**
 * Serve Static File จาก frontend folder
 */
function serveStaticFile(req, res, filePath) {
  // ป้องกัน Path Traversal Attack
  const safePath = path.normalize(filePath).replace(/^(\.\.[\/\\])+/, '');
  const fullPath = path.join(__dirname, '..', 'frontend', safePath);

  // ตรวจสอบว่าอยู่ใน frontend directory
  const frontendDir = path.join(__dirname, '..', 'frontend');
  if (!fullPath.startsWith(frontendDir)) {
    sendJson(res, 403, { success: false, message: 'Forbidden' });
    return;
  }

  fs.readFile(fullPath, (err, data) => {
    if (err) {
      // ถ้าไม่เจอไฟล์ ให้ส่ง 404
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('<h1>404 - File Not Found</h1>');
      return;
    }

    const ext = path.extname(fullPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

/**
 * Main Request Handler
 * จัดการ Request ทั้งหมดที่เข้ามา
 */
async function handleRequest(req, res) {
  const method = req.method;
  const pathname = getPathname(req.url);

  // Handle CORS Preflight Request
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400'
    });
    res.end();
    return;
  }

  // === API Routes ===
  if (pathname.startsWith('/api/')) {
    // ลอง Match Route ทีละกลุ่ม
    // Dashboard
    if (pathname === '/api/dashboard') {
      const result = handleBorrowingsRoutes(req, res, pathname, method);
      if (result !== false) return;
    }

    // Books API
    if (pathname.startsWith('/api/books')) {
      const result = handleBooksRoutes(req, res, pathname, method);
      if (result !== false) return;
    }

    // Members API
    if (pathname.startsWith('/api/members')) {
      const result = handleMembersRoutes(req, res, pathname, method);
      if (result !== false) return;
    }

    // Borrowings API
    if (pathname.startsWith('/api/borrowings')) {
      const result = handleBorrowingsRoutes(req, res, pathname, method);
      if (result !== false) return;
    }

    // ไม่ตรง API Route ใด ๆ
    sendJson(res, 404, { success: false, message: 'API endpoint not found' });
    return;
  }

  // === Static File Serving ===
  // ถ้า path เป็น "/" ให้ serve index.html
  if (pathname === '/') {
    serveStaticFile(req, res, 'index.html');
    return;
  }

  // Serve ไฟล์ตาม path
  serveStaticFile(req, res, pathname);
}

// สร้าง HTTP Server
const server = http.createServer(handleRequest);

// Start Server
async function startServer() {
  // ทดสอบ Database Connection ก่อน
  const dbConnected = await testConnection();

  if (!dbConnected) {
    console.error('⚠️  Server starting without database connection.');
    console.error('   Please make sure XAMPP MySQL is running.');
  }

  server.listen(PORT, () => {
    console.log('');
    console.log('============================================');
    console.log('LibraX Digital Library Management System');
    console.log('============================================');
    console.log(` Frontend: http://localhost:${PORT}`);
    console.log(` API:      http://localhost:${PORT}/api`);
    console.log(` Port:     ${PORT}`);
    console.log('============================================');
    console.log('');
  });
}

startServer();
