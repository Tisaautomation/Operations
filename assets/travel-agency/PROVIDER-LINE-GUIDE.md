# Provider LINE Interface Guide

## How Providers Use the New System

This guide explains the provider experience with the new LINE action buttons.

---

## What Providers Receive

### LINE Message Format

```
🎫 NEW BOOKING REQUEST

Booking ID: BK1708234567890
Tour: Phi Phi Island Day Trip
Date: Saturday, June 15, 2024
Customer: John Smith
Guests: 4 people

📱 WhatsApp: +66812345678
📞 Phone: +66987654321

📍 Pickup Location:
Hilton Phuket Arcadia Resort & Spa
333 Patak Road, Karon, Phuket 83100

🗺️ View on Map: https://google.com/maps?q=7.8394,98.3016

💰 Amount: THB 5,000
⚠️ Payment: NOT PAID YET - Will be collected after confirmation

👇 PLEASE RESPOND:
```

**Then 3 action buttons appear:**

```
┌─────────────────────────────────────┐
│                                     │
│  [  ✅  CONFIRM  ]    (Green)      │
│                                     │
│  [  ❌  CANCEL (Fully Booked) ]    │
│       (Red)                         │
│                                     │
│  [  ⚠️  ALTERNATIVE LOCATION ]     │
│       (Yellow/Orange)               │
│                                     │
└─────────────────────────────────────┘
```

---

## Provider Actions Explained

### Action 1: ✅ CONFIRM (Green Button)

**When to use:**
- Tour is available for that date and time
- You can accommodate the number of guests
- Pickup location is accessible

**What happens:**

1. **Provider clicks** green CONFIRM button

2. **System asks** for pickup time:
```
✅ Great! Please provide pickup time range.

Example:
PICKUP TIME: 9:00 AM - 9:20 AM

Or
PICKUP TIME: 14:00 - 14:30
```

3. **Provider replies** with time range:
```
PICKUP TIME: 9:00 AM - 9:20 AM
```

4. **System automatically:**
   - Generates payment links (7 methods)
   - Sends confirmation email to customer
   - Sends WhatsApp message to customer
   - Updates booking status to "Confirmed"
   - Logs everything to Google Sheets

5. **Customer receives** email with:
   - Tour confirmation
   - Pickup time: 9:00 AM - 9:20 AM
   - Payment options (COT, Bank, QR, PayPal, Card, etc.)
   - Driver will contact on WhatsApp
   - Day-before voucher delivery
   - 30-min reminder confirmation

**Important Notes:**
- Give time RANGE for flexibility (e.g., 9:00-9:20)
- Use 12-hour (9:00 AM) or 24-hour (09:00) format
- System handles everything after you confirm
- Customer gets all payment options automatically

---

### Action 2: ❌ CANCEL (Red Button)

**When to use:**
- You're fully booked for that date
- Cannot accommodate the group size
- Tour not operating that day
- Any reason you cannot take the booking

**What happens:**

1. **Provider clicks** red CANCEL button

2. **System automatically:**
   - Routes booking to next priority provider (Provider 2)
   - Sends same booking request to Provider 2
   - Waits for Provider 2's response

3. **If Provider 2 also cancels:**
   - Routes to Provider 3
   - And so on...

4. **If ALL providers cancel:**
   - Customer receives rejection email with:
     - Apology for unavailability
     - Alternative dates for same tour
     - Alternative similar tours
     - Special discount code
     - Contact information for assistance

**Important Notes:**
- Don't worry about customer - system handles communication
- Next provider gets notified automatically
- Booking is handled by available provider
- If all booked, customer offered alternatives

---

### Action 3: ⚠️ ALTERNATIVE LOCATION (Yellow Button)

**When to use:**
- Original pickup location has difficult access
- Road too narrow for tour vehicle
- Heavy traffic area
- Parking restrictions
- Better pickup point nearby

**What happens:**

1. **Provider clicks** yellow ALTERNATIVE LOCATION button

2. **System asks** for new location:
```
⚠️ ALTERNATIVE LOCATION REQUEST

Booking: BK1708234567890
Customer Location: Hilton Hotel, Sukhumvit
🗺️ https://google.com/maps?q=13.7563,100.5018

Please provide alternative pickup location that is accessible.

Send location details like this:
ALT LOCATION: Central Hotel Lobby, Main Entrance
ALT MAP: [Google Maps Link]

Or share your location pin directly in LINE.
```

3. **Provider sends** alternative location:

**Option A - Text format:**
```
ALT LOCATION: Starbucks Coffee, Sukhumvit Soi 11
Near 7-Eleven, easier vehicle access
```

**Option B - Share location pin:**
- Click location button in LINE
- Select alternative pickup point
- Send location

4. **System automatically:**
   - Updates booking with new location
   - Sends email to customer explaining:
     - Why location changed (access issues)
     - New pickup location with map
     - How to get there
     - Distance from original location
   - Then continues to ask for pickup time
   - Then sends payment links

5. **Customer receives** location change email:
```
Subject: ⚠️ Pickup Location Update

Dear John,

Your original location (Hilton Hotel) has difficult
vehicle access.

NEW PICKUP LOCATION:
Starbucks Coffee, Sukhumvit Soi 11
📍 [Google Maps Link]

Only 200 meters from your hotel - easy 2 min walk!

Why this location?
✓ Easy vehicle access
✓ Safe parking area
✓ Clear landmark
✓ Better for on-time departure

Tour details remain the same.
Driver will confirm via WhatsApp.
```

**Important Notes:**
- Only use when original location truly problematic
- Choose location close to original (walking distance)
- Choose easily recognizable landmark
- System explains everything to customer
- Customer appreciates smoother pickup

---

## Quick Response Guide

### Scenario 1: Standard Booking - Available

```
1. Receive LINE booking request
2. Check availability ✓
3. Click ✅ CONFIRM
4. Receive pickup time request
5. Reply: "PICKUP TIME: 9:00 AM - 9:20 AM"
6. Done! System handles rest.
```

**Time**: 30 seconds

---

### Scenario 2: Fully Booked

```
1. Receive LINE booking request
2. Check availability ✗ (fully booked)
3. Click ❌ CANCEL
4. Done! System routes to next provider.
```

**Time**: 10 seconds

---

### Scenario 3: Location Issue

```
1. Receive LINE booking request
2. Check location on map
3. Notice difficult access
4. Click ⚠️ ALTERNATIVE LOCATION
5. Send better location nearby
6. Receive pickup time request
7. Reply: "PICKUP TIME: 9:00 AM - 9:20 AM"
8. Done! Customer notified automatically.
```

**Time**: 2 minutes

---

## Comparison: Old vs New System

### OLD SYSTEM (Text-based)

**Provider Experience:**
```
[Receive message]
Provider: "Please confirm booking BK123"
You: "Confirmed, pickup 9am at hotel"
Provider: "Great, sending confirmation..."
[Multiple back-and-forth messages]
```

**Problems:**
- ❌ Requires typing
- ❌ Room for miscommunication
- ❌ Takes longer
- ❌ Manual follow-up needed

---

### NEW SYSTEM (Button-based)

**Provider Experience:**
```
[Receive message with buttons]
[Click CONFIRM button] ✅
[System asks pickup time]
You: "PICKUP TIME: 9:00 AM - 9:20 AM"
[Done - system handles everything]
```

**Benefits:**
- ✅ One-click response
- ✅ Clear, unambiguous
- ✅ Fast (seconds, not minutes)
- ✅ Fully automated follow-up
- ✅ Professional customer communication
- ✅ Payment links automatic
- ✅ No manual emails needed

---

## Location Map Benefits

### What You See

Every booking includes:
```
📍 Pickup Location:
Hilton Phuket Arcadia Resort
333 Patak Road, Karon

🗺️ View on Map: [Clickable Google Maps Link]
```

### Why This Helps

1. **Verify Location Before Confirming**
   - Click map link
   - See exact location
   - Check route access
   - Estimate travel time

2. **Identify Access Issues**
   - Narrow roads
   - One-way streets
   - Traffic zones
   - Parking restrictions

3. **Suggest Better Alternatives**
   - If location difficult
   - Click ALTERNATIVE LOCATION
   - Suggest nearby accessible point

4. **Plan Route Efficiently**
   - See all pickups on map
   - Optimize route
   - Reduce travel time

---

## Common Questions

### Q: What if I click wrong button?

**A:** Contact us immediately. We can update the booking status manually. Better to click carefully!

---

### Q: How long do I have to respond?

**A:** We recommend responding within 30 minutes. After that, booking may route to next provider for faster customer service.

---

### Q: Can I change pickup time after confirming?

**A:** Yes! Just message us or the customer directly on WhatsApp. System will update automatically.

---

### Q: What if customer location is wrong?

**A:** Click ALTERNATIVE LOCATION and suggest correct location. Or contact customer via WhatsApp to clarify.

---

### Q: Do I need to follow up with customer?

**A:** No! System automatically:
- Sends confirmation email with payment options
- Sends WhatsApp message
- Sends voucher day before
- Sends 30-min reminder
- You just need to provide pickup time!

---

### Q: What about payment?

**A:** **You don't handle payment collection!**

System automatically:
- Sends payment links to customer
- Customer chooses method (COT, Bank, Card, etc.)
- Payment tracked in system
- You just deliver the tour
- Finance team handles settlement

---

### Q: Can I call customer directly?

**A:** Yes! Phone and WhatsApp numbers provided in booking. Contact anytime needed. Driver will also contact 30 min before pickup on WhatsApp.

---

## Payment Information for Providers

### Customer Payment Methods

When you confirm booking, customer receives these options:

1. **Cash on Tour (COT)** - Pay you directly at start
2. **Thai Bank Transfer** - Transfer to company account
3. **QR Code (PromptPay)** - Scan and pay
4. **PayPal** - Online payment
5. **Credit Card (Stripe)** - Card payment
6. **Wise** - International transfer
7. **Revolut** - Digital payment

### What This Means for You

- **COT**: Customer pays you cash → You settle with company later
- **Other methods**: Customer pays company → Company settles with you

### Settlement

- Daily evening report shows:
  - Total revenue from your tours
  - Commission calculation
  - Net amount (who owes whom)
  - Payment due dates

---

## Tips for Success

### ✅ DO:

- Respond quickly (within 30 min)
- Give time ranges for flexibility (9:00-9:20)
- Check map before confirming
- Suggest alternatives when location difficult
- Contact customer on WhatsApp if needed
- Provide great service!

### ❌ DON'T:

- Delay responses (booking may go to competitor)
- Give exact time only (range is better)
- Confirm without checking map
- Ignore difficult location (use alternative feature)
- Forget customer's WhatsApp number
- Miss the 30-min reminder contact

---

## Success Metrics

With the new system:

- ⚡ **Response time**: 30 seconds (vs 5 minutes old system)
- 📈 **Booking conversion**: 95%+ (vs 70% old system)
- 😊 **Customer satisfaction**: Higher due to automation
- 💰 **More bookings**: Faster response = more customers
- ⏰ **Time saved**: 80% less manual work

---

## Support

**Need help with the LINE system?**

- 📞 Call: {{businessPhone}}
- 📧 Email: {{businessEmail}}
- 💬 LINE: Message main account

**Report Issues:**
- Button not working
- Wrong booking details
- System errors
- Suggestions for improvement

---

## Training Checklist

Before going live, practice:

- [ ] Click CONFIRM button
- [ ] Send pickup time in correct format
- [ ] Click CANCEL button
- [ ] Click ALTERNATIVE LOCATION button
- [ ] Send alternative location text
- [ ] Share location pin in LINE
- [ ] View customer location on map
- [ ] Contact customer on WhatsApp
- [ ] Review daily reports

---

**The new system makes your job easier and customers happier! 🚀**

**Any questions? Contact our support team anytime!**
