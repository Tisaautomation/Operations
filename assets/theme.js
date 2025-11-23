/**
 * Global Theme JavaScript - TourInKohSamui.com
 * Core functionality for header, cart, notifications, etc.
 */

// ==========================================================================
// Theme Global Object
// ==========================================================================

window.theme = window.theme || {};

// ==========================================================================
// Notification System
// ==========================================================================

theme.showNotification = function(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      ${message}
    </div>
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
};

// ==========================================================================
// Cart Functionality
// ==========================================================================

theme.cart = {
  async addItem(variantId, quantity = 1, properties = {}) {
    try {
      const response = await fetch('/cart/add.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: variantId,
          quantity: quantity,
          properties: properties
        })
      });

      const data = await response.json();

      if (response.ok) {
        theme.showNotification('Added to cart!', 'success');
        theme.cart.updateCount();
        if (window.themeSettings.cartType === 'drawer') {
          theme.cart.openDrawer();
        }
        return data;
      } else {
        throw new Error(data.description || 'Failed to add to cart');
      }
    } catch (error) {
      theme.showNotification(error.message, 'error');
      throw error;
    }
  },

  async updateCount() {
    try {
      const response = await fetch('/cart.js');
      const cart = await response.json();
      const countElements = document.querySelectorAll('.cart-count');
      countElements.forEach(el => {
        el.textContent = cart.item_count;
      });
    } catch (error) {
      console.error('Failed to update cart count:', error);
    }
  },

  openDrawer() {
    const drawer = document.querySelector('.cart-drawer');
    const overlay = document.querySelector('.cart-overlay');
    if (drawer && overlay) {
      drawer.classList.add('active');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  },

  closeDrawer() {
    const drawer = document.querySelector('.cart-drawer');
    const overlay = document.querySelector('.cart-overlay');
    if (drawer && overlay) {
      drawer.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
};

// ==========================================================================
// Mobile Menu Toggle
// ==========================================================================

theme.mobileMenu = {
  init() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const menu = document.querySelector('.mobile-menu');

    if (toggle && menu) {
      toggle.addEventListener('click', () => {
        menu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
      });
    }
  }
};

// ==========================================================================
// Scroll to Top Button
// ==========================================================================

theme.scrollToTop = {
  init() {
    const button = document.createElement('button');
    button.className = 'scroll-to-top';
    button.innerHTML = '↑';
    button.setAttribute('aria-label', 'Scroll to top');
    button.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: linear-gradient(90deg, #00CED1, #9370DB);
      color: white;
      border: none;
      font-size: 24px;
      cursor: pointer;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s, transform 0.2s;
      z-index: 1000;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;

    document.body.appendChild(button);

    // Show/hide based on scroll position
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        button.style.opacity = '1';
        button.style.pointerEvents = 'all';
      } else {
        button.style.opacity = '0';
        button.style.pointerEvents = 'none';
      }
    });

    // Scroll to top on click
    button.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    button.addEventListener('mouseenter', () => {
      button.style.transform = 'scale(1.1)';
    });

    button.addEventListener('mouseleave', () => {
      button.style.transform = 'scale(1)';
    });
  }
};

// ==========================================================================
// Search Functionality
// ==========================================================================

theme.search = {
  async predictiveSearch(query) {
    if (query.length < 3) return [];

    try {
      const response = await fetch(`/search/suggest.json?q=${encodeURIComponent(query)}&resources[type]=product&resources[limit]=5`);
      const data = await response.json();
      return data.resources.results.products || [];
    } catch (error) {
      console.error('Predictive search error:', error);
      return [];
    }
  }
};

// ==========================================================================
// Format Money
// ==========================================================================

theme.formatMoney = function(cents, format) {
  if (typeof cents === 'string') {
    cents = cents.replace('.', '');
  }

  let value = '';
  const placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
  const formatString = format || window.themeSettings.moneyFormat || '${{amount}}';

  function formatWithDelimiters(number, precision, thousands, decimal) {
    thousands = thousands || ',';
    decimal = decimal || '.';

    if (isNaN(number) || number === null) {
      return 0;
    }

    number = (number / 100.0).toFixed(precision);

    const parts = number.split('.');
    const dollarsAmount = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands);
    const centsAmount = parts[1] ? decimal + parts[1] : '';

    return dollarsAmount + centsAmount;
  }

  switch (formatString.match(placeholderRegex)[1]) {
    case 'amount':
      value = formatWithDelimiters(cents, 2);
      break;
    case 'amount_no_decimals':
      value = formatWithDelimiters(cents, 0);
      break;
    case 'amount_with_comma_separator':
      value = formatWithDelimiters(cents, 2, '.', ',');
      break;
    case 'amount_no_decimals_with_comma_separator':
      value = formatWithDelimiters(cents, 0, '.', ',');
      break;
    case 'amount_with_apostrophe_separator':
      value = formatWithDelimiters(cents, 2, "'");
      break;
  }

  return formatString.replace(placeholderRegex, value);
};

// ==========================================================================
// Initialize on DOM Ready
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  theme.mobileMenu.init();
  theme.scrollToTop.init();
  theme.cart.updateCount();

  // Close cart drawer on overlay click
  const overlay = document.querySelector('.cart-overlay');
  if (overlay) {
    overlay.addEventListener('click', () => theme.cart.closeDrawer());
  }

  // Add-to-cart form handling
  document.querySelectorAll('form[action="/cart/add"]').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const variantId = formData.get('id');
      const quantity = parseInt(formData.get('quantity') || 1);

      // Collect properties
      const properties = {};
      for (const [key, value] of formData.entries()) {
        if (key.startsWith('properties[')) {
          const propKey = key.replace('properties[', '').replace(']', '');
          properties[propKey] = value;
        }
      }

      try {
        await theme.cart.addItem(variantId, quantity, properties);
      } catch (error) {
        console.error('Add to cart error:', error);
      }
    });
  });

  console.log('TourInKohSamui theme initialized');
});

// ==========================================================================
// Performance Monitoring
// ==========================================================================

window.addEventListener('load', () => {
  if (window.performance && window.performance.timing) {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    const domReadyTime = perfData.domContentLoadedEventEnd - perfData.navigationStart;

    console.log(`DOM Ready: ${domReadyTime}ms`);
    console.log(`Page Load: ${pageLoadTime}ms`);

    // Report to analytics if available
    if (typeof gtag !== 'undefined') {
      gtag('event', 'timing_complete', {
        'name': 'page_load',
        'value': pageLoadTime
      });
    }
  }
});
