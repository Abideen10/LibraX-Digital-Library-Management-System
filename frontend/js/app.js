// ============================================
// LibraX - Main Application JavaScript
// ฟังก์ชันกลางที่ใช้ร่วมกันทุกหน้า
// ============================================

const API_BASE = 'http://localhost:3000/api';

// === API Helper Functions ===

/**
 * เรียก API แบบ GET
 */
async function apiGet(endpoint) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`);
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
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
      method: 'DELETE'
    });
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
  return `<span class="badge ${badgeClass}">${status}</span>`;
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
 * แสดง/ซ่อน Loading
 */
function showLoading(containerId) {
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = '<div class="text-center py-12"><div class="spinner mx-auto"></div><p class="text-gray-400 mt-3 text-sm">Loading...</p></div>';
  }
}

// === Sidebar Navigation ===

/**
 * Set Active Sidebar Link ตาม path ปัจจุบัน
 */
function setActiveSidebarLink() {
  const currentPath = window.location.pathname;
  const links = document.querySelectorAll('.sidebar-link');

  links.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    if (href && currentPath.endsWith(href.replace('./', ''))) {
      link.classList.add('active');
    }
    // สำหรับ Dashboard (index.html หรือ /)
    if ((currentPath === '/' || currentPath.endsWith('index.html')) && href === './index.html') {
      link.classList.add('active');
    }
  });
}

/**
 * Toggle Sidebar สำหรับ Mobile
 */
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  if (sidebar) {
    sidebar.classList.toggle('open');
  }
  if (overlay) {
    overlay.classList.toggle('hidden');
  }
}

// === Confirm Dialog ===
function confirmAction(message) {
  return window.confirm(message);
}

// === Initialize ===
document.addEventListener('DOMContentLoaded', () => {
  setActiveSidebarLink();
});
