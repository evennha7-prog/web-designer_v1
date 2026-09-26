// State Management (Cart & Wishlist)
const STORE_KEY_CART = 'xtra_cart_v1';
const STORE_KEY_WISHLIST = 'xtra_wishlist_v1';

let cart = JSON.parse(localStorage.getItem(STORE_KEY_CART) || '[]');
let wishlist = JSON.parse(localStorage.getItem(STORE_KEY_WISHLIST) || '[]');

// Save & Sync Functions
function saveCart() {
  localStorage.setItem(STORE_KEY_CART, JSON.stringify(cart));
  updateBadges();
  renderCartDrawer();
}

function saveWishlist() {
  localStorage.setItem(STORE_KEY_WISHLIST, JSON.stringify(wishlist));
  updateBadges();
}

// Badge Updates
function updateBadges() {
  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartBadgeEls = document.querySelectorAll('.cart-badge');
  cartBadgeEls.forEach(badge => {
    badge.textContent = totalCartCount;
  });

  const totalWishlistCount = wishlist.length;
  const wishBadgeEls = document.querySelectorAll('.wishlist-badge');
  wishBadgeEls.forEach(badge => {
    badge.textContent = totalWishlistCount;
  });
}

// Toast Notifications
function showToast(message, icon = '✓') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span style="color: #22c55e; font-weight: bold;">${icon}</span> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

// Cart Drawer Management
function initCartDrawer() {
  let drawer = document.querySelector('.cart-drawer');
  let backdrop = document.querySelector('.drawer-backdrop');

  if (!drawer) {
    drawer = document.createElement('div');
    drawer.className = 'cart-drawer';
    drawer.innerHTML = `
      <div class="drawer-header">
        <h3 class="drawer-title">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          Your Shopping Cart
        </h3>
        <button class="drawer-close" aria-label="Close Cart">&times;</button>
      </div>
      <div class="drawer-body" id="cart-drawer-items"></div>
      <div class="drawer-footer">
        <div class="cart-subtotal">
          <span>Subtotal</span>
          <span id="cart-drawer-total">$0.00</span>
        </div>
        <button class="btn btn-green" style="width: 100%; margin-bottom: 0.5rem;" onclick="checkoutCart()">Proceed to Checkout</button>
        <button class="btn btn-outline" style="width: 100%;" onclick="closeCartDrawer()">Continue Shopping</button>
      </div>
    `;

    backdrop = document.createElement('div');
    backdrop.className = 'drawer-backdrop';

    document.body.appendChild(backdrop);
    document.body.appendChild(drawer);

    backdrop.addEventListener('click', closeCartDrawer);
    drawer.querySelector('.drawer-close').addEventListener('click', closeCartDrawer);
  }

  // Bind to header cart buttons
  const cartButtons = document.querySelectorAll('.cart-btn');
  cartButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openCartDrawer();
    });
  });

  renderCartDrawer();
}

function openCartDrawer() {
  document.querySelector('.cart-drawer')?.classList.add('active');
  document.querySelector('.drawer-backdrop')?.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCartDrawer() {
  document.querySelector('.cart-drawer')?.classList.remove('active');
  document.querySelector('.drawer-backdrop')?.classList.remove('active');
  document.body.style.overflow = '';
}

function renderCartDrawer() {
  const container = document.getElementById('cart-drawer-items');
  const totalEl = document.getElementById('cart-drawer-total');
  if (!container || !totalEl) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="drawer-empty">
        <svg class="drawer-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="9" cy="21" r="1"/>
          <circle cx="20" cy="21" r="1"/>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
        </svg>
        <p style="font-size: 1.1rem; font-weight: 600; color: #1e293b; margin-bottom: 0.5rem;">Your cart is empty</p>
        <p style="font-size: 0.9rem;">Explore our curated collection of indoor greens and floral arrangements!</p>
      </div>
    `;
    totalEl.textContent = '$0.00';
    return;
  }

  let total = 0;
  container.innerHTML = cart.map(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    return `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">$${item.price}</div>
          <div class="cart-qty-ctrl">
            <button class="qty-btn" onclick="updateItemQty(${item.id}, -1)">-</button>
            <span class="qty-count">${item.quantity}</span>
            <button class="qty-btn" onclick="updateItemQty(${item.id}, 1)">+</button>
          </div>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart(${item.id})" title="Remove item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
        </button>
      </div>
    `;
  }).join('');

  totalEl.textContent = `$${total.toFixed(2)}`;
}

// Cart Actions
function addToCart(productId, quantity = 1) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity
    });
  }

  saveCart();
  showToast(`"${product.name}" added to cart!`);
  openCartDrawer();
}

function updateItemQty(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    removeFromCart(productId);
  } else {
    saveCart();
  }
}

function removeFromCart(productId) {
  cart = cart.filter(i => i.id !== productId);
  saveCart();
  showToast('Item removed from cart', '✕');
}

function checkoutCart() {
  if (cart.length === 0) return;
  alert('Thank you for ordering with Apsara Flower Shop! Your order has been placed successfully.');
  cart = [];
  saveCart();
  closeCartDrawer();
}

// Wishlist Actions
function toggleWishlist(productId) {
  const index = wishlist.indexOf(productId);
  const product = PRODUCTS.find(p => p.id === productId);
  
  if (index > -1) {
    wishlist.splice(index, 1);
    showToast(`Removed "${product?.name || 'Item'}" from wishlist`, '♡');
  } else {
    wishlist.push(productId);
    showToast(`Saved "${product?.name || 'Item'}" to wishlist`, '♥');
  }
  
  saveWishlist();

  // Update any visible heart buttons
  document.querySelectorAll(`.wish-btn-${productId}`).forEach(btn => {
    btn.classList.toggle('active', wishlist.includes(productId));
  });
}

// Quick View Modal
function initQuickViewModal() {
  let modal = document.querySelector('.modal-backdrop');
  if (!modal) {
    modal = document.createElement('div');
    modal.className = 'modal-backdrop';
    modal.id = 'quick-view-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <button class="modal-close" onclick="closeQuickView()">&times;</button>
        <div class="modal-img-col">
          <img src="" id="qv-img" class="modal-img" alt="Product Image">
        </div>
        <div class="modal-details">
          <div style="font-size: 0.85rem; color: #22c55e; font-weight: 700; text-transform: uppercase; margin-bottom: 0.5rem;" id="qv-cat">Category</div>
          <h2 style="font-size: 1.8rem; font-weight: 700; color: #062c27; margin-bottom: 0.5rem;" id="qv-title">Product Title</h2>
          <div style="display: flex; gap: 4px; color: #22c55e; margin-bottom: 1rem;">
            ★★★★★ <span style="color: #64748b; font-size: 0.85rem; margin-left: 6px;">(4.9 / 5 reviews)</span>
          </div>
          <div style="font-size: 1.6rem; font-weight: 800; color: #0f172a; margin-bottom: 1rem;" id="qv-price">$0</div>
          <p style="color: #475569; line-height: 1.6; margin-bottom: 1.5rem; font-size: 0.95rem;" id="qv-desc">Description</p>
          <div style="margin-bottom: 1.5rem; display: flex; align-items: center; gap: 1rem;">
            <span style="font-weight: 600; color: #1e293b;">Quantity:</span>
            <div style="display: flex; align-items: center; border: 1.5px solid #e2e8f0; border-radius: 6px; overflow: hidden;">
              <button style="padding: 6px 12px; background: #f8fafc; font-weight: bold;" onclick="changeQvQty(-1)">-</button>
              <input type="text" id="qv-qty-input" value="1" readonly style="width: 44px; text-align: center; border: none; font-weight: 700;">
              <button style="padding: 6px 12px; background: #f8fafc; font-weight: bold;" onclick="changeQvQty(1)">+</button>
            </div>
          </div>
          <div style="display: flex; gap: 1rem;">
            <button class="btn btn-primary" id="qv-add-btn" style="flex-grow: 1;">Add to Cart</button>
            <button class="btn btn-outline" id="qv-wish-btn" style="padding: 0.85rem;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeQuickView();
    });
  }
}

let currentQvProduct = null;

function openQuickView(productId) {
  const p = PRODUCTS.find(prod => prod.id === productId);
  if (!p) return;
  currentQvProduct = p;

  document.getElementById('qv-img').src = p.image;
  document.getElementById('qv-title').textContent = p.name;
  document.getElementById('qv-cat').textContent = p.category;
  document.getElementById('qv-price').innerHTML = p.onSale 
    ? `<span style="text-decoration: line-through; color: #94a3b8; font-size: 1.1rem; margin-right: 8px;">$${p.originalPrice}</span> $${p.price}` 
    : `$${p.price}`;
  document.getElementById('qv-desc').textContent = p.description;
  document.getElementById('qv-qty-input').value = 1;

  const addBtn = document.getElementById('qv-add-btn');
  addBtn.onclick = () => {
    const qty = parseInt(document.getElementById('qv-qty-input').value, 10) || 1;
    addToCart(p.id, qty);
    closeQuickView();
  };

  const wishBtn = document.getElementById('qv-wish-btn');
  wishBtn.onclick = () => {
    toggleWishlist(p.id);
  };

  document.getElementById('quick-view-modal')?.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function changeQvQty(delta) {
  const input = document.getElementById('qv-qty-input');
  if (!input) return;
  let val = parseInt(input.value, 10) || 1;
  val = Math.max(1, val + delta);
  input.value = val;
}

function closeQuickView() {
  document.getElementById('quick-view-modal')?.classList.remove('active');
  document.body.style.overflow = '';
}

// Generate Product Card HTML
function createProductCardHTML(p) {
  const isWish = wishlist.includes(p.id);
  const badgeHTML = p.onSale ? `
    <div class="badge-stack">
      <span class="badge-sale">Sale!</span>
      ${p.discount ? `<span class="badge-discount">${p.discount}</span>` : ''}
    </div>
  ` : '';

  const tickerHTML = p.hasTicker ? `
    <div class="sale-ticker">
      <div class="ticker-content">${p.tickerText} &nbsp;&bull;&nbsp; ${p.tickerText}</div>
    </div>
  ` : '';

  const priceHTML = p.onSale ? `
    <span class="price-original">$${p.originalPrice}</span>
    <span class="price-current">$${p.price}</span>
  ` : `
    <span class="price-current">$${p.price}</span>
  `;

  return `
    <div class="product-card" data-id="${p.id}" data-category="${p.category.toLowerCase()}">
      <div class="product-card-top">
        <div class="product-rating">★★★★★</div>
        ${badgeHTML}
        <img src="${p.image}" alt="${p.name}" class="product-img" loading="lazy">
        ${tickerHTML}
        
        <div class="card-overlay-actions">
          <button class="card-action-btn wish-btn-${p.id} ${isWish ? 'active' : ''}" onclick="toggleWishlist(${p.id})" title="Wishlist">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </button>
          <button class="card-action-btn" onclick="openQuickView(${p.id})" title="Quick View">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
          <button class="card-action-btn" onclick="addToCart(${p.id})" title="Add to Cart">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          </button>
        </div>
      </div>
      <div class="product-card-body">
        <h4 class="product-title" onclick="openQuickView(${p.id})" style="cursor: pointer;">${p.name}</h4>
        <div class="product-category">${p.category}</div>
        <div class="product-price-row">
          ${priceHTML}
        </div>
      </div>
    </div>
  `;
}

// Floating Scroll-to-Top Button
function initScrollToTop() {
  if (document.querySelector('.scroll-to-top-btn')) return;

  const btn = document.createElement('button');
  btn.className = 'scroll-to-top-btn';
  btn.setAttribute('aria-label', 'Scroll to top');
  btn.setAttribute('title', 'Scroll to top');
  btn.innerHTML = `
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 15l-6-6-6 6"/>
    </svg>
  `;

  document.body.appendChild(btn);

  let isTicking = false;
  window.addEventListener('scroll', () => {
    if (!isTicking) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > 260) {
          btn.classList.add('visible');
        } else {
          btn.classList.remove('visible');
        }
        isTicking = false;
      });
      isTicking = true;
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Header & Shared Mobile Setup
document.addEventListener('DOMContentLoaded', () => {
  initCartDrawer();
  initQuickViewModal();
  initScrollToTop();
  updateBadges();

  // Mobile menu toggle
  const mobileBtn = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (mobileBtn && navMenu) {
    mobileBtn.addEventListener('click', () => {
      navMenu.classList.toggle('mobile-active');
    });
  }

  // Wishlist header icon trigger
  const wishHeaderBtn = document.querySelector('.wishlist-btn');
  if (wishHeaderBtn) {
    wishHeaderBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (wishlist.length === 0) {
        showToast('Your wishlist is empty! Click the heart on any plant.', '♡');
      } else {
        showToast(`You have ${wishlist.length} item(s) saved in your wishlist!`, '♥');
      }
    });
  }
});
