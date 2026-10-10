// ============================================
// LibraX - Login JavaScript
// จัดการการส่งฟอร์มเข้าสู่ระบบและการเปลี่ยนหน้าตาม Role
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // หากผู้ใช้มี Token ที่ยังไม่หมดอายุอยู่ในระบบแล้ว ให้ Redirect ไปหน้า Dashboard ทันที
  const existingToken = sessionStorage.getItem('librax_token');
  if (existingToken) {
    window.location.href = '../index.html';
  }
});

/**
 * สลับการแสดง/ซ่อนรหัสผ่านในช่อง Input
 */
function togglePasswordVisibility() {
  const passwordInput = document.getElementById('password');
  const eyeIcon = document.getElementById('eyeIcon');

  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    eyeIcon.innerHTML = `
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"/>
    `;
  } else {
    passwordInput.type = 'password';
    eyeIcon.innerHTML = `
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
    `;
  }
}

/**
 * จัดการ Submit ฟอร์ม Login
 */
async function handleLoginSubmit(event) {
  event.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  const submitBtn = document.getElementById('loginSubmitBtn');
  const btnText = document.getElementById('btnText');
  const btnSpinner = document.getElementById('btnSpinner');
  const errorBanner = document.getElementById('loginErrorBanner');
  const errorMessage = document.getElementById('loginErrorMessage');

  // ซ่อน Error banner เดิม
  errorBanner.classList.add('hidden');

  // ปรับสถานะปุ่มเป็น Loading
  submitBtn.disabled = true;
  btnText.textContent = 'Signing in...';
  btnSpinner.classList.remove('hidden');

  try {
    const result = await apiPost('/auth/login', { email, password });

    if (result.success && result.data && result.data.token) {
      // 1. บันทึก Token และข้อมูล User ลงใน sessionStorage
      sessionStorage.setItem('librax_token', result.data.token);
      sessionStorage.setItem('librax_user', JSON.stringify(result.data.user));

      // 2. แสดง Toast แจ้งเตือนสำเร็จ
      if (typeof showToast === 'function') {
        showToast('Login successful! Redirecting...', 'success');
      }

      // 3. เปลี่ยนหน้า (Redirect) ตามบทบาท (Role) ของผู้ใช้
      const role = result.data.user.role;
      setTimeout(() => {
        if (role === 'Admin' || role === 'Staff') {
          // แอดมินและเจ้าหน้าที่ ไปหน้า Dashboard จัดการหลัก
          window.location.href = '../index.html';
        } else {
          // นักเรียน/อาจารย์ นำไปหน้าค้นหาหนังสือ Books
          window.location.href = './books.html';
        }
      }, 500);

    } else {
      // แสดงข้อความ Error ที่ตอบกลับมาจาก Server
      const msg = result.message || 'Invalid email or password. Please try again.';
      errorMessage.textContent = msg;
      errorBanner.classList.remove('hidden');
      if (typeof showToast === 'function') {
        showToast(msg, 'error');
      }
    }
  } catch (err) {
    console.error('Login submit error:', err);
    errorMessage.textContent = 'Failed to connect to the server. Please check your network.';
    errorBanner.classList.remove('hidden');
  } finally {
    // คืนค่าสถานะปุ่ม
    submitBtn.disabled = false;
    btnText.textContent = 'Sign In';
    btnSpinner.classList.add('hidden');
  }
}
