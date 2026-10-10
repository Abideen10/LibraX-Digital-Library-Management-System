// ============================================
// LibraX - Main Application JavaScript
// ฟังก์ชันกลางที่ใช้ร่วมกันทุกหน้า
// ============================================

const API_BASE = 'http://localhost:3000/api';

// === Authentication Helpers ===

/**
 * ดึง JWT Token จาก sessionStorage
 */
function getAuthToken() {
  return sessionStorage.getItem('librax_token');
}

/**
 * ดึงข้อมูล User จาก sessionStorage
 */
function getCurrentUser() {
  const userJson = sessionStorage.getItem('librax_user');
  try {
    return userJson ? JSON.parse(userJson) : null;
  } catch (e) {
    return null;
  }
}

/**
 * สร้าง Headers รวมทั้ง Authorization Bearer Token
 */
function getAuthHeaders(extraHeaders = {}) {
  const headers = { ...extraHeaders };
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

/**
 * จัดการเมื่อ Token หมดอายุหรือไม่ถูกต้อง (401)
 */
function handleUnauthorized() {
  sessionStorage.removeItem('librax_token');
  sessionStorage.removeItem('librax_user');
  
  // ตรวจสอบว่าไม่ได้อยู่ที่หน้า login อยู่แล้ว
  if (!window.location.pathname.includes('login.html')) {
    const isPagesDir = window.location.pathname.includes('/pages/');
    const loginUrl = isPagesDir ? './login.html' : './pages/login.html';
    window.location.href = loginUrl;
  }
}

// === API Helper Functions ===

/**
 * เรียก API แบบ GET
 */
async function apiGet(endpoint) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (response.status === 401) {
      handleUnauthorized();
      return { success: false, message: 'Session expired. Please login again.' };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API GET Error:', error);
    return { success: false, message: 'Failed to connect to server' };
  }
}

/**
 * เรียก API แบบ POST
 */
async function apiPost(endpoint, body) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(body)
    });

    if (response.status === 401 && !endpoint.includes('/auth/login')) {
      handleUnauthorized();
      return { success: false, message: 'Session expired. Please login again.' };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API POST Error:', error);
    return { success: false, message: 'Failed to connect to server' };
  }
}

/**
 * เรียก API แบบ PUT
 */
async function apiPut(endpoint, body) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'PUT',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(body)
    });

    if (response.status === 401) {
      handleUnauthorized();
      return { success: false, message: 'Session expired. Please login again.' };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API PUT Error:', error);
    return { success: false, message: 'Failed to connect to server' };
  }
}

/**
 * เรียก API แบบ DELETE
 */
async function apiDelete(endpoint) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (response.status === 401) {
      handleUnauthorized();
      return { success: false, message: 'Session expired. Please login again.' };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API DELETE Error:', error);
    return { success: false, message: 'Failed to connect to server' };
  }
}

// === Toast Notification ===

/**
 * แสดง Toast Notification
 * @param {string} message - ข้อความที่จะแสดง
 * @param {string} type - ประเภท: success, error, info
 */
function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  // ลบ toast หลัง 3 วินาที
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// === Modal Functions ===

/**
 * เปิด Modal
 */
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
  }
}

/**
 * ปิด Modal
 */
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
  }
}

// === Utility Functions ===

/**
 * Format วันที่เป็นรูปแบบ DD/MM/YYYY
 */
function formatDate(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Format วันที่สำหรับ input[type="date"]
 */
function formatDateForInput(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
}

/**
 * สร้าง Badge HTML ตามสถานะ
 */
function getStatusBadge(status) {
  const statusMap = {
    'Available': 'badge-available',
    'Borrowed': 'badge-borrowed',
    'Overdue': 'badge-overdue',
    'Returned': 'badge-returned',
    'Out of Stock': 'badge-out-of-stock'
  };
  const badgeClass = statusMap[status] || 'badge-available';
  return `<span class="badge ${badgeClass}"><span class="badge-dot"></span>${status}</span>`;
}

/**
 * สร้าง Badge สำหรับประเภทสมาชิก
 */
function getMemberTypeBadge(type) {
  const typeMap = {
    'Student': 'badge-student',
    'Teacher': 'badge-teacher',
    'Staff': 'badge-staff'
  };
  const badgeClass = typeMap[type] || 'badge-student';
  return `<span class="badge ${badgeClass}">${type}</span>`;
}

/**
 * สุ่มสีพาสเทลและสร้าง Avatar Chip สำหรับผู้ใช้
 */
function getAvatarChip(name, code = '') {
  const colors = [
    'bg-indigo-50 text-indigo-700 border-indigo-200/70',
    'bg-emerald-50 text-emerald-700 border-emerald-200/70',
    'bg-violet-50 text-violet-700 border-violet-200/70',
    'bg-amber-50 text-amber-700 border-amber-200/70',
    'bg-rose-50 text-rose-700 border-rose-200/70',
    'bg-sky-50 text-sky-700 border-sky-200/70',
    'bg-teal-50 text-teal-700 border-teal-200/70'
  ];
  const key = (code || name || 'A').toString();
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = key.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colorClass = colors[Math.abs(hash) % colors.length];

  let initials = '?';
  if (name) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      initials = (parts[0][0] + parts[1][0]).toUpperCase();
    } else {
      initials = name.substring(0, 2).toUpperCase();
    }
  }

  return `<span class="avatar-chip ${colorClass}">${initials}</span>`;
}

/**
 * แสดง/ซ่อน Loading
 */
function showLoading(containerId) {
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = '<div class="text-center py-12"><div class="spinner mx-auto"></div><p class="text-gray-400 mt-3 text-sm">Loading...</p></div>';
  }
}
// === Navbar Navigation ===

/**
 * Set Active Nav Link ตาม path ปัจจุบัน
 */
function setActiveNavLink() {
  const currentPath = window.location.pathname;
  const links = document.querySelectorAll('.nav-link, .mobile-nav-link, .sidebar-link');

  links.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    if (href && currentPath.endsWith(href.replace('./', ''))) {
      link.classList.add('active');
    }
    // สำหรับ Dashboard (index.html หรือ /)
    if ((currentPath === '/' || currentPath.endsWith('index.html')) && (href === './index.html' || href === '../index.html')) {
      link.classList.add('active');
    }
  });
}

/**
 * Toggle Mobile Nav Menu Dropdown
 */
function toggleMobileMenu() {
  const menu = document.getElementById('mobileNavMenu');
  if (menu) {
    menu.classList.toggle('hidden');
  }
}

// === Confirm Dialog ===
function confirmAction(message) {
  return window.confirm(message);
}

// === Authentication & Route Guard ===

/**
 * ออกจากระบบ (Logout)
 */
function logout() {
  if (confirmAction('Are you sure you want to sign out?')) {
    sessionStorage.removeItem('librax_token');
    sessionStorage.removeItem('librax_user');
    const isPagesDir = window.location.pathname.includes('/pages/');
    const loginUrl = isPagesDir ? './login.html' : './pages/login.html';
    window.location.href = loginUrl;
  }
}

/**
 * Route Guard: ตรวจสอบว่าผู้ใช้มี Token หรือไม่ และมีสิทธิ์เข้าถึงหน้านั้นๆ หรือไม่
 */
function checkAuthRouteGuard() {
  const pathname = window.location.pathname;
  const isLoginPage = pathname.includes('login.html');
  if (isLoginPage) return;

  const token = getAuthToken();
  const user = getCurrentUser();

  // 1. ถ้าไม่มี Token หรือข้อมูล User -> Redirect ไปหน้า Login
  if (!token || !user) {
    const isPagesDir = pathname.includes('/pages/');
    const loginUrl = isPagesDir ? './login.html' : './pages/login.html';
    window.location.href = loginUrl;
    return;
  }

  // 2. Page Access Matrix ตาม Role
  const role = user.role;
  const isStaffOrAdmin = role === 'Admin' || role === 'Staff';

  // ตรวจสอบหน้าที่กำลังเปิดอยู่
  const isDashboard = pathname === '/' || pathname.endsWith('index.html');
  const isMembersPage = pathname.includes('members.html');
  const isBorrowPage = pathname.includes('borrow.html');
  const isHistoryPage = pathname.includes('history.html');

  // หากเป็น Student หรือ Teacher พยายามเข้าหน้า Admin (Dashboard, Members, Borrow, History) -> บล็อกและดีดไปหน้า Books
  if (!isStaffOrAdmin && (isDashboard || isMembersPage || isBorrowPage || isHistoryPage)) {
    const isPagesDir = pathname.includes('/pages/');
    const booksUrl = isPagesDir ? './books.html' : './pages/books.html';
    window.location.href = booksUrl;
    return;
  }

  // 3. ปรับแต่งเมนู Navbar ตามสิทธิ์ Role ของผู้ใช้
  applyRoleBasedNavigation(user);

  // 4. แสดงข้อมูลผู้ใช้และปุ่ม Logout บน Navbar
  renderNavUserProfile();
}

/**
 * ซ่อน/แสดงเมนูใน Navbar ตาม Role
 */
function applyRoleBasedNavigation(user) {
  const isStaffOrAdmin = user && (user.role === 'Admin' || user.role === 'Staff');
  const links = document.querySelectorAll('.nav-link, .mobile-nav-link, .sidebar-link');

  links.forEach(link => {
    const href = link.getAttribute('href') || '';
    const isDashboardLink = href.includes('index.html');
    const isMembersLink = href.includes('members.html');
    const isBorrowLink = href.includes('borrow.html');
    const isHistoryLink = href.includes('history.html');

    // ถ้าไม่ใช่ Staff หรือ Admin ให้ซ่อนเมนูจัดการระบบทั้งหมด เหลือแค่ Books
    if (!isStaffOrAdmin && (isDashboardLink || isMembersLink || isBorrowLink || isHistoryLink)) {
      link.style.display = 'none';
    }
  });

  // ซ่อนปุ่ม Action บนหัวเว็บ Dashboard หรือหน้าอื่นหากไม่ใช่ Admin/Staff
  if (!isStaffOrAdmin) {
    const newLoanBtn = document.querySelector('a[href*="borrow.html"]');
    if (newLoanBtn && !newLoanBtn.classList.contains('nav-link') && !newLoanBtn.classList.contains('mobile-nav-link')) {
      newLoanBtn.style.display = 'none';
    }
  }
}

/**
 * แสดงข้อมูลโปรไฟล์ผู้ใช้และปุ่ม Sign Out บน Navbar
 */
function renderNavUserProfile() {
  const user = getCurrentUser();
  if (!user) return;

  const roleBadgeClass = user.role === 'Admin' ? 'bg-indigo-50 text-indigo-700 border-indigo-200/80'
    : user.role === 'Staff' ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
    : 'bg-zinc-100 text-zinc-700 border-zinc-200';

  const userProfileHtml = `
    <div class="flex items-center gap-3">
      <div class="flex items-center gap-2 pl-2">
        ${getAvatarChip(`${user.first_name || ''} ${user.last_name || ''}`, user.member_code || user.email)}
        <div class="hidden sm:block text-left leading-tight">
          <p class="text-xs font-semibold text-zinc-900 truncate max-w-[120px]">${user.first_name || ''} ${user.last_name || ''}</p>
          <span class="inline-block text-[10px] font-mono px-1.5 py-0.2 rounded border ${roleBadgeClass}">${user.role || 'User'}</span>
        </div>
      </div>
      <button onclick="logout()" class="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors" title="Sign Out">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
        </svg>
      </button>
    </div>
  `;

  // อัปเดตใน Desktop Navbar
  const navContainer = document.getElementById('navUserSection');
  if (navContainer) {
    navContainer.innerHTML = userProfileHtml;
  }

  // อัปเดตใน Mobile Nav Drawer/Menu (ถ้ามี)
  const mobileContainer = document.getElementById('mobileUserSection');
  if (mobileContainer) {
    mobileContainer.innerHTML = `
      <div class="flex items-center justify-between p-3 rounded-lg bg-zinc-50 border border-zinc-200/70">
        <div class="flex items-center gap-2.5">
          ${getAvatarChip(`${user.first_name || ''} ${user.last_name || ''}`, user.member_code || user.email)}
          <div>
            <p class="text-xs font-semibold text-zinc-900">${user.first_name || ''} ${user.last_name || ''}</p>
            <span class="inline-block text-[10px] font-mono px-1.5 py-0.2 rounded border ${roleBadgeClass}">${user.role || 'User'}</span>
          </div>
        </div>
        <button onclick="logout()" class="px-2.5 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded border border-rose-200 flex items-center gap-1">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
          Sign Out
        </button>
      </div>
    `;
  }
}

// === Initialize ===
document.addEventListener('DOMContentLoaded', () => {
  checkAuthRouteGuard();
  setActiveNavLink();
});
