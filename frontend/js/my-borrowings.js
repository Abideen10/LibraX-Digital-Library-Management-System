// ============================================
// My Borrowings & Requests Page JavaScript
// แสดงและส่งคำขอยืมหนังสือของตนเอง
// ============================================

let allMyLoans = [];
let currentFilter = 'ALL';

// === Initialize ===
document.addEventListener('DOMContentLoaded', () => {
  loadMyLoans();
  setDefaultRequestDates();
});

// === Load User's Loans ===

async function loadMyLoans() {
  showLoading('myLoansTableContainer');
  const result = await apiGet('/borrowings/my');

  if (result.success) {
    allMyLoans = result.data || [];
    renderMyLoansTable();
  } else {
    document.getElementById('myLoansTableContainer').innerHTML = `
      <div class="empty-state py-10">
        <p class="text-sm text-rose-500 font-medium">${result.message || 'Failed to load your borrowings'}</p>
      </div>
    `;
  }
}

function filterMyLoans(tab) {
  currentFilter = tab;
  document.querySelectorAll('.loan-tab').forEach(btn => {
    if (btn.getAttribute('data-tab') === tab) {
      btn.classList.add('active', 'bg-zinc-100', 'text-zinc-900');
      btn.classList.remove('text-zinc-500');
    } else {
      btn.classList.remove('active', 'bg-zinc-100', 'text-zinc-900');
      btn.classList.add('text-zinc-500');
    }
  });
  renderMyLoansTable();
}

function renderMyLoansTable() {
  const container = document.getElementById('myLoansTableContainer');

  let filtered = allMyLoans;
  if (currentFilter !== 'ALL') {
    filtered = allMyLoans.filter(item => item.status === currentFilter);
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state py-12">
        <p class="text-sm font-medium text-zinc-600 mb-1">No borrowing records found</p>
        <p class="text-xs text-zinc-400">Click "Request to Borrow" to request books from the library</p>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <table class="data-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Requested / Borrowed Books</th>
          <th>Borrow Date</th>
          <th>Due Date</th>
          <th>Status</th>
          <th>Notes / Reason</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${filtered.map(loan => {
          const bookTitles = (loan.items || []).map(b => b.title).join(', ') || '-';
          return `
            <tr>
              <td class="font-mono text-xs text-zinc-500">#${loan.id}</td>
              <td>
                <div class="font-medium text-xs text-zinc-900 truncate max-w-[280px]" title="${bookTitles}">
                  ${bookTitles}
                </div>
                <div class="text-[11px] text-zinc-400">${(loan.items || []).length} book(s)</div>
              </td>
              <td class="text-xs text-zinc-600">${formatDate(loan.borrow_date)}</td>
              <td class="text-xs text-zinc-600">${formatDate(loan.due_date)}</td>
              <td>${getStatusBadge(loan.status)}</td>
              <td class="text-xs text-zinc-500 max-w-[180px] truncate" title="${loan.notes || ''}">
                ${loan.notes || '-'}
              </td>
              <td>
                <button class="btn btn-secondary btn-sm" onclick="viewMyLoanDetail(${loan.id})" title="View Details">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                  Details
                </button>
              </td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>
  `;
}

// === Request Modal ===

async function openRequestModal() {
  await loadAvailableBooksForRequest();
  setDefaultRequestDates();
  openModal('requestBorrowModal');
}

async function loadAvailableBooksForRequest() {
  const result = await apiGet('/books');
  const container = document.getElementById('requestBookCheckboxList');

  if (!result.success || !result.data || result.data.length === 0) {
    container.innerHTML = '<p class="text-xs text-zinc-400 py-3 text-center">No books found</p>';
    return;
  }

  const availableBooks = result.data.filter(b => b.available_quantity > 0);

  if (availableBooks.length === 0) {
    container.innerHTML = '<p class="text-xs text-rose-500 py-3 text-center">All books are currently out of stock</p>';
    return;
  }

  container.innerHTML = availableBooks.map(book => `
    <label class="flex items-center gap-3 py-2 px-2 hover:bg-zinc-50 rounded cursor-pointer transition-colors">
      <input type="checkbox" name="req_book_ids" value="${book.id}" class="w-4 h-4 rounded border-zinc-300 text-indigo-600">
      <div class="flex-1 min-w-0">
        <p class="text-xs font-semibold text-zinc-900 truncate">${book.title}</p>
        <p class="text-[11px] text-zinc-400">${book.author} · In Stock: <span class="text-emerald-600 font-medium">${book.available_quantity}</span></p>
      </div>
    </label>
  `).join('');
}

function setDefaultRequestDates() {
  const today = new Date();
  const dueDate = new Date(today);
  dueDate.setDate(dueDate.getDate() + 14);

  const borrowInput = document.getElementById('reqBorrowDate');
  const dueInput = document.getElementById('reqDueDate');
  if (borrowInput) borrowInput.value = today.toISOString().split('T')[0];
  if (dueInput) dueInput.value = dueDate.toISOString().split('T')[0];
}

// === Submit Request ===

async function handleRequestSubmit(event) {
  event.preventDefault();

  const borrowDate = document.getElementById('reqBorrowDate').value;
  const dueDate = document.getElementById('reqDueDate').value;
  const notes = document.getElementById('reqNotes').value.trim();

  const checkboxes = document.querySelectorAll('input[name="req_book_ids"]:checked');
  const bookIds = Array.from(checkboxes).map(cb => parseInt(cb.value, 10));

  if (bookIds.length === 0) {
    showToast('Please select at least one book to borrow', 'error');
    return;
  }

  const result = await apiPost('/borrowings/request', {
    book_ids: bookIds,
    borrow_date: borrowDate,
    due_date: dueDate,
    notes: notes || null
  });

  if (result.success) {
    showToast(result.message || 'Request submitted successfully!', 'success');
    closeModal('requestBorrowModal');
    document.getElementById('requestBorrowForm').reset();
    setDefaultRequestDates();
    await loadMyLoans();
  } else {
    showToast(result.message || 'Failed to submit request', 'error');
  }
}

// === View Detail ===

function viewMyLoanDetail(id) {
  const loan = allMyLoans.find(item => item.id === id);
  if (!loan) return;

  const content = document.getElementById('myLoanDetailContent');
  content.innerHTML = `
    <div class="space-y-4">
      <div class="grid grid-cols-3 gap-3 bg-zinc-50 p-3 rounded-lg border border-zinc-200/70">
        <div>
          <span class="text-[11px] text-zinc-400 block font-medium">Borrow Date</span>
          <span class="font-medium text-zinc-800">${formatDate(loan.borrow_date)}</span>
        </div>
        <div>
          <span class="text-[11px] text-zinc-400 block font-medium">Due Date</span>
          <span class="font-medium text-zinc-800">${formatDate(loan.due_date)}</span>
        </div>
        <div>
          <span class="text-[11px] text-zinc-400 block font-medium">Status</span>
          <span class="mt-0.5 inline-block">${getStatusBadge(loan.status)}</span>
        </div>
      </div>

      ${loan.notes ? `
        <div class="p-3 rounded-lg bg-amber-50/50 border border-amber-200/60">
          <span class="text-[11px] font-semibold text-amber-800 block">Notes / Reason:</span>
          <p class="text-xs text-amber-900 mt-0.5">${loan.notes}</p>
        </div>
      ` : ''}

      <div>
        <h4 class="text-xs font-semibold text-zinc-800 mb-2">Book Items (${(loan.items || []).length})</h4>
        <div class="space-y-2 max-h-56 overflow-y-auto">
          ${(loan.items || []).map(b => `
            <div class="p-2.5 rounded-lg border border-zinc-200/80 bg-white flex items-center justify-between">
              <div>
                <p class="font-semibold text-zinc-900 text-xs">${b.title}</p>
                <p class="text-[11px] text-zinc-400">${b.author} · ISBN: ${b.isbn}</p>
              </div>
              <div>
                ${getStatusBadge(b.status)}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  openModal('myLoanDetailModal');
}
