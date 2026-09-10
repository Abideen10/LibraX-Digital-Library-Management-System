// ============================================
// Books Page JavaScript
// จัดการข้อมูลหนังสือ: CRUD, Search, Filter
// ============================================

let searchTimeout = null;

// === Initialize ===
document.addEventListener('DOMContentLoaded', () => {
  loadBooks();
  loadCategories();
});

// === Load Data ===

async function loadBooks() {
  const search = document.getElementById('searchInput').value;
  const category = document.getElementById('categoryFilter').value;

  let endpoint = '/books?';
  if (search) endpoint += `search=${encodeURIComponent(search)}&`;
  if (category) endpoint += `category=${encodeURIComponent(category)}&`;

  const result = await apiGet(endpoint);

  if (result.success) {
    renderBooksTable(result.data);
  } else {
    showToast('Failed to load books', 'error');
  }
}

async function loadCategories() {
  const result = await apiGet('/books/categories');
  if (result.success) {
    const select = document.getElementById('categoryFilter');
    result.data.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      select.appendChild(option);
    });
  }
}

// === Render ===

function renderBooksTable(books) {
  const container = document.getElementById('booksTableContainer');

  if (books.length === 0) {
    container.innerHTML = '<div class="empty-state"><p class="text-lg mb-1">No books found</p><p class="text-sm">Try changing your search or filter criteria</p></div>';
    return;
  }

  container.innerHTML = `
    <table class="data-table">
      <thead>
        <tr>
          <th>ISBN</th>
          <th>Title</th>
          <th>Author</th>
          <th>Category</th>
          <th>Qty</th>
          <th>Available</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${books.map(book => `
          <tr>
            <td class="text-xs font-mono text-slate-500">${book.isbn}</td>
            <td>
              <button class="text-left font-medium text-indigo-600 hover:text-indigo-800" onclick="viewBookDetail(${book.id})">
                ${book.title}
              </button>
            </td>
            <td class="text-slate-600">${book.author}</td>
            <td><span class="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">${book.category}</span></td>
            <td class="text-center">${book.quantity}</td>
            <td class="text-center">${book.available_quantity}</td>
            <td>${getStatusBadge(book.status)}</td>
            <td>
              <div class="flex gap-1">
                <button class="btn btn-secondary btn-sm" onclick="openEditBookModal(${book.id})" title="Edit">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteBook(${book.id})" title="Delete">
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
  // Debounce: รอ 300ms หลังพิมพ์เสร็จก่อนค้นหา
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(loadBooks, 300);
}

// === Book Detail ===

async function viewBookDetail(bookId) {
  const result = await apiGet(`/books/${bookId}`);

  if (!result.success) {
    showToast('Failed to load book details', 'error');
    return;
  }

  const book = result.data;
  const content = document.getElementById('bookDetailContent');

  content.innerHTML = `
    <div class="space-y-4">
      <div class="flex items-start justify-between">
        <div>
          <h4 class="text-xl font-bold text-slate-800">${book.title}</h4>
          <p class="text-slate-500 mt-1">by ${book.author}</p>
        </div>
        ${getStatusBadge(book.status)}
      </div>

      <div class="grid grid-cols-2 gap-4 bg-slate-50 rounded-lg p-4">
        <div>
          <p class="text-xs text-slate-400 font-medium">ISBN</p>
          <p class="text-sm font-mono text-slate-700">${book.isbn}</p>
        </div>
        <div>
          <p class="text-xs text-slate-400 font-medium">Category</p>
          <p class="text-sm text-slate-700">${book.category}</p>
        </div>
        <div>
          <p class="text-xs text-slate-400 font-medium">Publisher</p>
          <p class="text-sm text-slate-700">${book.publisher || '-'}</p>
        </div>
        <div>
          <p class="text-xs text-slate-400 font-medium">Published Year</p>
          <p class="text-sm text-slate-700">${book.published_year || '-'}</p>
        </div>
        <div>
          <p class="text-xs text-slate-400 font-medium">Total Quantity</p>
          <p class="text-sm text-slate-700">${book.quantity}</p>
        </div>
        <div>
          <p class="text-xs text-slate-400 font-medium">Available</p>
          <p class="text-sm text-slate-700">${book.available_quantity}</p>
        </div>
      </div>

      ${book.description ? `
        <div>
          <p class="text-xs text-slate-400 font-medium mb-1">Description</p>
          <p class="text-sm text-slate-600 leading-relaxed">${book.description}</p>
        </div>
      ` : ''}

      <div class="text-xs text-slate-400 pt-2 border-t border-slate-100">
        <p>Created: ${formatDate(book.created_at)}</p>
        <p>Updated: ${formatDate(book.updated_at)}</p>
      </div>
    </div>
  `;

  openModal('bookDetailModal');
}

// === Add Book ===

function openAddBookModal() {
  document.getElementById('bookModalTitle').textContent = 'Add New Book';
  document.getElementById('bookSubmitBtn').textContent = 'Add Book';
  document.getElementById('bookId').value = '';
  document.getElementById('bookForm').reset();
  document.getElementById('availableQtyField').classList.add('hidden');
  openModal('bookModal');
}

// === Edit Book ===

async function openEditBookModal(bookId) {
  const result = await apiGet(`/books/${bookId}`);

  if (!result.success) {
    showToast('Failed to load book data', 'error');
    return;
  }

  const book = result.data;

  document.getElementById('bookModalTitle').textContent = 'Edit Book';
  document.getElementById('bookSubmitBtn').textContent = 'Save Changes';
  document.getElementById('bookId').value = book.id;
  document.getElementById('bookIsbn').value = book.isbn;
  document.getElementById('bookTitle').value = book.title;
  document.getElementById('bookAuthor').value = book.author;
  document.getElementById('bookCategory').value = book.category;
  document.getElementById('bookPublisher').value = book.publisher || '';
  document.getElementById('bookYear').value = book.published_year || '';
  document.getElementById('bookQuantity').value = book.quantity;
  document.getElementById('bookAvailableQty').value = book.available_quantity;
  document.getElementById('bookDescription').value = book.description || '';

  // แสดง Available Quantity Field เมื่อ Edit
  document.getElementById('availableQtyField').classList.remove('hidden');

  openModal('bookModal');
}

// === Submit Form ===

async function handleBookSubmit(event) {
  event.preventDefault();

  const bookId = document.getElementById('bookId').value;
  const bookData = {
    isbn: document.getElementById('bookIsbn').value.trim(),
    title: document.getElementById('bookTitle').value.trim(),
    author: document.getElementById('bookAuthor').value.trim(),
    category: document.getElementById('bookCategory').value.trim(),
    publisher: document.getElementById('bookPublisher').value.trim() || null,
    published_year: document.getElementById('bookYear').value ? parseInt(document.getElementById('bookYear').value) : null,
    quantity: parseInt(document.getElementById('bookQuantity').value),
    description: document.getElementById('bookDescription').value.trim() || null
  };

  let result;

  if (bookId) {
    // Edit mode - รวม available_quantity
    bookData.available_quantity = parseInt(document.getElementById('bookAvailableQty').value);
    result = await apiPut(`/books/${bookId}`, bookData);
  } else {
    // Add mode
    result = await apiPost('/books', bookData);
  }

  if (result.success) {
    showToast(result.message || 'Success', 'success');
    closeModal('bookModal');
    loadBooks();
    loadCategories();
  } else {
    showToast(result.message || 'An error occurred', 'error');
  }
}

// === Delete Book ===

async function deleteBook(bookId) {
  if (!confirmAction('Are you sure you want to delete this book?')) return;

  const result = await apiDelete(`/books/${bookId}`);

  if (result.success) {
    showToast('Book deleted successfully', 'success');
    loadBooks();
  } else {
    showToast(result.message || 'Failed to delete book', 'error');
  }
}
