# Shopify Booking Form Setup Guide

## Overview

Your Shopify booking form needs to collect specific information to enable the complete automation workflow.

---

## Required Form Fields

### 1. Standard Shopify Fields

These are built-in Shopify fields:

- **Product**: Tour selection (dropdown or product page)
- **Quantity**: Number of people
- **Customer Email**: Collected at checkout
- **Customer Phone**: Optional in Shopify, but recommended

### 2. Custom Form Fields (Required)

Add these custom fields to your product page or checkout:

#### Field 1: Tour Date (REQUIRED)
```liquid
<label for="tour_date">Tour Date *</label>
<input type="date"
       name="properties[tour_date]"
       id="tour_date"
       required
       min="{{ 'now' | date: '%Y-%m-%d' }}">
```

#### Field 2: WhatsApp Number (REQUIRED)
```liquid
<label for="whatsapp_number">WhatsApp Number * (for driver contact)</label>
<input type="tel"
       name="properties[whatsapp_number]"
       id="whatsapp_number"
       required
       placeholder="+66812345678"
       pattern="\\+?[0-9]{10,15}">
<small>Driver will contact you on this number 30 minutes before pickup</small>
```

#### Field 3: Pickup Location with Map (REQUIRED)
```html
<!-- Add Google Maps Places Autocomplete -->
<label for="pickup_location">Pickup Location * (Click on map or search)</label>

<!-- Search box for location -->
<input type="text"
       id="location_search"
       placeholder="Search for your hotel or address..."
       style="width: 100%; padding: 10px; margin-bottom: 10px;">

<!-- Hidden fields for location data -->
<input type="hidden" name="properties[pickup_location]" id="pickup_location">
<input type="hidden" name="properties[pickup_lat]" id="pickup_lat">
<input type="hidden" name="properties[pickup_lng]" id="pickup_lng">
<input type="hidden" name="properties[pickup_map_url]" id="pickup_map_url">

<!-- Map display -->
<div id="map" style="width: 100%; height: 400px; margin-bottom: 10px; border: 2px solid #ddd; border-radius: 8px;"></div>

<!-- Display selected location -->
<div id="selected_location" style="padding: 10px; background: #e8f5e9; border-radius: 5px; display: none;">
    <strong>Selected Location:</strong>
    <p id="location_display" style="margin: 5px 0;"></p>
</div>

<script>
// Initialize Google Maps
let map;
let marker;
let autocomplete;

function initMap() {
    // Default center (Bangkok, Thailand - change to your area)
    const defaultCenter = { lat: 13.7563, lng: 100.5018 };

    // Create map
    map = new google.maps.Map(document.getElementById('map'), {
        center: defaultCenter,
        zoom: 13
    });

    // Create marker
    marker = new google.maps.Marker({
        map: map,
        draggable: true,
        animation: google.maps.Animation.DROP
    });

    // Initialize autocomplete
    autocomplete = new google.maps.places.Autocomplete(
        document.getElementById('location_search'),
        { types: ['establishment', 'geocode'] }
    );

    autocomplete.bindTo('bounds', map);

    // When location selected from search
    autocomplete.addListener('place_changed', function() {
        const place = autocomplete.getPlace();

        if (!place.geometry) {
            alert('No details available for: ' + place.name);
            return;
        }

        // Update map
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);
        }

        marker.setPosition(place.geometry.location);
        updateLocationFields(place);
    });

    // Click on map to set location
    map.addListener('click', function(event) {
        marker.setPosition(event.latLng);

        // Reverse geocode to get address
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: event.latLng }, function(results, status) {
            if (status === 'OK' && results[0]) {
                updateLocationFields(results[0]);
            }
        });
    });

    // Marker drag end
    marker.addListener('dragend', function(event) {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: event.latLng }, function(results, status) {
            if (status === 'OK' && results[0]) {
                updateLocationFields(results[0]);
            }
        });
    });
}

function updateLocationFields(place) {
    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    const address = place.formatted_address || place.name;

    // Update hidden fields
    document.getElementById('pickup_location').value = address;
    document.getElementById('pickup_lat').value = lat;
    document.getElementById('pickup_lng').value = lng;
    document.getElementById('pickup_map_url').value = `https://www.google.com/maps?q=${lat},${lng}`;

    // Update display
    document.getElementById('location_display').textContent = address;
    document.getElementById('selected_location').style.display = 'block';
}

// Load Google Maps API (add this to your theme.liquid)
</script>

<!-- Add to theme.liquid head section -->
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=places&callback=initMap" async defer></script>
```

#### Field 4: Special Requests (Optional)
```liquid
<label for="special_requests">Special Requests (Optional)</label>
<textarea name="properties[special_requests]"
          id="special_requests"
          placeholder="Any special requirements or notes..."
          rows="3"></textarea>
```

---

## Complete Shopify Product Template Example

Add this to your product template (`product.liquid` or `product-template.liquid`):

```liquid
<form action="/cart/add" method="post" class="tour-booking-form">

  <!-- Tour Selection (Product) -->
  <div class="form-group">
    <label>Tour: {{ product.title }}</label>
    <input type="hidden" name="id" value="{{ product.variants.first.id }}">
  </div>

  <!-- Number of People -->
  <div class="form-group">
    <label for="quantity">Number of People *</label>
    <select name="quantity" id="quantity" required>
      <option value="1">1 person</option>
      <option value="2">2 people</option>
      <option value="3">3 people</option>
      <option value="4">4 people</option>
      <option value="5">5 people</option>
      <option value="6">6 people</option>
      <option value="7">7 people</option>
      <option value="8">8 people</option>
      <option value="9">9 people</option>
      <option value="10">10 people</option>
    </select>
  </div>

  <!-- Tour Date -->
  <div class="form-group">
    <label for="tour_date">Tour Date *</label>
    <input type="date"
           name="properties[tour_date]"
           id="tour_date"
           required
           min="{{ 'now' | date: '%Y-%m-%d' }}">
  </div>

  <!-- WhatsApp Number -->
  <div class="form-group">
    <label for="whatsapp_number">WhatsApp Number *</label>
    <input type="tel"
           name="properties[whatsapp_number]"
           id="whatsapp_number"
           required
           placeholder="+66812345678">
    <small>Driver will contact you 30 minutes before pickup</small>
  </div>

  <!-- Pickup Location with Map -->
  <div class="form-group">
    <label for="location_search">Pickup Location * (Search or click on map)</label>
    <input type="text"
           id="location_search"
           placeholder="Search for your hotel or address...">

    <input type="hidden" name="properties[pickup_location]" id="pickup_location" required>
    <input type="hidden" name="properties[pickup_lat]" id="pickup_lat">
    <input type="hidden" name="properties[pickup_lng]" id="pickup_lng">
    <input type="hidden" name="properties[pickup_map_url]" id="pickup_map_url">

    <div id="map" style="width: 100%; height: 400px; margin: 10px 0; border-radius: 8px;"></div>

    <div id="selected_location" style="display: none; padding: 10px; background: #e8f5e9;">
      <strong>✓ Selected:</strong> <span id="location_display"></span>
    </div>
  </div>

  <!-- Special Requests -->
  <div class="form-group">
    <label for="special_requests">Special Requests (Optional)</label>
    <textarea name="properties[special_requests]"
              id="special_requests"
              placeholder="Any special requirements..."></textarea>
  </div>

  <!-- Add to Cart / Book Now -->
  <div class="form-group">
    <button type="submit" class="btn btn-primary btn-lg">
      Request Booking (No Payment Required)
    </button>
    <p style="margin-top: 10px; color: #666;">
      ✓ No payment now - Pay after confirmation<br>
      ✓ Instant confirmation (within minutes)<br>
      ✓ Multiple payment options available
    </p>
  </div>

</form>

<!-- Include map initialization script (see above) -->
```

---

## Checkout Page Customization

### Disable Payment Collection

Since customers don't pay at booking time, you need to:

1. **Go to**: Shopify Admin → Settings → Checkout
2. **Payment methods**:
   - Disable all payment gateways OR
   - Create a "Manual Payment" method
   - Set order status to "Payment Pending"

3. **Add custom checkout script** (if using Shopify Plus):

```javascript
// This ensures no payment is required at checkout
document.addEventListener('DOMContentLoaded', function() {
  // Hide payment methods for tour bookings
  const orderNote = document.querySelector('[name="note"]');
  if (orderNote && orderNote.value.includes('TOUR BOOKING')) {
    document.querySelector('.section--payment-method').style.display = 'none';
  }
});
```

### Alternative: Manual Payment Method

1. Settings → Payments → Manual payment methods
2. Add "Pay Later" payment method:
   - Name: "Pay After Confirmation"
   - Instructions: "You'll receive payment options after your booking is confirmed"
   - Payment instructions: "Multiple payment methods available: Cash, Bank Transfer, Card, etc."

---

## Google Maps API Setup

### Get API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. Enable APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
4. Create API credentials
5. Copy API key
6. Add to Shopify theme

### Add to Theme

In `theme.liquid`, before `</head>`:

```liquid
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places&callback=initMap" async defer></script>
```

---

## Styling the Form

Add this CSS to your theme:

```css
.tour-booking-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.tour-booking-form .form-group {
  margin-bottom: 20px;
}

.tour-booking-form label {
  display: block;
  font-weight: bold;
  margin-bottom: 8px;
  color: #333;
}

.tour-booking-form input[type="text"],
.tour-booking-form input[type="tel"],
.tour-booking-form input[type="date"],
.tour-booking-form select,
.tour-booking-form textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
}

.tour-booking-form small {
  display: block;
  margin-top: 5px;
  color: #666;
  font-size: 14px;
}

#map {
  border: 2px solid #ddd;
  border-radius: 8px;
}

#selected_location {
  padding: 12px;
  background: #e8f5e9;
  border-radius: 5px;
  margin-top: 10px;
  border-left: 4px solid #4caf50;
}
```

---

## Testing the Form

### Test Checklist

- [ ] Tour date selector works
- [ ] WhatsApp number validates correctly
- [ ] Map loads properly
- [ ] Can search for location
- [ ] Can click on map to select location
- [ ] Can drag marker
- [ ] Selected location displays correctly
- [ ] Hidden fields populate with coordinates
- [ ] Form submits successfully
- [ ] Order appears in Shopify admin
- [ ] Custom properties visible in order details
- [ ] N8N webhook receives all data

---

## Troubleshooting

### Map not loading
- Check Google Maps API key is valid
- Verify billing is enabled on Google Cloud
- Check API restrictions

### Location not saving
- Verify hidden input field names match exactly
- Check JavaScript console for errors
- Ensure `updateLocationFields()` function runs

### WhatsApp validation failing
- Adjust regex pattern if needed
- Allow international format: `+66812345678`
- Add country code dropdown if needed

---

## Next Steps

After form is working:

1. Create test booking
2. Verify data in Shopify admin
3. Check N8N receives correct data
4. Verify location coordinates captured
5. Test complete booking flow

---

**Form is ready! Customers can now book with location selection and WhatsApp contact.**
