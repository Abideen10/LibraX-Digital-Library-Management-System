// ============================================
// Borrow & Return Page JavaScript
// จัดการการยืมและคืนหนังสือ
// ============================================

// === Initialize ===
document.addEventListener('DOMContentLoaded', () => {
  loadActiveBorrowings();
  setDefaultDates();
});

// === Load Active Borrowings ===

async function loadActiveBorrowings() {
  // ดึงเฉพาะรายการที่ยังไม่คืน (Borrowed, Overdue)
  const result = await apiGet('/borrowings?status=Borrowed');
  const resultOverdue = await apiGet('/borrowings?status=Overdue');

  const allActive = [];
  if (result.success) allActive.push(...result.data);
  if (resultOverdue.success) allActive.push(...resultOverdue.data);

  renderActiveBorrowings(allActive);
}

function renderActiveBorrowings(borrowings) {
  const container = document.getElementById('activeBorrowingsContainer');

  if (borrowings.length === 0) {
    container.innerHTML = '<div class="empty-state"><p class="text-lg mb-1">No active borrowings</p><p class="text-sm">All books have been returned</p></div>';
    return;
  }

  container.innerHTML = `
    <table class="data-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Member</th>
          <th>Borrow Date</th>
          <th>Due Date</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${borrowings.map(b => `
          <tr>
            <td class="font-mono text-xs text-zinc-500">#${b.id}</td>
            <td>
              <div class="font-medium text-xs text-zinc-900">${b.first_name} ${b.last_name}</div>
              <div class="text-[11px] font-mono text-zinc-400">${b.member_code}</div>
            </td>
            <td class="text-xs text-zinc-600">${formatDate(b.borrow_date)}</td>
            <td class="text-xs text-zinc-600">${formatDate(b.due_date)}</td>
            <td>${getStatusBadge(b.status)}</td>
            <td>
              <div class="flex gap-1">
                <button class="btn btn-secondary btn-sm" onclick="viewBorrowDetail(${b.id})" title="View Details">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                </button>
                <button class="btn btn-success btn-sm" onclick="returnBorrowing(${b.id})" title="Return Books">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                  Return
                </button>
              </div>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

// === Borrow Modal ===

async function openBorrowModal() {
  // โหลดข้อมูลสมาชิกและหนังสือ
  await Promise.all([loadMembersForSelect(), loadBooksForSelect()]);
  setDefaultDates();
  openModal('borrowModal');
}

async function loadMembersForSelect() {
  const result = await apiGet('/members');
  const select = document.getElementById('borrowMember');

  // เก็บ option แรก (placeholder) ไว้
  select.innerHTML = '<option value="">-- Select Member --</option>';

  if (result.success) {
    result.data.forEach(member => {
      const option = document.createElement('option');
      option.value = member.id;
      option.textContent = `${member.member_code} - ${member.first_name} ${member.last_name}`;
      select.appendChild(option);
    });
  }
}

async function loadBooksForSelect() {
  const result = await apiGet('/books');
  const container = document.getElementById('bookCheckboxList');

  if (!result.success || result.data.length === 0) {
    container.innerHTML = '<p class="text-sm text-slate-400">No books available</p>';
    return;
  }

  // แสดงเฉพาะหนังสือที่มีสำเนาพร้อมให้ยืม
  const availableBooks = result.data.filter(book => book.available_quantity > 0);

  if (availableBooks.length === 0) {
    container.innerHTML = '<p class="text-sm text-slate-400">No books available for borrowing</p>';
    return;
  }

  container.innerHTML = availableBooks.map(book => `
    <label class="flex items-center gap-3 py-2 px-2 hover:bg-slate-50 rounded cursor-pointer">
      <input type="checkbox" name="book_ids" value="${book.id}" class="w-4 h-4 rounded border-slate-300 text-indigo-600">
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium text-slate-700 truncate">${book.title}</p>
        <p class="text-xs text-slate-400">${book.author} · Available: ${book.available_quantity}</p>
      </div>
    </label>
  `).join('');
}

function setDefaultDates() {
  const today = new Date();
  const dueDate = new Date(today);
  dueDate.setDate(dueDate.getDate() + 14); // กำหนดคืนภายใน 14 วัน

  document.getElementById('borrowDate').value = today.toISOString().split('T')[0];
  document.getElementById('dueDate').value = dueDate.toISOString().split('T')[0];
}

// === Submit Borrowing ===

async function handleBorrowSubmit(event) {
  event.preventDefault();

  const memberId = document.getElementById('borrowMember').value;
  const borrowDate = document.getElementById('borrowDate').value;
  const dueDate = document.getElementById('dueDate').value;

  // ดึง book IDs ที่เลือก
  const checkboxes = document.querySelectorAll('input[name="book_ids"]:checked');
  const bookIds = Array.from(checkboxes).map(cb => parseInt(cb.value));

  if (bookIds.length === 0) {
    showToast('Please select at least one book', 'error');
    return;
  }

  const result = await apiPost('/borrowings', {
    member_id: parseInt(memberId),
    book_ids: bookIds,
    borrow_date: borrowDate,
    due_date: dueDate
  });

  if (result.success) {
    showToast('Borrowing created successfully', 'success');
    closeModal('borrowModal');
    loadActiveBorrowings();
    document.getElementById('borrowForm').reset();
  } else {
    showToast(result.message || 'Failed to create borrowing', 'error');
  }
}

// === Return Borrowing ===

async function returnBorrowing(borrowingId) {
  if (!confirmAction('Are you sure you want to return all books in this borrowing?')) return;

  const result = await apiPut(`/borrowings/${borrowingId}/return`);

  if (result.success) {
    showToast('Books returned successfully', 'success');
    loadActiveBorrowings();
  } else {
    showToast(result.message || 'Failed to return books', 'error');
  }
}

// === View Borrowing Detail ===

async function viewBorrowDetail(borrowingId) {
  const result = await apiGet(`/borrowings/${borrowingId}`);

  if (!result.success) {
    showToast('Failed to load borrowing details', 'error');
    return;
  }

  const b = result.data;
  const content = document.getElementById('borrowDetailContent');

  content.innerHTML = `
    <div class="space-y-4">
      <!-- Member Info -->
      <div class="bg-slate-50 rounded-lg p-4">
        <p class="text-xs text-slate-400 font-medium mb-2">Member</p>
        <p class="font-medium text-slate-700">${b.first_name} ${b.last_name}</p>
        <p class="text-sm text-slate-500">${b.member_code} · ${b.email}</p>
        <p class="text-xs mt-1">${getMemberTypeBadge(b.member_type)}</p>
      </div>

      <!-- Dates & Status -->
      <div class="grid grid-cols-3 gap-4">
        <div>
          <p class="text-xs text-slate-400 font-medium">Borrow Date</p>
          <p class="text-sm font-medium text-slate-700">${formatDate(b.borrow_date)}</p>
        </div>
        <div>
          <p class="text-xs text-slate-400 font-medium">Due Date</p>
          <p class="text-sm font-medium text-slate-700">${formatDate(b.due_date)}</p>
        </div>
        <div>
          <p class="text-xs text-slate-400 font-medium">Status</p>
          <p class="mt-0.5">${getStatusBadge(b.status)}</p>
        </div>
      </div>

      <!-- Books -->
      <div>
        <p class="text-xs text-slate-400 font-medium mb-2">Borrowed Books</p>
        <div class="space-y-2">
          ${b.items.map(item => `
            <div class="flex items-center justify-between bg-slate-50 rounded-lg px-4 py-3">
              <div>
                <p class="text-sm font-medium text-slate-700">${item.title}</p>
                <p class="text-xs text-slate-400">${item.author} · ISBN: ${item.isbn}</p>
              </div>
              <div class="text-right">
                ${getStatusBadge(item.status)}
                ${item.return_date ? `<p class="text-xs text-slate-400 mt-1">Returned: ${formatDate(item.return_date)}</p>` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  openModal('borrowDetailModal');
}
