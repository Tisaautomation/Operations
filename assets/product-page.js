/**
 * Product Page JavaScript
 * TourInKohSamui.com - Optimized for Performance
 * Handles gallery, booking form, map loading, and interactions
 */

// ==========================================================================
// Product Gallery
// ==========================================================================

class ProductGallery {
  constructor(element) {
    this.element = element;
    this.mainImage = element.querySelector('.gallery-main-image img');
    this.thumbnails = element.querySelectorAll('.thumbnail');
    this.zoomBtn = element.querySelector('.btn-zoom');
    this.zoomModal = element.querySelector('.zoom-modal');
    this.zoomImage = element.querySelector('.zoom-image');
    this.zoomClose = element.querySelector('.zoom-close');

    this.init();
  }

  init() {
    // Thumbnail click
    this.thumbnails.forEach((thumb, index) => {
      thumb.addEventListener('click', () => this.switchImage(index));
    });

    // Zoom functionality
    if (this.zoomBtn && this.zoomModal) {
      this.zoomBtn.addEventListener('click', () => this.openZoom());
      this.zoomClose?.addEventListener('click', () => this.closeZoom());
      this.zoomModal.addEventListener('click', (e) => {
        if (e.target === this.zoomModal) this.closeZoom();
      });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!this.zoomModal || this.zoomModal.hidden) return;
      if (e.key === 'Escape') this.closeZoom();
    });
  }

  switchImage(index) {
    const thumb = this.thumbnails[index];
    const img = thumb.querySelector('img');

    // Update main image
    this.mainImage.src = img.src.replace('150x150', '800x800');
    this.mainImage.srcset = `
      ${img.src.replace('150x150', '400x400')} 400w,
      ${img.src.replace('150x150', '800x800')} 800w,
      ${img.src.replace('150x150', '1200x1200')} 1200w
    `;
    this.mainImage.dataset.zoomSrc = img.src.replace('150x150', '1200x1200');

    // Update active state
    this.thumbnails.forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');
  }

  openZoom() {
    if (!this.zoomModal || !this.mainImage) return;

    const zoomSrc = this.mainImage.dataset.zoomSrc || this.mainImage.src;
    this.zoomImage.src = zoomSrc;
    this.zoomImage.alt = this.mainImage.alt;
    this.zoomModal.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  closeZoom() {
    if (!this.zoomModal) return;

    this.zoomModal.hidden = true;
    document.body.style.overflow = '';
  }
}

// ==========================================================================
// Booking Form Validation
// ==========================================================================

class BookingForm {
  constructor(form) {
    this.form = form;
    this.dateInput = form.querySelector('[name="properties[Tour Date]"]');
    this.adultsInput = form.querySelector('[name="properties[Adults]"]');
    this.childrenInput = form.querySelector('[name="properties[Children]"]');
    this.whatsappInput = form.querySelector('[name="properties[WhatsApp]"]');
    this.locationInput = form.querySelector('[name="properties[Pickup Location]"]');

    this.init();
  }

  init() {
    // Set minimum date to tomorrow
    if (this.dateInput) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      this.dateInput.min = tomorrow.toISOString().split('T')[0];
    }

    // Format WhatsApp number
    if (this.whatsappInput) {
      this.whatsappInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/[^\d+\s-]/g, '');
        e.target.value = value;
      });
    }

    // Calculate total on quantity change
    if (this.adultsInput || this.childrenInput) {
      [this.adultsInput, this.childrenInput].forEach(input => {
        if (input) {
          input.addEventListener('change', () => this.updateTotal());
        }
      });
    }

    // Form submission
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  updateTotal() {
    // This can be extended to show live price calculation
    // For now, it just validates quantities
    const adults = parseInt(this.adultsInput?.value || 0);
    const children = parseInt(this.childrenInput?.value || 0);

    if (adults + children === 0) {
      this.adultsInput.setCustomValidity('At least one person required');
    } else {
      this.adultsInput.setCustomValidity('');
    }
  }

  handleSubmit(e) {
    // Additional validation before submission
    if (!this.locationInput?.value) {
      e.preventDefault();
      alert('Please select your pickup location on the map');
      return false;
    }

    if (!this.whatsappInput?.value) {
      e.preventDefault();
      alert('Please provide your WhatsApp number for driver coordination');
      return false;
    }

    // Show loading state
    const submitBtn = this.form.querySelector('[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Processing...</span>';
    }

    return true;
  }
}

// ==========================================================================
// Lazy Map Loading (Mapbox)
// ==========================================================================

class TourMap {
  constructor(element) {
    this.element = element;
    this.latitude = parseFloat(element.dataset.latitude);
    this.longitude = parseFloat(element.dataset.longitude);
    this.zoom = parseInt(element.dataset.zoom || 13);
    this.markerTitle = element.dataset.markerTitle;
    this.loadBtn = element.querySelector('.btn-load-map');
    this.map = null;

    this.init();
  }

  init() {
    if (this.loadBtn) {
      this.loadBtn.addEventListener('click', () => this.loadMap());
    }

    // Auto-load if in viewport on desktop
    if (window.innerWidth > 768) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.map) {
            this.loadMap();
            observer.disconnect();
          }
        });
      });
      observer.observe(this.element);
    }
  }

  async loadMap() {
    // Check if Mapbox is loaded
    if (!window.mapboxgl) {
      await this.loadMapbox();
    }

    // Remove placeholder
    const placeholder = this.element.querySelector('.map-placeholder');
    if (placeholder) {
      placeholder.remove();
    }

    // Initialize Mapbox map
    mapboxgl.accessToken = window.themeSettings?.mapboxToken || 'pk.YOUR_MAPBOX_TOKEN';

    this.map = new mapboxgl.Map({
      container: this.element,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [this.longitude, this.latitude],
      zoom: this.zoom
    });

    // Add marker
    new mapboxgl.Marker({
      color: '#00CED1'
    })
    .setLngLat([this.longitude, this.latitude])
    .setPopup(
      new mapboxgl.Popup({ offset: 25 })
        .setHTML(`<h4>${this.markerTitle}</h4>`)
    )
    .addTo(this.map);

    // Add navigation controls
    this.map.addControl(new mapboxgl.NavigationControl());
  }

  async loadMapbox() {
    return new Promise((resolve, reject) => {
      // Load CSS
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css';
      document.head.appendChild(link);

      // Load JS
      const script = document.createElement('script');
      script.src = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js';
      script.async = true;
      script.defer = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
}

// ==========================================================================
// Image Lazy Loading Observer
// ==========================================================================

class LazyLoader {
  constructor() {
    this.images = document.querySelectorAll('img[loading="lazy"]');
    this.init();
  }

  init() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.classList.add('loaded');
            imageObserver.unobserve(img);
          }
        });
      });

      this.images.forEach(img => imageObserver.observe(img));
    } else {
      // Fallback: load all images
      this.images.forEach(img => img.classList.add('loaded'));
    }
  }
}

// ==========================================================================
// Smooth Scroll for Anchor Links
// ==========================================================================

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// ==========================================================================
// Initialize All Components
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // Initialize product gallery
  const galleries = document.querySelectorAll('[data-component="product-gallery"]');
  galleries.forEach(gallery => new ProductGallery(gallery));

  // Initialize booking forms
  const bookingForms = document.querySelectorAll('[data-component="booking-form"] form');
  bookingForms.forEach(form => new BookingForm(form));

  // Initialize tour maps
  const tourMaps = document.querySelectorAll('[data-component="product-map"] .map-container');
  tourMaps.forEach(map => new TourMap(map));

  // Initialize lazy loading
  new LazyLoader();

  // Initialize smooth scroll
  initSmoothScroll();

  // Log performance metrics
  if (window.performance && window.performance.timing) {
    window.addEventListener('load', () => {
      const perfData = window.performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
      console.log(`Page Load Time: ${pageLoadTime}ms`);
    });
  }
});

// ==========================================================================
// Service Worker Registration (for PWA and caching)
// ==========================================================================

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Uncomment when service worker is ready
    // navigator.serviceWorker.register('/sw.js');
  });
}
