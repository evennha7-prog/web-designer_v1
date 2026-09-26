/**
 * =========================================================================
 * APSARA FLOWER SHOP - GLOBAL HEADER COMPONENT
 * =========================================================================
 * This is the SINGLE SOURCE OF TRUTH for your website header.
 * To change the logo, brand name, navigation links, or icons,
 * EDIT THIS FILE ONLY, and every page will update automatically!
 */

const HEADER_CONFIG = {
  // Brand Logo and Titles
  brand: {
    name: "APSARA",
    subtitle: "FLOWER SHOP",
    logoImage: "assets/images/apsara.png",
    homeLink: "home/home.html"
  },

  // Navigation Links (add, remove, or rename links here)
  navLinks: [
    { id: "home", label: "HOME", url: "home/home.html" },
    { id: "shop", label: "SHOP", url: "shop/shop.html" },
    { id: "category", label: "CATEGORY", url: "category/category.html" },
    { id: "faq", label: "FAQ", url: "faq/faq.html" },
    { id: "blog", label: "BLOG", url: "blog/blog.html" },
    { id: "about", label: "ABOUT", url: "about/about.html" },
    { id: "contact", label: "CONTACT", url: "contact/contact.html" }
  ]
};

/**
 * Calculates correct relative path prefix based on directory depth
 */
function getPathPrefix() {
  const path = window.location.pathname.replace(/\\/g, '/');
  // If inside subfolder (e.g. /home/, /shop/, /faq/), prefix is '../'
  if (path.includes('/home/') || path.includes('/shop/') || 
      path.includes('/category/') || path.includes('/faq/') || 
      path.includes('/blog/') || path.includes('/about/') || 
      path.includes('/contact/')) {
    return '../';
  }
  return './';
}

/**
 * Detects current active page
 */
function detectActivePage(container) {
  if (container && container.dataset.active) {
    return container.dataset.active.toLowerCase();
  }
  const path = window.location.pathname.toLowerCase().replace(/\\/g, '/');
  for (const link of HEADER_CONFIG.navLinks) {
    if (path.includes(`/${link.id}/`)) {
      return link.id;
    }
  }
  return 'home';
}

/**
 * Renders the Header HTML into the target container
 */
function renderHeader() {
  const container = document.getElementById('site-header');
  if (!container) return;

  const prefix = getPathPrefix();
  const activePage = detectActivePage(container);
  const brand = HEADER_CONFIG.brand;

  // Build Nav Links HTML
  const navHtml = HEADER_CONFIG.navLinks.map(link => {
    const isActive = (link.id === activePage) ? 'active' : '';
    const href = prefix + link.url;
    return `
      <li class="nav-item ${isActive}">
        <a href="${href}" class="nav-link" id="nav-${link.id}">${link.label}</a>
      </li>
    `;
  }).join('');

  const brandHref = prefix + brand.homeLink;
  const logoSrc = prefix + brand.logoImage;
  const searchHref = prefix + "shop/shop.html";
  const accountHref = prefix + "about/about.html";

  let cartCount = 0;
  let wishCount = 0;
  try {
    const rawCart = JSON.parse(localStorage.getItem('xtra_cart_v1') || '[]');
    cartCount = rawCart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const rawWish = JSON.parse(localStorage.getItem('xtra_wishlist_v1') || '[]');
    wishCount = rawWish.length;
  } catch (e) {}

  // Build full header markup
  container.className = 'site-header';
  // Build Mobile Nav List HTML (For phone/tablet drawer)
  const mobileNavHtml = HEADER_CONFIG.navLinks.map(link => {
    const isActive = (link.id === activePage) ? 'active' : '';
    const href = prefix + link.url;
    return `
      <li class="mobile-nav-item ${isActive}">
        <a href="${href}" class="mobile-nav-link" id="mobile-nav-${link.id}">
          <span>${link.label}</span>
          <svg class="mobile-nav-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
        </a>
      </li>
    `;
  }).join('');

  // Build full header markup + Mobile Drawer
  container.className = 'site-header';
  container.innerHTML = `
    <div class="container header-inner">
      <!-- Brand Logo -->
      <a href="${brandHref}" class="brand-logo" id="header-brand-logo">
        <div class="brand-icon">
          <img src="${logoSrc}" alt="${brand.name} Logo" class="brand-logo-img">
        </div>
        <div class="brand-text">
          <span class="brand-title">${brand.name}</span>
          <span class="brand-subtitle">${brand.subtitle}</span>
        </div>
      </a>

      <!-- Primary Desktop Navigation -->
      <nav aria-label="Main Navigation">
        <ul class="nav-menu">
          ${navHtml}
        </ul>
      </nav>

      <!-- Header Utilities -->
      <div class="header-actions">
        <!-- Search Trigger -->
        <a href="${searchHref}" class="action-btn" id="header-search-btn" title="Search plants">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </a>

        <!-- Cart Trigger -->
        <button class="action-btn cart-btn" id="header-cart-btn" title="View Cart">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          <span class="action-badge cart-badge">${cartCount}</span>
        </button>

        <!-- Wishlist Trigger -->
        <button class="action-btn wishlist-btn" id="header-wishlist-btn" title="Wishlist">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          <span class="action-badge wishlist-badge">${wishCount}</span>
        </button>

        <!-- Account Profile -->
        <a href="${accountHref}" class="action-btn" title="My Account">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </a>

        <!-- Mobile Menu Toggle Button (Click to open Drawer on mobile) -->
        <button class="action-btn mobile-toggle" id="mobile-menu-btn" aria-label="Open Navigation Drawer" title="Open Menu">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
      </div>
    </div>

    <!-- Mobile Navbar Drawer Backdrop -->
    <div class="mobile-drawer-backdrop" id="mobile-drawer-backdrop"></div>

    <!-- Mobile Navbar Drawer (Slide-out panel for phones) -->
    <aside class="mobile-nav-drawer" id="mobile-nav-drawer" aria-label="Mobile Navigation">
      <div class="mobile-drawer-header">
        <a href="${brandHref}" class="brand-logo">
          <div class="brand-icon">
            <img src="${logoSrc}" alt="${brand.name} Logo" class="brand-logo-img">
          </div>
          <div class="brand-text">
            <span class="brand-title">${brand.name}</span>
            <span class="brand-subtitle">${brand.subtitle}</span>
          </div>
        </a>
        <button class="mobile-drawer-close" id="mobile-drawer-close" aria-label="Close navigation">&times;</button>
      </div>

      <div class="mobile-drawer-body">
        <ul class="mobile-nav-list">
          ${mobileNavHtml}
        </ul>
      </div>

      <div class="mobile-drawer-footer">
        <div class="mobile-drawer-contact">
          <div class="mobile-drawer-contact-title">Direct Greenhouse Support</div>
          <a href="tel:+18004569872" class="mobile-drawer-phone">📞 +1 (800) 456-XTRA</a>
        </div>
        <div class="mobile-drawer-badge">
          🌿 100% Fresh Plants & Climate Packaging
        </div>
      </div>
    </aside>
  `;

  // Mobile Drawer Toggle Event Handling
  const mobileToggleBtn = container.querySelector('#mobile-menu-btn');
  const drawerBackdrop = container.querySelector('#mobile-drawer-backdrop');
  const navDrawer = container.querySelector('#mobile-nav-drawer');
  const drawerCloseBtn = container.querySelector('#mobile-drawer-close');

  function openMobileDrawer() {
    navDrawer?.classList.add('active');
    drawerBackdrop?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileDrawer() {
    navDrawer?.classList.remove('active');
    drawerBackdrop?.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (mobileToggleBtn) {
    mobileToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openMobileDrawer();
    });
  }

  if (drawerCloseBtn) {
    drawerCloseBtn.addEventListener('click', closeMobileDrawer);
  }

  if (drawerBackdrop) {
    drawerBackdrop.addEventListener('click', closeMobileDrawer);
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navDrawer?.classList.contains('active')) {
      closeMobileDrawer();
    }
  });

  // Close when clicking any link inside drawer
  const mobileLinks = container.querySelectorAll('.mobile-nav-link');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileDrawer();
    });
  });

  // Update badges immediately if shared.js functions exist
  if (typeof updateBadges === 'function') {
    updateBadges();
  }
}

// Auto-render header when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderHeader);
} else {
  renderHeader();
}
