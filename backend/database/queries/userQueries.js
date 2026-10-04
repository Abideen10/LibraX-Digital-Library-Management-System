// ============================================
// User Queries
// SQL Query ทั้งหมดที่เกี่ยวกับผู้ใช้งานระบบ
// ============================================

const { pool } = require('../connection');

// ดึงผู้ใช้ทั้งหมด (รองรับ search และ filter ตาม role)
async function getAllUsers(search = '', role = '') {
  let sql = 'SELECT id, member_code, first_name, last_name, email, phone, role, created_at, updated_at FROM users WHERE 1=1';
  const params = [];

  if (search) {
    sql += ' AND (first_name LIKE ? OR last_name LIKE ? OR member_code LIKE ? OR email LIKE ?)';
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm, searchTerm, searchTerm);
  }

  if (role) {
    sql += ' AND role = ?';
    params.push(role);
  }

  sql += ' ORDER BY created_at DESC';

  const [rows] = await pool.execute(sql, params);
  return rows;
}

// ดึงผู้ใช้ตาม ID (ไม่ส่ง password_hash กลับ)
async function getUserById(id) {
  const [rows] = await pool.execute(
    'SELECT id, member_code, first_name, last_name, email, phone, role, created_at, updated_at FROM users WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}

// ดึงผู้ใช้ตาม email พร้อม password_hash (ใช้สำหรับ Login เท่านั้น)
async function getUserByEmail(email) {
  const [rows] = await pool.execute(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );
  return rows[0] || null;
}

// เพิ่มผู้ใช้ใหม่
async function createUser(userData) {
  const { member_code, first_name, last_name, email, password_hash, phone, role } = userData;
  const [result] = await pool.execute(
    `INSERT INTO users (member_code, first_name, last_name, email, password_hash, phone, role)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [member_code, first_name, last_name, email, password_hash, phone, role || 'Student']
  );
  return result.insertId;
}

// อัปเดตข้อมูลผู้ใช้ (ไม่รวม password)
async function updateUser(id, userData) {
  const { member_code, first_name, last_name, email, phone, role } = userData;
  const [result] = await pool.execute(
    `UPDATE users SET member_code = ?, first_name = ?, last_name = ?, email = ?, phone = ?, role = ?
     WHERE id = ?`,
    [member_code, first_name, last_name, email, phone, role, id]
  );
  return result.affectedRows > 0;
}

// อัปเดตรหัสผ่าน
async function updateUserPassword(id, password_hash) {
  const [result] = await pool.execute(
    'UPDATE users SET password_hash = ? WHERE id = ?',
    [password_hash, id]
  );
  return result.affectedRows > 0;
}

// ลบผู้ใช้
async function deleteUser(id) {
  const [result] = await pool.execute('DELETE FROM users WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

// นับจำนวนผู้ใช้ทั้งหมด
async function getUserCount() {
  const [rows] = await pool.execute('SELECT COUNT(*) as total FROM users');
  return rows[0].total;
}

// ตรวจสอบรายการยืมที่ยังค้างอยู่ของผู้ใช้
async function getActiveBorrowCount(userId) {
  const [rows] = await pool.execute(
    `SELECT COUNT(*) as active_count FROM borrowings
     WHERE user_id = ? AND status IN ('Borrowed', 'Overdue')`,
    [userId]
  );
  return rows[0].active_count;
}

module.exports = {
  getAllUsers,
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  updateUserPassword,
  deleteUser,
  getUserCount,
  getActiveBorrowCount
};
