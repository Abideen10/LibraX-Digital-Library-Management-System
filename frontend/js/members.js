// ============================================
// Members Page JavaScript
// จัดการข้อมูลสมาชิก: CRUD, Search, Filter
// ============================================

let searchTimeout = null;

// === Initialize ===
document.addEventListener('DOMContentLoaded', loadMembers);

// === Load Data ===

async function loadMembers() {
  const search = document.getElementById('searchInput').value;
  const memberType = document.getElementById('typeFilter').value;

  let endpoint = '/members?';
  if (search) endpoint += `search=${encodeURIComponent(search)}&`;
  if (memberType) endpoint += `member_type=${encodeURIComponent(memberType)}&`;

  const result = await apiGet(endpoint);

  if (result.success) {
    renderMembersTable(result.data);
  } else {
    showToast('Failed to load members', 'error');
  }
}

// === Render ===

function renderMembersTable(members) {
  const container = document.getElementById('membersTableContainer');

  if (members.length === 0) {
    container.innerHTML = '<div class="empty-state"><p class="text-lg mb-1">No members found</p><p class="text-sm">Try changing your search or filter criteria</p></div>';
    return;
  }

  container.innerHTML = `
    <table class="data-table">
      <thead>
        <tr>
          <th>Code</th>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Type</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${members.map(member => `
          <tr>
            <td class="font-mono text-sm text-slate-500">${member.member_code}</td>
            <td class="font-medium text-slate-700">${member.first_name} ${member.last_name}</td>
            <td class="text-sm text-slate-500">${member.email}</td>
            <td class="text-sm text-slate-500">${member.phone || '-'}</td>
            <td>${getMemberTypeBadge(member.member_type)}</td>
            <td>
              <div class="flex gap-1">
                <button class="btn btn-secondary btn-sm" onclick="viewMemberBorrowings(${member.id}, '${member.first_name} ${member.last_name}')" title="View Borrowings">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </button>
                <button class="btn btn-secondary btn-sm" onclick="openEditMemberModal(${member.id})" title="Edit">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteMember(${member.id})" title="Delete">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </button>
              </div>
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
  searchTimeout = setTimeout(loadMembers, 300);
}

// === Add Member ===

function openAddMemberModal() {
  document.getElementById('memberModalTitle').textContent = 'Add New Member';
  document.getElementById('memberSubmitBtn').textContent = 'Add Member';
  document.getElementById('memberId').value = '';
  document.getElementById('memberForm').reset();
  openModal('memberModal');
}

// === Edit Member ===

async function openEditMemberModal(memberId) {
  const result = await apiGet(`/members/${memberId}`);

  if (!result.success) {
    showToast('Failed to load member data', 'error');
    return;
  }

  const member = result.data;

  document.getElementById('memberModalTitle').textContent = 'Edit Member';
  document.getElementById('memberSubmitBtn').textContent = 'Save Changes';
  document.getElementById('memberId').value = member.id;
  document.getElementById('memberCode').value = member.member_code;
  document.getElementById('memberType').value = member.member_type;
  document.getElementById('memberFirstName').value = member.first_name;
  document.getElementById('memberLastName').value = member.last_name;
  document.getElementById('memberEmail').value = member.email;
  document.getElementById('memberPhone').value = member.phone || '';

  openModal('memberModal');
}

// === Submit Form ===

async function handleMemberSubmit(event) {
  event.preventDefault();

  const memberId = document.getElementById('memberId').value;
  const memberData = {
    member_code: document.getElementById('memberCode').value.trim(),
    member_type: document.getElementById('memberType').value,
    first_name: document.getElementById('memberFirstName').value.trim(),
    last_name: document.getElementById('memberLastName').value.trim(),
    email: document.getElementById('memberEmail').value.trim(),
    phone: document.getElementById('memberPhone').value.trim() || null
  };

  let result;

  if (memberId) {
    result = await apiPut(`/members/${memberId}`, memberData);
  } else {
    result = await apiPost('/members', memberData);
  }

  if (result.success) {
    showToast(result.message || 'Success', 'success');
    closeModal('memberModal');
    loadMembers();
  } else {
    showToast(result.message || 'An error occurred', 'error');
  }
}

// === Delete Member ===

async function deleteMember(memberId) {
  if (!confirmAction('Are you sure you want to delete this member?')) return;

  const result = await apiDelete(`/members/${memberId}`);

  if (result.success) {
    showToast('Member deleted successfully', 'success');
    loadMembers();
  } else {
    showToast(result.message || 'Failed to delete member', 'error');
  }
}

// === View Member Borrowings ===

async function viewMemberBorrowings(memberId, memberName) {
  document.getElementById('memberBorrowingsTitle').textContent = `Borrowing History - ${memberName}`;
  const content = document.getElementById('memberBorrowingsContent');
  content.innerHTML = '<div class="text-center py-8"><div class="spinner mx-auto"></div></div>';
  openModal('memberBorrowingsModal');

  const result = await apiGet(`/members/${memberId}/borrowings`);

  if (!result.success) {
    content.innerHTML = '<p class="text-center text-red-500">Failed to load borrowing history</p>';
    return;
  }

  if (result.data.length === 0) {
    content.innerHTML = '<div class="empty-state"><p>No borrowing history</p></div>';
    return;
  }

  content.innerHTML = `
    <table class="data-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Borrow Date</th>
          <th>Due Date</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${result.data.map(b => `
          <tr>
            <td class="font-medium">#${b.id}</td>
            <td>${formatDate(b.borrow_date)}</td>
            <td>${formatDate(b.due_date)}</td>
            <td>${getStatusBadge(b.status)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}
