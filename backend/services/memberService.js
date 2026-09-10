// ============================================
// Member Service
// Business Logic สำหรับจัดการสมาชิก
// ============================================

const memberQueries = require('../database/queries/memberQueries');

// ดึงสมาชิกทั้งหมด
async function getAllMembers(search, memberType) {
  return await memberQueries.getAllMembers(search, memberType);
}

// ดึงสมาชิกตาม ID
async function getMemberById(id) {
  const member = await memberQueries.getMemberById(id);
  if (!member) return null;
  return member;
}

// เพิ่มสมาชิกใหม่
async function createMember(memberData) {
  validateMemberData(memberData);
  const memberId = await memberQueries.createMember(memberData);
  return memberId;
}

// อัปเดตสมาชิก
async function updateMember(id, memberData) {
  const existingMember = await memberQueries.getMemberById(id);
  if (!existingMember) {
    throw new Error('Member not found');
  }

  validateMemberData(memberData);
  return await memberQueries.updateMember(id, memberData);
}

// ลบสมาชิก
async function deleteMember(id) {
  const existingMember = await memberQueries.getMemberById(id);
  if (!existingMember) {
    throw new Error('Member not found');
  }

  // ตรวจสอบว่ามีการยืมที่ยังไม่คืนหรือไม่
  const activeBorrows = await memberQueries.getActiveBorrowCount(id);
  if (activeBorrows > 0) {
    throw new Error('Cannot delete member with active borrowings');
  }

  return await memberQueries.deleteMember(id);
}

// นับจำนวนสมาชิก
async function getMemberCount() {
  return await memberQueries.getMemberCount();
}

// === Helper Functions ===

// ตรวจสอบข้อมูลสมาชิก
function validateMemberData(data) {
  if (!data.member_code || !data.member_code.trim()) {
    throw new Error('Member code is required');
  }
  if (!data.first_name || !data.first_name.trim()) {
    throw new Error('First name is required');
  }
  if (!data.last_name || !data.last_name.trim()) {
    throw new Error('Last name is required');
  }
  if (!data.email || !data.email.trim()) {
    throw new Error('Email is required');
  }

  // ตรวจสอบรูปแบบ email เบื้องต้น
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(data.email)) {
    throw new Error('Invalid email format');
  }

  const validTypes = ['Student', 'Teacher', 'Staff'];
  if (!data.member_type || !validTypes.includes(data.member_type)) {
    throw new Error('Member type must be Student, Teacher, or Staff');
  }
}

module.exports = {
  getAllMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
  getMemberCount
};
