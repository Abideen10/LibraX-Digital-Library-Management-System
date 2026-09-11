// ============================================
// History Page JavaScript
// แสดงประวัติการยืม-คืนหนังสือ
// ============================================

let searchTimeout = null;

// === Initialize ===
document.addEventListener('DOMContentLoaded', loadHistory);

// === Load History ===

async function loadHistory() {
  const search = document.getElementById('searchInput').value;
  const status = document.getElementById('statusFilter').value;

  let endpoint = '/borrowings?';
  if (search) endpoint += `search=${encodeURIComponent(search)}&`;
  if (status) endpoint += `status=${encodeURIComponent(status)}&`;

  const result = await apiGet(endpoint);

  if (result.success) {
    renderHistoryTable(result.data);
  } else {
    showToast('Failed to load history', 'error');
  }
}

// === Render ===

function renderHistoryTable(borrowings) {
  const container = document.getElementById('historyTableContainer');

  if (borrowings.length === 0) {
    container.innerHTML = '<div class="empty-state"><p class="text-lg mb-1">No borrowing records found</p><p class="text-sm">Try changing your search or filter criteria</p></div>';
    return;
  }

  container.innerHTML = `
    <table class="data-table">
      <thead>
        <tr>
          <th style="width: 75px;">ID</th>
          <th>Member</th>
          <th class="whitespace-nowrap" style="width: 120px;">Borrow Date</th>
          <th class="whitespace-nowrap" style="width: 120px;">Due Date</th>
          <th style="width: 120px;">Status</th>
          <th class="text-right" style="width: 100px;">Actions</th>
        </tr>
      </thead>
      <tbody>
        ${borrowings.map(b => `
          <tr>
            <td>
              <span class="px-2 py-0.5 rounded bg-slate-100/90 text-slate-600 font-mono text-[11px] font-semibold border border-slate-200/80">#${b.id}</span>
            </td>
            <td>
              <div class="flex items-center gap-2.5">
                ${getAvatarChip(`${b.first_name} ${b.last_name}`, b.member_code)}
                <div>
                  <div class="font-semibold text-xs text-slate-900">${b.first_name} ${b.last_name}</div>
                  <div class="text-[11px] font-mono text-slate-400 mt-0.5 flex items-center gap-1.5">
                    <span>${b.member_code}</span>
                    <span>·</span>
                    ${getMemberTypeBadge(b.member_type)}
                  </div>
                </div>
              </div>
            </td>
            <td class="text-xs text-zinc-600">${formatDate(b.borrow_date)}</td>
            <td class="text-xs text-zinc-600">${formatDate(b.due_date)}</td>
            <td>${getStatusBadge(b.status)}</td>
            <td>
              <button class="btn btn-secondary btn-sm" onclick="viewHistoryDetail(${b.id})" title="View Details">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                Details
              </button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

// === Search ===

function handleSearch() {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(loadHistory, 300);
}

// === View Detail ===

async function viewHistoryDetail(borrowingId) {
  const result = await apiGet(`/borrowings/${borrowingId}`);

  if (!result.success) {
    showToast('Failed to load borrowing details', 'error');
    return;
  }

  const b = result.data;
  const content = document.getElementById('historyDetailContent');

  content.innerHTML = `
    <div class="space-y-4">
      <!-- Borrowing ID & Status -->
      <div class="flex items-center justify-between">
        <h4 class="text-lg font-bold text-slate-800">Borrowing #${b.id}</h4>
        ${getStatusBadge(b.status)}
      </div>

      <!-- Member Info -->
      <div class="bg-slate-50 rounded-lg p-4">
        <p class="text-xs text-slate-400 font-medium mb-2">Member Information</p>
        <p class="font-medium text-slate-700">${b.first_name} ${b.last_name}</p>
        <p class="text-sm text-slate-500">${b.member_code} · ${b.email}</p>
        <p class="text-xs mt-1">${getMemberTypeBadge(b.member_type)}</p>
      </div>

      <!-- Dates -->
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-slate-50 rounded-lg p-4">
          <p class="text-xs text-slate-400 font-medium">Borrow Date</p>
          <p class="text-sm font-medium text-slate-700 mt-1">${formatDate(b.borrow_date)}</p>
        </div>
        <div class="bg-slate-50 rounded-lg p-4">
          <p class="text-xs text-slate-400 font-medium">Due Date</p>
          <p class="text-sm font-medium text-slate-700 mt-1">${formatDate(b.due_date)}</p>
        </div>
      </div>

      <!-- Books -->
      <div>
        <p class="text-xs text-slate-400 font-medium mb-2">Books (${b.items.length})</p>
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

  openModal('historyDetailModal');
}
