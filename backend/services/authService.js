// ============================================
// Auth Service
// Business Logic สำหรับการยืนยันตัวตน
// ============================================

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userQueries = require('../database/queries/userQueries');
const { pool } = require('../database/connection');

const JWT_SECRET = process.env.JWT_SECRET || 'librax_super_secret_jwt_key_2026';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '30m';

// Login: ตรวจสอบ email และ password แล้วสร้าง Token
async function login(email, password) {
  // ตรวจสอบว่ามีการส่ง email และ password มา
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  // ค้นหา user จาก email (ดึงพร้อม password_hash)
  const user = await userQueries.getUserByEmail(email);
  if (!user) {
    throw new Error('Invalid email or password');
  }

  // ตรวจสอบว่า user มีการตั้งรหัสผ่านไว้แล้วหรือไม่
  if (!user.password_hash) {
    throw new Error('Password not set. Please contact administrator');
  }

  // เปรียบเทียบรหัสผ่านที่กรอกมากับ hash ในฐานข้อมูล
  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  // สร้าง JWT Token พร้อมข้อมูลพื้นฐานของ user (ไม่ใส่ password_hash)
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    first_name: user.first_name,
    last_name: user.last_name,
    member_code: user.member_code
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

  return {
    token,
    user: payload
  };
}

// สร้าง member_code อัตโนมัติ (เช่น STU-0001, STU-0002)
async function generateMemberCode() {
  const [rows] = await pool.execute('SELECT COUNT(*) as total FROM users');
  const total = rows[0].total;
  const paddedNumber = String(total + 1).padStart(4, '0');
  return `STU-${paddedNumber}`;
}

// Register: สมัครสมาชิกใหม่ (Role = Student เสมอ)
async function register(userData) {
  const { first_name, last_name, email, password, phone } = userData;

  // ตรวจสอบว่ากรอกข้อมูลจำเป็นครบหรือไม่
  if (!first_name || !last_name || !email || !password) {
    throw new Error('First name, last name, email, and password are required');
  }

  // ตรวจสอบว่า email นี้มีในระบบอยู่แล้วหรือไม่
  const existingUser = await userQueries.getUserByEmail(email);
  if (existingUser) {
    throw new Error('This email is already registered');
  }

  // สร้าง member_code และ hash รหัสผ่าน
  const member_code = await generateMemberCode();
  const password_hash = await hashPassword(password);

  // บันทึก user ใหม่ลง Database
  const newUserId = await userQueries.createUser({
    member_code,
    first_name,
    last_name,
    email,
    password_hash,
    phone: phone || null,
    role: 'Student'
  });

  return {
    id: newUserId,
    member_code,
    first_name,
    last_name,
    email,
    role: 'Student'
  };
}

// Hash รหัสผ่าน (ใช้ตอนสร้าง user ใหม่หรือเปลี่ยนรหัสผ่าน)
async function hashPassword(plainPassword) {
  const saltRounds = 10;
  return await bcrypt.hash(plainPassword, saltRounds);
}

// ตรวจสอบ JWT Token และดึงข้อมูล user จาก Token
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

module.exports = {
  login,
  register,
  hashPassword,
  verifyToken
};
