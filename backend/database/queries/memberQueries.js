// ============================================
// Member Queries
// SQL Query ทั้งหมดที่เกี่ยวกับสมาชิก (ดึงจากตาราง users)
// ============================================

const { pool } = require('../connection');

// ดึงสมาชิกทั้งหมด (รองรับ search และ filter)
async function getAllMembers(search = '', memberType = '') {
  let sql = 'SELECT id, member_code, first_name, last_name, email, phone, role as member_type, role, created_at, updated_at FROM users WHERE 1=1';
  const params = [];

  if (search) {
    sql += ' AND (first_name LIKE ? OR last_name LIKE ? OR member_code LIKE ? OR email LIKE ?)';
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm, searchTerm, searchTerm);
  }

  if (memberType) {
    sql += ' AND role = ?';
    params.push(memberType);
  }

  sql += ' ORDER BY created_at DESC';

  const [rows] = await pool.execute(sql, params);
  return rows;
}

// ดึงสมาชิกตาม ID
async function getMemberById(id) {
  const [rows] = await pool.execute(
    'SELECT id, member_code, first_name, last_name, email, phone, role as member_type, role, created_at, updated_at FROM users WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}

// เพิ่มสมาชิกใหม่
async function createMember(memberData) {
  const { member_code, first_name, last_name, email, password_hash, phone, member_type, role } = memberData;
  const userRole = role || member_type || 'Student';
  const [result] = await pool.execute(
    `INSERT INTO users (member_code, first_name, last_name, email, password_hash, phone, role)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [member_code, first_name, last_name, email, password_hash || null, phone, userRole]
  );
  return result.insertId;
}

// อัปเดตสมาชิก
async function updateMember(id, memberData) {
  const { member_code, first_name, last_name, email, phone, member_type, role } = memberData;
  const userRole = role || member_type || 'Student';
  const [result] = await pool.execute(
    `UPDATE users SET member_code = ?, first_name = ?, last_name = ?, email = ?, phone = ?, role = ?
     WHERE id = ?`,
    [member_code, first_name, last_name, email, phone, userRole, id]
  );
  return result.affectedRows > 0;
}

// ลบสมาชิก
async function deleteMember(id) {
  const [result] = await pool.execute('DELETE FROM users WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

// นับจำนวนสมาชิกทั้งหมด
async function getMemberCount() {
  const [rows] = await pool.execute('SELECT COUNT(*) as total FROM users');
  return rows[0].total;
}

// ตรวจสอบว่าสมาชิกมีการยืมที่ยังไม่คืนกี่รายการ
async function getActiveBorrowCount(memberId) {
  const [rows] = await pool.execute(
    `SELECT COUNT(*) as active_count FROM borrowings
     WHERE user_id = ? AND status IN ('Borrowed', 'Overdue')`,
    [memberId]
  );
  return rows[0].active_count;
}

module.exports = {
  getAllMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
  getMemberCount,
  getActiveBorrowCount
};
