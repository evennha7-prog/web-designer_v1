// Shop Page Controller
document.addEventListener('DOMContentLoaded', () => {
  let activeCategory = 'all';
  let activeGridCols = 3;
  let activePerPage = 9;
  let activeSort = 'default';
  let currentPage = 1;

  const gridContainer = document.getElementById('shop-products-grid');
  const resultsCountText = document.getElementById('results-count-text');
  const catButtons = document.querySelectorAll('.cat-filter-card');
  const gridButtons = document.querySelectorAll('.grid-btn');
  const perPageSelect = document.getElementById('per-page-select');
  const sortSelect = document.getElementById('sort-select');
  const pagination = document.getElementById('shop-pagination');

  // Check URL params for category
  const urlParams = new URLSearchParams(window.location.search);
  const catParam = urlParams.get('category');
  if (catParam) {
    activeCategory = catParam.toLowerCase();
    catButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.cat === activeCategory);
    });
  }

  // Bind Category Buttons
  catButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      catButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.dataset.cat;
      currentPage = 1;
      renderProducts();
    });
  });

  // Bind Grid Switcher
  gridButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      gridButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeGridCols = parseInt(btn.dataset.cols, 10);
      gridContainer.className = `shop-products-grid grid-${activeGridCols}`;
    });
  });

  // Bind Per Page Select
  if (perPageSelect) {
    perPageSelect.addEventListener('change', () => {
      activePerPage = perPageSelect.value === 'all' ? 9999 : parseInt(perPageSelect.value, 10);
      currentPage = 1;
      renderProducts();
    });
  }

  // Bind Sort Select
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      activeSort = sortSelect.value;
      renderProducts();
    });
  }

  // Bind Pagination
  if (pagination) {
    pagination.addEventListener('click', (e) => {
      const target = e.target.closest('.page-btn');
      if (!target) return;
      const val = target.dataset.page;
      if (val === 'next') {
        currentPage++;
      } else {
        currentPage = parseInt(val, 10);
      }
      renderProducts();
      window.scrollTo({ top: 300, behavior: 'smooth' });
    });
  }

  // Main Render Function
  function renderProducts() {
    let list = [...PRODUCTS];

    // 1. Filter by category
    if (activeCategory !== 'all') {
      list = list.filter(p => p.category.toLowerCase() === activeCategory);
    }

    // 2. Sort
    if (activeSort === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (activeSort === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    } else if (activeSort === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (activeSort === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    const totalResults = list.length;
    const startIndex = (currentPage - 1) * activePerPage;
    const paginatedItems = list.slice(startIndex, startIndex + activePerPage);

    // Update Results count text
    const displayEnd = Math.min(startIndex + paginatedItems.length, totalResults);
    const displayStart = totalResults === 0 ? 0 : startIndex + 1;
    resultsCountText.textContent = `Showing ${displayStart}–${displayEnd} of ${totalResults} results`;

    // Render HTML
    if (paginatedItems.length === 0) {
      gridContainer.innerHTML = `
        <div class="shop-empty-state">
          <p style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem; color: #062c27;">No plants found</p>
          <p>Try selecting a different category or clearing your filters.</p>
        </div>
      `;
    } else {
      gridContainer.innerHTML = paginatedItems.map(p => createProductCardHTML(p)).join('');
    }

    // Update pagination buttons
    const totalPages = Math.ceil(totalResults / activePerPage);
    if (pagination) {
      if (totalPages <= 1) {
        pagination.style.display = 'none';
      } else {
        pagination.style.display = 'flex';
        let pageBtnsHtml = '';
        for (let i = 1; i <= totalPages; i++) {
          pageBtnsHtml += `<button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }
        if (currentPage < totalPages) {
          pageBtnsHtml += `<button class="page-btn" data-page="next">→</button>`;
        }
        pagination.innerHTML = pageBtnsHtml;
      }
    }
  }

  // Initial Render
  renderProducts();

  // Search Logic in Modal
  const searchInput = document.getElementById('shop-search-input');
  const searchResults = document.getElementById('search-results-list');
  if (searchInput && searchResults) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      if (!q) {
        searchResults.innerHTML = '';
        return;
      }
      const matches = PRODUCTS.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );

      if (matches.length === 0) {
        searchResults.innerHTML = `<p style="padding: 1rem; color: #64748b;">No matching plants found for "${q}".</p>`;
      } else {
        searchResults.innerHTML = matches.map(p => `
          <div style="display: flex; align-items: center; gap: 1rem; padding: 0.6rem; border-radius: 6px; cursor: pointer; hover: background: #f8faf9;"
               onclick="closeSearchModal(); openQuickView(${p.id});">
            <img src="${p.image}" style="width: 48px; height: 48px; border-radius: 4px; object-fit: cover;" alt="${p.name}">
            <div style="flex-grow: 1;">
              <div style="font-weight: 600; color: #062c27;">${p.name}</div>
              <div style="font-size: 0.8rem; color: #64748b;">${p.category} &bull; $${p.price}</div>
            </div>
            <span style="color: #22c55e; font-weight: 700;">View &rarr;</span>
          </div>
        `).join('');
      }
    });
  }
});

function openSearchModal() {
  document.getElementById('search-modal')?.classList.add('active');
  setTimeout(() => document.getElementById('shop-search-input')?.focus(), 100);
}

function closeSearchModal() {
  document.getElementById('search-modal')?.classList.remove('active');
}
