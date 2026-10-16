// ============================================
// LibraX - Register JavaScript
// จัดการการส่งฟอร์มสมัครสมาชิกใหม่
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // ถ้าผู้ใช้ login อยู่แล้ว ไม่ควรอยู่หน้านี้ → redirect ออก
  const existingToken = getAuthToken();
  if (existingToken) {
    window.location.href = '../index.html';
    return;
  }

  // ซ่อน error banner เมื่อผู้ใช้เริ่มพิมพ์ใหม่
  const fields = ['firstName', 'lastName', 'email', 'phone', 'password', 'confirmPassword'];
  const errorBanner = document.getElementById('registerErrorBanner');

  fields.forEach(fieldId => {
    const input = document.getElementById(fieldId);
    if (input) {
      input.addEventListener('input', () => {
        if (errorBanner) {
          errorBanner.classList.add('hidden');
        }
      });
    }
  });
});

/**
 * สลับแสดง/ซ่อนรหัสผ่าน
 * ฟังก์ชันนี้ถูกเรียกจาก register.html ด้วย onclick="togglePasswordVisibility('password', 'eyeIcon1')"
 * @param {string} inputId  - id ของ input ที่จะสลับ
 * @param {string} iconId   - id ของ svg icon ที่จะเปลี่ยน
 */
function togglePasswordVisibility(inputId, iconId) {
  const input = document.getElementById(inputId);
  const icon = document.getElementById(iconId);

  if (!input || !icon) return;

  if (input.type === 'password') {
    input.type = 'text';
    // เปลี่ยนเป็น icon ขีดฆ่า (ซ่อนอยู่)
    icon.innerHTML = `
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"/>
    `;
  } else {
    input.type = 'password';
    // เปลี่ยนกลับเป็น icon ตา (แสดงอยู่)
    icon.innerHTML = `
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
    `;
  }
}

/**
 * จัดการ Submit ฟอร์ม Register
 * ฟังก์ชันนี้ถูกเรียกจาก register.html ด้วย onsubmit="handleRegisterSubmit(event)"
 */
async function handleRegisterSubmit(event) {
  event.preventDefault();

  // ดึงค่าจากทุก input ในฟอร์ม
  const first_name = document.getElementById('firstName').value.trim();
  const last_name = document.getElementById('lastName').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  const submitBtn = document.getElementById('registerSubmitBtn');
  const btnText = document.getElementById('btnText');
  const btnSpinner = document.getElementById('btnSpinner');
  const errorBanner = document.getElementById('registerErrorBanner');
  const errorMessage = document.getElementById('registerErrorMessage');

  // ซ่อน error banner เดิม
  errorBanner.classList.add('hidden');

  // ตรวจสอบข้อมูลก่อนส่ง
  const validationError = validateRegisterForm({ first_name, last_name, email, password, confirmPassword });
  if (validationError) {
    errorMessage.textContent = validationError;
    errorBanner.classList.remove('hidden');
    return;
  }

  // ปรับสถานะปุ่มเป็น Loading
  submitBtn.disabled = true;
  btnText.textContent = 'Creating account...';
  btnSpinner.classList.remove('hidden');

  try {
    const result = await apiPost('/auth/register', {
      first_name,
      last_name,
      email,
      password,
      phone: phone || undefined
    });

    if (result.success) {
      // สมัครสำเร็จ → แสดง toast แล้ว redirect ไปหน้า login
      if (typeof showToast === 'function') {
        showToast('Account created! Please sign in.', 'success');
      }

      setTimeout(() => {
        window.location.href = './login.html';
      }, 1500);

    } else {
      // แสดง error ที่ตอบกลับมาจาก server
      const msg = result.message || 'Registration failed. Please try again.';
      errorMessage.textContent = msg;
      errorBanner.classList.remove('hidden');

      if (typeof showToast === 'function') {
        showToast(msg, 'error');
      }
    }
  } catch (err) {
    console.error('Register submit error:', err);
    errorMessage.textContent = 'Failed to connect to the server. Please check your network.';
    errorBanner.classList.remove('hidden');
  } finally {
    // คืนค่าสถานะปุ่มเสมอ ไม่ว่าจะสำเร็จหรือไม่
    submitBtn.disabled = false;
    btnText.textContent = 'Create Account';
    btnSpinner.classList.add('hidden');
  }
}

/**
 * ตรวจสอบข้อมูลในฟอร์ม Register
 * @returns {string|null} - คืน error message ถ้าข้อมูลไม่ถูกต้อง, null ถ้าผ่าน
 */
function validateRegisterForm({ first_name, last_name, email, password, confirmPassword }) {
  if (!first_name) {
    return 'Please enter your first name.';
  }

  if (!last_name) {
    return 'Please enter your last name.';
  }

  if (!email) {
    return 'Please enter your email address.';
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return 'Invalid email format (e.g., name@example.com)';
  }

  if (!password) {
    return 'Please enter a password.';
  }

  if (password.length < 6) {
    return 'Password must be at least 6 characters long.';
  }

  if (password !== confirmPassword) {
    return 'Passwords do not match. Please check and try again.';
  }

  return null;
}
