// ============================================
// Utility Helpers
// ฟังก์ชันช่วยเหลือที่ใช้ร่วมกันทั้ง Backend
// ============================================

const url = require('url');

/**
 * ส่ง JSON Response
 */
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(data));
}

/**
 * อ่าน Request Body แล้ว Parse เป็น JSON
 */
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk.toString();

      // จำกัดขนาด body เพื่อป้องกัน payload ที่ใหญ่เกินไป (1MB)
      if (body.length > 1048576) {
        reject(new Error('Request body too large'));
      }
    });

    req.on('end', () => {
      try {
        const parsed = body ? JSON.parse(body) : {};
        resolve(parsed);
      } catch (error) {
        reject(new Error('Invalid JSON in request body'));
      }
    });

    req.on('error', (error) => {
      reject(error);
    });
  });
}

/**
 * ดึง Query Parameters จาก URL
 * เช่น /api/books?search=java&category=CS → { search: 'java', category: 'CS' }
 */
function getQueryParams(requestUrl) {
  const parsedUrl = url.parse(requestUrl, true);
  return parsedUrl.query;
}

/**
 * ดึง Path จาก URL (ตัด query string ออก)
 * เช่น /api/books?search=java → /api/books
 */
function getPathname(requestUrl) {
  const parsedUrl = url.parse(requestUrl, true);
  return parsedUrl.pathname;
}

module.exports = {
  sendJson,
  parseBody,
  getQueryParams,
  getPathname
};
