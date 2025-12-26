# 🍔 HappyMeals - Food Ordering App

A full-stack MERN (MongoDB, Express, React, Node.js) food ordering platform inspired by Foodpanda, featuring customer authentication, restaurant browsing, order management, and partner dashboards with bilingual support (English & Bengali).

## 🎯 Features

### Customer Features
- ✅ **User Authentication** - Signup/Login with JWT tokens
- ✅ **Customer Profile** - Manage personal info, addresses, payment methods
- ✅ **Restaurant Browsing** - Search and filter restaurants by cuisine, rating, delivery fee
- ✅ **Menu Viewing** - Browse food items with prices and descriptions
- ✅ **Shopping Cart** - Add/remove items, manage quantities
- ✅ **Order Checkout** - Place orders with delivery details
- ✅ **Bilingual Support** - English & বাংলা (Bengali)

### Partner/Restaurant Features
- 🏪 **Partner Login** - Secure login for restaurant owners
- 📊 **Dashboard** - Analytics, daily sales, order tracking
- 🎯 **Menu Management** - Add/edit menu items and pricing
- 📈 **Business Insights** - Revenue, popular items, customer reviews

### General Features
- 🌐 **Responsive Design** - Mobile-friendly UI with Tailwind CSS
- 🔐 **Security** - Password hashing, JWT authentication, protected routes
- 💾 **Database** - MongoDB Atlas integration with Mongoose ODM
- 🎨 **Modern UI** - Gradient backgrounds, animations, icons (Lucide React)

## 🛠️ Tech Stack

### Frontend
- **React 18.2** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **JavaScript (ES6+)** - Programming language

### Backend
- **Node.js** - Runtime environment
- **Express 4.18** - Web framework
- **MongoDB 7.6** - NoSQL database (Atlas)
- **Mongoose 7.6** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

### Tools & Services
- **MongoDB Atlas** - Cloud database (free M0 tier)
- **Git & GitHub** - Version control
- **Nodemon** - Development auto-reload
- **dotenv** - Environment variables

## 📋 Project Structure

```
HappyMeals/
├── Frontend/                    # React application
│   ├── public/                  # Static assets
│   ├── src/
│   │   ├── components/          # Reusable components
│   │   │   ├── Navbar.js
│   │   │   ├── Hero.js
│   │   │   ├── LoginModal.js
│   │   │   ├── Footer.js
│   │   │   └── RestaurantCard.js
│   │   ├── pages/               # Page components
│   │   │   ├── HomePage.js
│   │   │   ├── RestaurantPage.js
│   │   │   ├── CheckoutPage.js
│   │   │   ├── CustomerProfilePage.js
│   │   │   ├── CustomerSignupPage.js
│   │   │   ├── PartnerDashboard.js
│   │   │   └── RestaurantPartnerPage.js
│   │   ├── services/            # API client
│   │   │   └── api.js
│   │   ├── utils/               # Utilities
│   │   │   └── translations.js
│   │   ├── App.js               # Main app component
│   │   └── index.js             # Entry point
│   ├── package.json
│   └── tailwind.config.js
│
├── Backend/                     # Express API
│   ├── src/
│   │   ├── config/              # Configuration
│   │   │   ├── db.js
│   │   │   └── env.js
│   │   ├── controllers/         # Business logic
│   │   │   ├── authController.js
│   │   │   ├── restaurantController.js
│   │   │   ├── orderController.js
│   │   │   ├── analyticsController.js
│   │   │   └── partnerController.js
│   │   ├── models/              # Database schemas
│   │   │   ├── User.js
│   │   │   ├── Partner.js
│   │   │   ├── Restaurant.js
│   │   │   ├── MenuItem.js
│   │   │   └── Order.js
│   │   ├── routes/              # API endpoints
│   │   │   ├── auth.js
│   │   │   ├── restaurants.js
│   │   │   ├── orders.js
│   │   │   ├── analytics.js
│   │   │   └── partners.js
│   │   ├── middleware/          # Express middleware
│   │   │   ├── auth.js          # JWT verification
│   │   │   └── error.js         # Error handling
│   │   ├── utils/               # Utilities
│   │   │   ├── hash.js          # bcrypt helpers
│   │   │   └── tokens.js        # JWT helpers
│   │   ├── scripts/
│   │   │   └── seed.js          # Database seeding
│   │   └── server.js            # Express app setup
│   ├── package.json
│   ├── .env.example
│   └── .env                     # Actual env vars (not in repo)
│
├── .gitignore
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- MongoDB Atlas account (free tier available)
- Git

### Installation

#### 1. Clone the repository
```bash
git clone https://github.com/joyonta23/HappyMeals.git
cd HappyMeals
```

#### 2. Backend Setup

```bash
cd Backend

# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Update .env with your MongoDB Atlas URI
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/happymeal
# JWT_SECRET=your_secret_key
# CORS_ORIGIN=http://localhost:3000
# PORT=5000

# Start the backend server
npm run dev
```

Backend runs on `http://localhost:5000`

#### 3. Frontend Setup

```bash
cd Frontend

# Install dependencies
npm install

# Create .env.local file
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env.local

# Start the development server
npm start
```

Frontend runs on `http://localhost:3000`

## 🔑 Demo Credentials

### Customer Login
- **Email:** joyontobiswas2020@gmail.com
- **Password:** (Set during signup)

### Restaurant Partner Login
- **Partner ID:** PARTNER001 or PARTNER002
- **Password:** demo123

## 📡 API Endpoints

### Authentication
- `POST /api/auth/customer-signup` - Register new customer
- `POST /api/auth/customer-login` - Login customer
- `PUT /api/auth/customer-profile` - Update customer profile
- `POST /api/auth/partner-login` - Login restaurant partner

### Restaurants
- `GET /api/restaurants` - Get all restaurants
- `GET /api/restaurants/:id` - Get restaurant details

### Orders
- `POST /api/orders` - Create new order (requires auth)
- `GET /api/orders/:id` - Get order details

### Analytics
- `GET /api/analytics/:partnerId` - Get partner analytics (requires auth)

### Partners
- `POST /api/partners/register` - Register new restaurant partner

## 🌍 Internationalization

The app supports two languages:
- **English (EN)** - Default language
- **বাংলা (Bengali)** - Translated UI

Switch languages using the language selector in the navbar.

Translation strings are centralized in:
```
Frontend/src/utils/translations.js
```

## 🛡️ Security Features

- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **Password Hashing** - bcryptjs with salt rounds
- ✅ **CORS Protection** - Configured origin whitelist
- ✅ **Helmet** - HTTP security headers
- ✅ **Input Validation** - express-validator on routes
- ✅ **Protected Routes** - Auth middleware on sensitive endpoints
- ✅ **Environment Variables** - Sensitive data in .env (not committed)

## 📊 Database Schema

### Users Collection
```javascript
{
  name: String,
  email: String (unique),
  phone: String (unique),
  passwordHash: String,
  role: String (enum: customer, partner, admin),
  addresses: [{
    line1: String,
    line2: String,
    city: String,
    country: String
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Orders Collection
```javascript
{
  customerId: ObjectId,
  restaurantId: ObjectId,
  items: [{
    itemId: ObjectId,
    name: String,
    price: Number,
    quantity: Number
  }],
  totalAmount: Number,
  deliveryAddress: Object,
  status: String (enum: pending, confirmed, preparing, delivering, delivered),
  createdAt: Date
}
```

## 🔄 Development Workflow

### Making Changes
1. Create a new branch for features: `git checkout -b feature/your-feature`
2. Make your changes
3. Test thoroughly
4. Commit with clear messages: `git commit -m "Add feature: description"`
5. Push to GitHub: `git push origin feature/your-feature`
6. Open a Pull Request

### Running Tests
```bash
# Frontend
cd Frontend
npm test

# Backend
cd Backend
npm test
```

## 📝 Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/happymeal
JWT_SECRET=your_super_secret_key_change_this
CORS_ORIGIN=http://localhost:3000
PORT=5000
```

### Frontend (.env.local)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## 🐛 Troubleshooting

### Backend won't start
- Check MongoDB Atlas connection string
- Verify port 5000 is available
- Ensure .env file exists with correct variables

### Frontend won't connect to backend
- Verify backend is running on port 5000
- Check CORS_ORIGIN in backend .env
- Clear browser cache and restart dev server

### Database connection errors
- Verify MongoDB Atlas IP whitelist includes your IP
- Check username/password in connection string
- Ensure database user has proper permissions

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
# Build for production
cd Frontend
npm run build

# Deploy the build folder
```

### Backend (Heroku/Railway/Render)
```bash
# Set environment variables in hosting platform
# Push to Git and deploy
```

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [JWT Introduction](https://jwt.io/introduction)

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to your fork
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

**Joyonta Biswas**
- GitHub: [@joyonta23](https://github.com/joyonta23)
- Email: joyontobiswas2020@gmail.com

## 🙏 Acknowledgments

- Inspired by Foodpanda's user experience
- Built with modern web technologies
- Thanks to the open-source community

---

**Happy coding! 🎉**

For questions or support, please open an issue on GitHub.
