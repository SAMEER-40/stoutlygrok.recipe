# Recipe Management System - MERN Stack

A full-stack recipe discovery platform with personalized recommendations, user authentication, and smart filtering.

## 🎨 Features

- **User Authentication** - Secure JWT-based auth with bcrypt password hashing
- **Personalized Recommendations** - Recipes tailored to dietary preferences and allergies
- **Advanced Search** - Filter by cuisine, diet type, cook time, and ingredients
- **Favorites System** - Save recipes to MongoDB for cross-device access
- **Reviews & Ratings** - Community-driven recipe feedback
- **Responsive Design** - Editorial-style layout with asymmetric grid

## 🛠️ Tech Stack

**Frontend:**
- React + Vite
- React Router for SPA navigation
- Axios for API calls
- Context API for state management

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication
- bcryptjs for password hashing
- Spoonacular API integration

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB running locally or MongoDB Atlas account
- Spoonacular API key ([Get one here](https://spoonacular.com/food-api))

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/SAMEER-40/stoutly-gumptionless-corban.ngrok.recipe.git
cd recipe-app-mern
```

2. **Setup Backend**
```bash
cd server
npm install
```

Create `.env` file:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/recipe_app
JWT_SECRET=your_secret_key_here
SPOONACULAR_API_KEY=your_api_key_here
```

3. **Setup Frontend**
```bash
cd ../client
npm install
```

4. **Run the Application**

Terminal 1 - Backend:
```bash
cd server
npm run dev
```

Terminal 2 - Frontend:
```bash
cd client
npm run dev
```

App will be available at `http://localhost:5173`

## 📂 Project Structure

```
recipe-app-mern/
├── server/              # Backend API
│   ├── config/          # Database connection
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API endpoints
│   ├── middleware/      # JWT auth middleware
│   └── server.js        # Express app entry
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Route pages
│   │   ├── context/     # Auth context
│   │   └── services/    # API service layer
│   └── vite.config.js
└── README.md
```

## 🔐 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected API routes
- Input validation
- CORS configuration

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Recipes
- `GET /api/recipes` - Search recipes with filters
- `GET /api/recipes/:id` - Get recipe details

### Reviews
- `GET /api/reviews/:recipeId` - Get recipe reviews
- `POST /api/reviews` - Add review (auth required)

### Favorites
- `POST /api/auth/favorites` - Add to favorites
- `DELETE /api/auth/favorites/:id` - Remove from favorites

## 📝 License

MIT

## 👤 Author

SAMEER-40
