# Foodpanda Clone - Refactored Component Structure

This document describes the refactored application structure designed for easy backend integration.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.js       # Navigation bar with login
│   ├── Footer.js       # Footer component
│   ├── Hero.js         # Hero section with search
│   ├── RestaurantCard.js # Individual restaurant card
│   └── LoginModal.js    # Login modal for partners
├── pages/              # Full page components
│   ├── HomePage.js              # Main home page with restaurants
│   ├── RestaurantPage.js        # Single restaurant menu
│   ├── CheckoutPage.js          # Shopping cart & checkout
│   ├── PartnerDashboard.js      # Restaurant partner analytics
│   ├── RestaurantPartnerPage.js # Partner registration
│   └── CustomerSignupPage.js    # Customer registration
├── services/           # API and business logic
│   └── api.js         # API client with backend endpoints
└── App.js             # Main app component with routing
```

## Component Breakdown

### Components (Reusable UI)

#### `Navbar.js`
- Displays header with branding, location, cart
- Manages login/logout and partner dashboard access
- Props: currentPage, cart, loggedInPartner, callbacks

#### `Footer.js`
- Static footer with company info and links
- No props needed

#### `Hero.js`
- Search banner at top of home page
- Props: onSearch callback

#### `RestaurantCard.js`
- Displays individual restaurant with image and info
- Props: restaurant data, onSelectRestaurant callback

#### `LoginModal.js`
- Modal for partner login
- Props: onClose, onLogin callbacks

### Pages

#### `HomePage.js`
- Displays all restaurants with filtering and sorting
- Manages filters, sort options, cuisines
- Props: restaurants array, setCurrentPage, callbacks

#### `RestaurantPage.js`
- Shows single restaurant's menu items
- Add to cart functionality
- Props: restaurant, callbacks

#### `CheckoutPage.js`
- Shopping cart review and checkout
- Manages quantity, delivery address
- Props: cart, callbacks

#### `PartnerDashboard.js`
- Analytics and metrics for restaurant partners
- Shows revenue, orders, popular items, reviews
- Props: loggedInPartner, analyticsData

#### `RestaurantPartnerPage.js`
- Restaurant registration form
- FAQs and benefits
- Props: setCurrentPage

#### `CustomerSignupPage.js`
- Customer registration form
- Success message with promo code
- Props: setCurrentPage

## Services

### `api.js`
API client for backend integration with endpoints for:
- `getRestaurants()` - Fetch all restaurants
- `getRestaurantById(id)` - Get single restaurant
- `partnerLogin()` - Partner authentication
- `customerSignup()` - Customer registration
- `createOrder()` - Place order
- `getPartnerAnalytics()` - Get dashboard data
- `registerPartner()` - Partner registration

Replace endpoints with your backend URL in `api.js`:
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
```

## State Management (in App.js)

```javascript
- currentPage          // Current page being displayed
- selectedRestaurant   // Selected restaurant object
- cart                // Array of items in cart
- location           // Delivery location
- loggedInPartner    // Logged-in partner info
- showLoginModal     // Login modal visibility
- restaurants        // All restaurants
```

## Key Functions

### Cart Management
```javascript
addToCart(item, restaurantId)        // Add item to cart or increase quantity
removeFromCart(itemId, removeAll)    // Decrease quantity or remove item
```

### Mock Data
Currently using mock data in:
- `mockRestaurants` - Restaurant and menu data
- `getAnalyticsData()` - Partner dashboard analytics
- Partner accounts for login

Replace these with API calls to your backend.

## Backend Integration Steps

1. **Update API endpoints** in `src/services/api.js`
   - Set `API_BASE_URL` to your backend
   - Implement actual API calls replacing mock data

2. **Replace mock data calls** in `App.js`
   - Uncomment API calls in `loadRestaurants()`
   - Use actual partner login in `LoginModal`
   - Fetch analytics from backend

3. **Add environment variables**
   - Create `.env` file with:
     ```
     REACT_APP_API_URL=http://localhost:5000/api
     ```

4. **Connect cart/order flow**
   - Implement order creation in `CheckoutPage`
   - Add payment processing
   - Update cart after successful order

## Communication Flow

```
App.js (State Container)
    ↓
    ├── Navbar → Navigation & auth
    ├── HomePage → Lists restaurants
    ├── RestaurantPage → Shows menu
    ├── CheckoutPage → Order review
    ├── PartnerDashboard → Analytics
    ├── LoginModal → Partner auth
    └── Footer → Static content
```

All components receive data and callbacks from App.js, making it easy to:
- Switch between pages
- Update cart
- Manage authentication
- Pass API data down the component tree

## Tips for Backend Integration

1. **Fetch data in useEffect** - Load restaurants when app mounts
2. **Error handling** - Add try/catch around API calls
3. **Loading states** - Show spinners while fetching data
4. **User feedback** - Show success/error messages
5. **Token management** - Store JWT in localStorage for authenticated requests
6. **Type safety** - Consider adding PropTypes or TypeScript

## Environment Setup

```bash
# Install dependencies
npm install

# Create .env file
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env

# Start development server
npm start
```

## Next Steps

1. Set up backend API server
2. Update API endpoints in `api.js`
3. Replace mock data with API calls
4. Add authentication (JWT tokens)
5. Implement payment gateway
6. Add error handling and loading states
7. Deploy to production
