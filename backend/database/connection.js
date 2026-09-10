// ============================================
// Database Connection
// เชื่อมต่อ MySQL ด้วย mysql2 (Promise-based)
// ============================================

const mysql = require('mysql2/promise');
require('dotenv').config();

// สร้าง Connection Pool เพื่อจัดการ Connection อย่างมีประสิทธิภาพ
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'librax_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// ทดสอบ Connection เมื่อเริ่มต้น
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

module.exports = { pool, testConnection };
