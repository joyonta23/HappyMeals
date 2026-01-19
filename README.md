# 🍔 HappyMeals - Food Ordering App

A full-stack MERN (MongoDB, Express, React, Node.js) food ordering platform inspired by Foodpanda, featuring customer authentication, restaurant browsing, order management, and partner dashboards with bilingual support (English & Bengali).

### Tools & Services

- **MongoDB Atlas** - Cloud database (free M0 tier)
- **Git & GitHub** - Version control
- **Nodemon** - Development auto-reload
- **dotenv** - Environment variables

## 📋 Project Structure & Features:

```
HappyMeal Food Ordering/
│
├── .github/                              # GitHub Actions & Templates
│   ├── workflows/
│   │   └── test.yml                      # CI/CD automated testing
│   └── TESTING_GUIDE.md                  # Testing documentation
│
├── Frontend/                             # React Client Application
│   ├── public/                           # Static assets served by React
│   │   ├── index.html                    # HTML template
│   │   ├── manifest.json                 # PWA manifest
│   │   └── robots.txt                    # SEO robots file
│   │
│   ├── src/
│   │   ├── components/                   # ✨ Reusable UI Components
│   │   │   ├── ChatbotAssistant.js       # AI combo recommendation chatbot
│   │   │   ├── ChatbotAssistant.css      # Chatbot styling
│   │   │   ├── ComboCard.js              # Combo suggestion card
│   │   │   ├── ComboCard.css             # Combo card styling
│   │   │   ├── Footer.js                 # Site footer component
│   │   │   ├── Hero.js                   # Homepage hero section
│   │   │   ├── LoginModal.js             # Login/signup modal
│   │   │   ├── Navbar.js                 # Navigation bar with cart
│   │   │   ├── PopularDishes.js          # Popular dishes section
│   │   │   └── RestaurantCard.js         # Restaurant card display
│   │   │
│   │   ├── pages/                        # 📄 Full Page Components
│   │   │   ├── CheckoutPage.js           # Order checkout & payment
│   │   │   ├── CustomerOrderTrackingPage.js  # Order status tracking
│   │   │   ├── CustomerProfilePage.js    # User profile & order history
│   │   │   ├── CustomerSignupPage.js     # Customer registration
│   │   │   ├── ForgotPasswordPage.js     # Password reset request
│   │   │   ├── HomePage.js               # Landing page
│   │   │   ├── HomePageWithChatbot.css   # Homepage styling
│   │   │   ├── HomePageWithChatbot.example.js  # Example implementation
│   │   │   ├── PartnerDashboard.js       # Partner order management
│   │   │   ├── PartnerSettingsPage.js    # Partner profile settings
│   │   │   ├── ResetPasswordPage.js      # Password reset with token
│   │   │   ├── RestaurantPage.js         # Restaurant menu display
│   │   │   ├── RestaurantPartnerPage.js  # Partner registration
│   │   │   └── ShopManagementPage.js     # Menu & offer management
│   │   │
│   │   ├── services/                     # 🔌 API Integration
│   │   │   └── api.js                    # Axios HTTP client & endpoints
│   │   │
│   │   ├── utils/                        # 🛠️ Utility Functions
│   │   │   └── translations.js           # i18n translation strings
│   │   │
│   │   ├── App.js                        # 🎯 Main application component
│   │   ├── index.js                      # React entry point
│   │   └── index.css                     # Global styles & Tailwind
│   │
│   ├── package.json                      # Frontend dependencies
│   ├── package-lock.json                 # Dependency lock file
│   ├── postcss.config.js                 # PostCSS configuration
│   ├── tailwind.config.js                # Tailwind CSS configuration
│   ├── README.md                         # Frontend documentation
│   └── REFACTORING_SUMMARY.md            # Code refactoring notes
│
├── Backend/                              # Express.js API Server
│   ├── src/
│   │   ├── config/                       # ⚙️ Configuration Files
│   │   │   ├── db.js                     # MongoDB connection setup
│   │   │   └── env.js                    # Environment variables loader
│   │   │
│   │   ├── controllers/                  # 🎮 Business Logic Layer
│   │   │   ├── analyticsController.js    # Popular dishes & metrics
│   │   │   ├── authController.js         # Authentication & authorization
│   │   │   ├── chatbotController.js      # AI combo generation
│   │   │   ├── orderController.js        # Order CRUD operations
│   │   │   ├── partnerController.js      # Partner management
│   │   │   └── restaurantController.js   # Restaurant & menu operations
│   │   │
│   │   ├── middleware/                   # 🛡️ Express Middleware
│   │   │   ├── auth.js                   # JWT token verification
│   │   │   └── error.js                  # Global error handler
│   │   │
│   │   ├── models/                       # 📊 Database Schemas (Mongoose)
│   │   │   ├── MenuItem.js               # Menu item schema
│   │   │   ├── Order.js                  # Order schema
│   │   │   ├── Partner.js                # Restaurant partner schema
│   │   │   ├── Restaurant.js             # Restaurant schema
│   │   │   ├── Review.js                 # Customer review schema
│   │   │   └── User.js                   # Customer user schema
│   │   │
│   │   ├── routes/                       # 🛣️ API Endpoint Definitions
│   │   │   ├── analytics.js              # GET /api/analytics/*
│   │   │   ├── auth.js                   # POST /api/auth/*
│   │   │   ├── chatbot.js                # POST /api/chatbot/*
│   │   │   ├── orders.js                 # CRUD /api/orders/*
│   │   │   ├── partners.js               # CRUD /api/partners/*
│   │   │   └── restaurants.js            # CRUD /api/restaurants/*
│   │   │
│   │   ├── scripts/                      # 🔧 Utility Scripts
│   │   │   ├── check-chatbot-fields.js   # Verify chatbot data
│   │   │   ├── check-menuitems.js        # Verify menu items
│   │   │   ├── check-offer.js            # Check active offers
│   │   │   ├── diagnose.js               # Database diagnostics
│   │   │   ├── seed.js                   # Seed sample data
│   │   │   ├── seed-chatbot-fields.js    # Seed chatbot data
│   │   │   ├── test-add-item.js          # Test item creation
│   │   │   ├── test-chatbot-helpers.js   # Test chatbot functions
│   │   │   └── verify-images.js          # Verify image uploads
│   │   │
│   │   ├── uploads/                      # 📁 Uploaded Files Storage
│   │   │   └── *.jpg, *.png, *.webp      # Restaurant & menu images
│   │   │
│   │   ├── utils/                        # 🛠️ Helper Functions
│   │   │   ├── chatbotHelper.js          # AI combo generation logic
│   │   │   ├── email.js                  # Email sending (nodemailer)
│   │   │   ├── hash.js                   # Password hashing (bcrypt)
│   │   │   └── tokens.js                 # JWT token management
│   │   │
│   │   ├── __tests__/                    # 🧪 Test Files (Jest)
│   │   │   └── api.test.js               # Sample API tests
│   │   │
│   │   └── server.js                     # 🚀 Express app entry point
│   │
│   ├── package.json                      # Backend dependencies
│   ├── package-lock.json                 # Dependency lock file
│   ├── nodemon.json                      # Nodemon configuration
│   ├── test-chatbot-direct.js            # Direct chatbot test
│   ├── .env                              # Environment variables (NOT in Git)
│   └── .env.example                      # Environment template
│
├── API_DOCUMENTATION.md                  # 📖 Complete API reference
├── SUSTAINABILITY_PLAN.md                # 📈 Scalability & maintenance plan
├── README.md                             # 📘 Project overview & setup
├── fix_authors.py                        # Git author fix script
├── test-upload.html                      # File upload test page
└── .gitignore                            # Git ignore rules
```

---

## 🏗️ Architecture Overview

### **Frontend Architecture (React SPA)**

```
MVC Pattern:

User Interface Layer
    ↓
Component Layer (Reusable UI)
    ↓
Page Layer (Full Pages)
    ↓
Service Layer (API Client)
    ↓
Backend API
```

**Key Features:**

- **State Management**: React Hooks (useState, useEffect)
- **Styling**: Tailwind CSS + Custom CSS
- **Routing**: Client-side with conditional rendering
- **HTTP Client**: Axios
- **UI Icons**: Lucide React

---

### **Backend Architecture (Express + MongoDB)**

```
HTTP Request
    ↓
Express Router (routes/)
    ↓
Middleware (auth, validation)
    ↓
Controller (business logic)
    ↓
Model (Mongoose schema)
    ↓
MongoDB Database
```

**Key Features:**

- **Authentication**: JWT (JSON Web Tokens)
- **Database**: MongoDB with Mongoose ODM
- **File Upload**: Multer middleware
- **Security**: Helmet, CORS, bcrypt
- **Email**: Nodemailer for notifications

---

## 🔄 Data Flow Examples

### **1. User Signup Flow**

```
Frontend (CustomerSignupPage.js)
    → POST /api/auth/customer-signup
        → authController.customerSignup()
            → User.create() [MongoDB]
            → Generate JWT token
        ← Return token + user data
    ← Store token in localStorage
```

### **2. Order Placement Flow**

```
Frontend (CheckoutPage.js)
    → POST /api/orders [with JWT token]
        → auth middleware (verify token)
        → orderController.createOrder()
            → Order.create() [MongoDB]
        ← Return orderId
    ← Show success message
```

### **3. AI Combo Generation Flow**

```
Frontend (ChatbotAssistant.js)
    → POST /api/chatbot/generate-combo
        → chatbotController.generateCombo()
            → chatbotHelper.generateCombos()
                → Query MenuItem collection
                → Apply AI matching logic
            ← Return combo suggestions
    ← Display combo cards
```

---

## 🗂️ File Naming Conventions

### **Frontend**

- **Components**: PascalCase (e.g., `RestaurantCard.js`)
- **Pages**: PascalCase with "Page" suffix (e.g., `CheckoutPage.js`)
- **Utilities**: camelCase (e.g., `translations.js`)
- **Styles**: camelCase with `.css` (e.g., `ChatbotAssistant.css`)

### **Backend**

- **Controllers**: camelCase + "Controller" (e.g., `authController.js`)
- **Models**: PascalCase (e.g., `User.js`, `MenuItem.js`)
- **Routes**: camelCase (e.g., `auth.js`, `restaurants.js`)
- **Utilities**: camelCase (e.g., `hash.js`, `tokens.js`)

---

## 📦 Key Dependencies

### **Frontend**

| Package                  | Purpose             |
| ------------------------ | ------------------- |
| `react`                  | UI library          |
| `react-router-dom`       | Client-side routing |
| `axios`                  | HTTP requests       |
| `tailwindcss`            | CSS framework       |
| `lucide-react`           | Icon library        |
| `@testing-library/react` | Component testing   |

### **Backend**

| Package        | Purpose               |
| -------------- | --------------------- |
| `express`      | Web framework         |
| `mongoose`     | MongoDB ODM           |
| `jsonwebtoken` | JWT authentication    |
| `bcryptjs`     | Password hashing      |
| `multer`       | File uploads          |
| `nodemailer`   | Email sending         |
| `helmet`       | Security headers      |
| `cors`         | Cross-origin requests |
| `morgan`       | HTTP logging          |
| `jest`         | Testing framework     |
| `supertest`    | API testing           |

---

## 🔐 Environment Variables

**Backend (.env)**

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/happymeal
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

**Frontend (Environment)**

```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 🚀 Running the Project

### **Development Mode**

**Backend:**

```bash
cd Backend
npm install
npm run dev          # Runs on http://localhost:5000
```

**Frontend:**

```bash
cd Frontend
npm install
npm start            # Runs on http://localhost:3000
```

### **Production Build**

**Frontend:**

```bash
cd Frontend
npm run build        # Creates optimized build in build/
```

**Backend:**

```bash
cd Backend
npm start            # Runs production server
```

---

## 🧪 Testing

### **Run Tests**

```bash
# Backend
cd Backend
npm test

# Frontend
cd Frontend
npm test
```

### **GitHub Actions CI/CD**

Automated testing runs on every push via `.github/workflows/test.yml`

---

## 📝 API Endpoints Summary

| Method | Endpoint                      | Description            |
| ------ | ----------------------------- | ---------------------- |
| GET    | `/health`                     | Health check           |
| POST   | `/api/auth/customer-signup`   | Customer registration  |
| POST   | `/api/auth/customer-login`    | Customer login         |
| POST   | `/api/auth/partner-login`     | Partner login          |
| GET    | `/api/restaurants`            | List all restaurants   |
| GET    | `/api/restaurants/:id`        | Get restaurant details |
| POST   | `/api/orders`                 | Create new order       |
| GET    | `/api/orders`                 | Get user's orders      |
| PUT    | `/api/orders/:id/status`      | Update order status    |
| POST   | `/api/partners/register`      | Register new partner   |
| POST   | `/api/partners/items`         | Add menu item          |
| PUT    | `/api/partners/items/:id`     | Update menu item       |
| POST   | `/api/chatbot/generate-combo` | Generate meal combos   |
| GET    | `/api/analytics/popular`      | Get popular dishes     |

---

## 🎯 Key Features by Component

### **Frontend Components**

**Navbar.js**

- User authentication status
- Cart display with item count
- Language toggle (EN/BN)
- Navigation to pages

**ChatbotAssistant.js**

- AI-powered combo suggestions
- Multi-step conversation flow
- Budget & preference input
- Combo cards with "Add to Cart"

**RestaurantCard.js**

- Restaurant image & details
- Rating display
- Delivery fee
- Click to view menu

**CheckoutPage.js**

- Cart item management
- Delivery/Pickup selection
- Payment method selection
- Order placement

### **Backend Controllers**

**authController.js**

- User/Partner signup & login
- JWT token generation
- Password reset via email
- Profile updates

**orderController.js**

- Create orders with items
- Fetch user order history
- Update order status
- Apply discounts & offers

**chatbotController.js**

- AI combo generation based on budget
- Filter by dietary preferences
- Restaurant-specific combos

**partnerController.js**

- Menu item CRUD operations
- Offer management
- Restaurant image upload
- Order management

---

## 🔧 Configuration Files

**Frontend:**

- `tailwind.config.js` - Tailwind CSS customization
- `postcss.config.js` - PostCSS plugins
- `package.json` - Dependencies & scripts

**Backend:**

- `nodemon.json` - Nodemon watch configuration
- `package.json` - Dependencies & scripts
- `.env` - Environment variables

**GitHub Actions:**

- `.github/workflows/test.yml` - CI/CD pipeline

## 🎨 Design Patterns Used

### **Frontend**

- **Component Composition**: Reusable UI components
- **Container/Presentational**: Pages vs Components
- **Hooks Pattern**: State management with React Hooks
- **Service Layer**: Centralized API calls

### **Backend**

- **MVC Pattern**: Model-View-Controller separation
- **Middleware Pattern**: Request/response pipeline
- **Repository Pattern**: Mongoose models
- **Dependency Injection**: Config through env.js

---

## 🔒 Security Features

✅ JWT authentication with expiration  
✅ Password hashing with bcrypt  
✅ CORS configuration  
✅ Helmet security headers  
✅ Input validation with express-validator  
✅ File upload restrictions (size, type)  
✅ Environment variable protection  
✅ Rate limiting ready

---

## 🚀 Future Enhancements

### **Suggested Structure Additions**

```
Frontend/src/
├── hooks/                    # Custom React hooks
│   ├── useAuth.js
│   └── useCart.js
├── context/                  # React Context API
│   └── AuthContext.js
└── constants/               # App constants
    └── routes.js

Backend/src/
├── validators/              # Request validators
│   ├── authValidator.js
│   └── orderValidator.js
├── services/                # Business logic services
│   ├── emailService.js
│   └── paymentService.js
└── helpers/                 # Helper functions
    └── dateHelper.js
```

---
