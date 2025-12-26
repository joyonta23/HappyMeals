# Developer Guide - Component Reference

## Quick Component Overview

### Navbar Component
**File:** `src/components/Navbar.js`
**Purpose:** Top navigation bar with branding and user menu
**Props:**
```javascript
{
  currentPage,          // string
  setCurrentPage,       // function
  location,            // string
  cart,                // array
  loggedInPartner,     // object or null
  onLogout             // function
}
```
**Features:**
- Search bar
- Location display
- Cart icon with item count
- Login/logout buttons
- Language selector
- Partner dashboard link

---

### Hero Component
**File:** `src/components/Hero.js`
**Purpose:** Search banner at top of home page
**Props:**
```javascript
{
  onSearch  // function(searchQuery)
}
```
**Features:**
- Large headline
- Search input field
- Search button

---

### RestaurantCard Component
**File:** `src/components/RestaurantCard.js`
**Purpose:** Display individual restaurant in grid
**Props:**
```javascript
{
  restaurant: {
    id,           // number
    name,         // string
    cuisine,      // string
    rating,       // number
    deliveryTime, // string
    deliveryFee,  // number
    image         // string (URL)
  },
  onSelectRestaurant  // function
}
```
**Features:**
- Restaurant image
- Name and cuisine
- Star rating
- Delivery time
- Delivery fee

---

### LoginModal Component
**File:** `src/components/LoginModal.js`
**Purpose:** Modal for partner login
**Props:**
```javascript
{
  onClose,   // function
  onLogin    // function(partnerData)
}
```
**Features:**
- Customer/Partner login tabs
- Email/phone input
- Password input
- Demo credentials display
- Error messages

**Demo Credentials:**
```
Partner ID: PARTNER001 or PARTNER002
Password: demo123
```

---

### HomePage Component
**File:** `src/pages/HomePage.js`
**Purpose:** Main landing page with restaurants
**Props:**
```javascript
{
  restaurants,          // array
  setCurrentPage,       // function
  setSelectedRestaurant, // function
  onAddToCart,         // function
  cart                 // array
}
```
**Features:**
- Hero search section
- Tab navigation (Delivery, Pickup, Pandamart, Shops)
- Signup banner
- Cuisines carousel
- Filter sidebar (ratings, free delivery, deals)
- Sort options (relevance, fastest, top rated)
- Restaurant grid

---

### RestaurantPage Component
**File:** `src/pages/RestaurantPage.js`
**Purpose:** Display single restaurant menu
**Props:**
```javascript
{
  restaurant: {
    id,
    name,
    cuisine,
    rating,
    deliveryTime,
    deliveryFee,
    image,
    items: [{
      id,
      name,
      price,
      description,
      image
    }]
  },
  setCurrentPage,  // function
  onAddToCart      // function
}
```
**Features:**
- Restaurant header with details
- Menu items grid
- Add to cart buttons
- Back button

---

### CheckoutPage Component
**File:** `src/pages/CheckoutPage.js`
**Purpose:** Shopping cart and checkout
**Props:**
```javascript
{
  cart,                 // array of items
  selectedRestaurant,   // restaurant object
  setCurrentPage,       // function
  onRemoveFromCart,     // function
  onAddToCart           // function
}
```
**Features:**
- Cart item list with quantity controls
- Delivery address input
- Delivery instructions
- Order summary with total
- Proceed to payment button

---

### PartnerDashboard Component
**File:** `src/pages/PartnerDashboard.js`
**Purpose:** Restaurant partner analytics
**Props:**
```javascript
{
  loggedInPartner: {
    id,
    restaurantId,
    restaurantName,
    ownerName,
    email
  },
  analyticsData: {
    dailySales,      // array
    popularItems,    // array
    expenses,        // object
    wastage,         // array
    reviews,         // array
    totalRevenue,    // number
    totalOrders,     // number
    averageRating    // number
  }
}
```
**Features:**
- Revenue stats cards
- Daily sales chart
- Popular items list
- Revenue vs expenses breakdown
- Wastage tracker
- Customer reviews
- Timeframe selector (daily, weekly, monthly)

---

### RestaurantPartnerPage Component
**File:** `src/pages/RestaurantPartnerPage.js`
**Purpose:** Restaurant registration page
**Props:**
```javascript
{
  setCurrentPage  // function
}
```
**Features:**
- Registration form
- Opportunities section
- How it works steps
- Testimonials
- FAQ section

---

### CustomerSignupPage Component
**File:** `src/pages/CustomerSignupPage.js`
**Purpose:** Customer registration
**Props:**
```javascript
{
  setCurrentPage  // function
}
```
**Features:**
- Customer signup form
- Free delivery promo
- Success message with promo code

---

### Footer Component
**File:** `src/components/Footer.js`
**Purpose:** Footer with links
**Props:** None
**Features:**
- Company info
- Links (About, Careers, FAQ, Support)
- Social media links

---

## API Service Reference

**File:** `src/services/api.js`

### Available Methods

```javascript
// Get all restaurants
apiClient.getRestaurants(filters = {})

// Get single restaurant
apiClient.getRestaurantById(id)

// Partner login
apiClient.partnerLogin(partnerId, password)

// Customer signup
apiClient.customerSignup(userData)

// Create order
apiClient.createOrder(orderData)

// Get partner analytics
apiClient.getPartnerAnalytics(partnerId)

// Register partner
apiClient.registerPartner(formData)
```

---

## State Management in App.js

Main state variables:
```javascript
currentPage              // Current page being viewed
selectedRestaurant       // Restaurant details object
cart                     // Array of items in cart
location                 // Delivery location
loggedInPartner          // Partner login info
showLoginModal           // Login modal visibility
restaurants              // All restaurants
```

Key functions:
```javascript
addToCart(item, restaurantId)
removeFromCart(itemId, removeAll = false)
loadRestaurants()
```

---

## Passing Data Between Components

### Down the tree (Props):
```
App.js 
  → HomePage (restaurants, callbacks)
    → RestaurantCard (single restaurant, callback)
```

### Back up (Callbacks):
```
RestaurantCard 
  → (onSelectRestaurant callback)
    → HomePage 
      → App.js (setSelectedRestaurant)
```

---

## Common Patterns

### Adding a new page:

1. Create component in `src/pages/`
2. Import in `App.js`
3. Add case in page routing:
```javascript
{currentPage === 'new-page' && <NewPageComponent {...props} />}
```
4. Add navigation button that calls `setCurrentPage('new-page')`

### Connecting to backend:

1. Add endpoint to `api.js`
2. Import in component
3. Call in useEffect or event handler
4. Update state with response

---

## Best Practices

✅ Keep components small and focused
✅ Pass only needed props
✅ Use callbacks for parent updates
✅ Handle errors in API calls
✅ Show loading states
✅ Validate user inputs
✅ Comment complex logic
✅ Reuse components when possible
