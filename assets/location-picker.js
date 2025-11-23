/**
 * Google Maps Location Picker
 * Allows users to select pickup location visually on a map
 * Saves coordinates and formatted address to booking form
 */

class LocationPicker {
  constructor(productId) {
    this.productId = productId;
    this.map = null;
    this.marker = null;
    this.selectedLocation = null;
    this.geocoder = null;
    this.searchBox = null;

    this.initEventListeners();
  }

  initEventListeners() {
    // Open modal button
    const openBtn = document.querySelector(`[data-opens="location-modal"][data-product-id="${this.productId}"]`);
    if (openBtn) {
      openBtn.addEventListener('click', () => this.openModal());
    }

    // Close modal buttons
    const modal = document.getElementById(`location-modal-${this.productId}`);
    if (modal) {
      const closeBtns = modal.querySelectorAll('[data-closes="location-modal"]');
      closeBtns.forEach(btn => {
        btn.addEventListener('click', () => this.closeModal());
      });

      // Close on overlay click
      const overlay = modal.querySelector('.modal-overlay');
      if (overlay) {
        overlay.addEventListener('click', () => this.closeModal());
      }
    }

    // Confirm location button
    const confirmBtn = document.getElementById(`confirm-location-${this.productId}`);
    if (confirmBtn) {
      confirmBtn.addEventListener('click', () => this.confirmLocation());
    }
  }

  async openModal() {
    const modal = document.getElementById(`location-modal-${this.productId}`);
    if (!modal) return;

    modal.hidden = false;
    document.body.style.overflow = 'hidden';

    // Initialize map if not already done
    if (!this.map) {
      await this.loadGoogleMaps();
      this.initMap();
    } else {
      // Trigger resize to fix any display issues
      google.maps.event.trigger(this.map, 'resize');
    }
  }

  closeModal() {
    const modal = document.getElementById(`location-modal-${this.productId}`);
    if (!modal) return;

    modal.hidden = true;
    document.body.style.overflow = '';
  }

  async loadGoogleMaps() {
    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      // NOTE: Replace YOUR_API_KEY with actual Google Maps API key in theme settings
      const apiKey = window.themeSettings?.googleMapsApiKey || 'YOUR_API_KEY';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  initMap() {
    // Default to Koh Samui center
    const kohSamui = { lat: 9.5304, lng: 100.0253 };

    const mapElement = document.getElementById(`location-map-${this.productId}`);
    if (!mapElement) return;

    this.map = new google.maps.Map(mapElement, {
      center: kohSamui,
      zoom: 12,
      mapTypeControl: false,
      fullscreenControl: true,
      streetViewControl: false,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'on' }]
        }
      ]
    });

    this.geocoder = new google.maps.Geocoder();

    // Initialize search box
    const searchInput = document.getElementById(`map-search-input-${this.productId}`);
    if (searchInput) {
      this.searchBox = new google.maps.places.SearchBox(searchInput);

      // Bias search results to map viewport
      this.map.addListener('bounds_changed', () => {
        this.searchBox.setBounds(this.map.getBounds());
      });

      // Listen for search results
      this.searchBox.addListener('places_changed', () => {
        const places = this.searchBox.getPlaces();
        if (places.length === 0) return;

        const place = places[0];
        if (!place.geometry || !place.geometry.location) return;

        this.setLocation(
          place.geometry.location.lat(),
          place.geometry.location.lng(),
          place.formatted_address
        );

        this.map.setCenter(place.geometry.location);
        this.map.setZoom(15);
      });
    }

    // Click to set marker
    this.map.addListener('click', (e) => {
      this.geocodeLocation(e.latLng.lat(), e.latLng.lng());
    });
  }

  setLocation(lat, lng, address) {
    // Remove existing marker
    if (this.marker) {
      this.marker.setMap(null);
    }

    // Add new marker
    this.marker = new google.maps.Marker({
      position: { lat, lng },
      map: this.map,
      draggable: true,
      animation: google.maps.Animation.DROP,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: '#00CED1',
        fillOpacity: 1,
        strokeColor: '#FFFFFF',
        strokeWeight: 3
      }
    });

    // Handle marker drag
    this.marker.addListener('dragend', (e) => {
      this.geocodeLocation(e.latLng.lat(), e.latLng.lng());
    });

    this.selectedLocation = { lat, lng, address };

    // Update display
    const addressDisplay = document.getElementById(`selected-address-${this.productId}`);
    if (addressDisplay) {
      addressDisplay.textContent = address;
    }

    // Enable confirm button
    const confirmBtn = document.getElementById(`confirm-location-${this.productId}`);
    if (confirmBtn) {
      confirmBtn.disabled = false;
    }
  }

  geocodeLocation(lat, lng) {
    if (!this.geocoder) return;

    this.geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results[0]) {
        this.setLocation(lat, lng, results[0].formatted_address);
      } else {
        this.setLocation(lat, lng, `${lat.toFixed(6)}, ${lng.toFixed(6)}`);
      }
    });
  }

  confirmLocation() {
    if (!this.selectedLocation) {
      alert('Please select a location on the map');
      return;
    }

    // Set form fields
    const displayInput = document.getElementById(`pickup-location-display-${this.productId}`);
    const latInput = document.getElementById(`pickup-latitude-${this.productId}`);
    const lngInput = document.getElementById(`pickup-longitude-${this.productId}`);

    if (displayInput) displayInput.value = this.selectedLocation.address;
    if (latInput) latInput.value = this.selectedLocation.lat;
    if (lngInput) lngInput.value = this.selectedLocation.lng;

    this.closeModal();
  }
}

// Auto-initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  const bookingForms = document.querySelectorAll('[data-component="booking-form"]');
  bookingForms.forEach(form => {
    const productForm = form.querySelector('[id^="product-form-"]');
    if (productForm) {
      const productId = productForm.id.replace('product-form-', '');
      new LocationPicker(productId);
    }
  });
});
