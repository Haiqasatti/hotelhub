# 🏨 HotelHub — Hotel Booking & Management System

HotelHub is a full-stack MERN hotel booking and management system designed to provide a modern platform for hotel discovery, room booking, and administrative management.

## ✨ Features

### 👤 Authentication

* User registration
* User login
* JWT-based authentication
* Protected routes
* Role-based access control
* Admin authentication

### 🏨 Hotel Management

* Create hotels
* View hotels
* Update hotel information
* Delete hotels
* Hotel details page
* Hotel search and filtering

### 🛏️ Room Management

* Create rooms
* View rooms
* Update rooms
* Delete rooms
* Room pricing and capacity
* Rooms linked to hotels

### 🛎️ Amenity Management

* Create amenities
* View amenities
* Update amenities
* Delete amenities
* Assign amenities to hotels

### 📅 Booking Management

* Create bookings
* View personal bookings
* Cancel bookings
* Admin booking management
* Booking status management
* Double-booking prevention

### ⭐ Reviews

* Create reviews
* View reviews
* Update reviews
* Delete reviews
* Review ownership protection

### 👨‍💼 Admin Dashboard

* Manage hotels
* Manage rooms
* Manage amenities
* Manage bookings
* Manage reviews and hotel data

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* React Router
* Redux Toolkit
* Axios
* React Hot Toast
* Lucide React
* CSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcryptjs

## 📁 Project Structure

```text
hotel/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   ├── services/
│   │   └── App.jsx
│   └── package.json
│
└── README.md
```

> `.env` contains private configuration and is excluded from Git.

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd hotel
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Start the backend:

```bash
npm run dev
```

### 3. Frontend setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will run using the Vite development server.

## 🔐 Environment Variables

The backend requires:

| Variable     | Description                        |
| ------------ | ---------------------------------- |
| `PORT`       | Backend server port                |
| `MONGO_URI`  | MongoDB connection string          |
| `JWT_SECRET` | Secret used for JWT authentication |

Never commit the `.env` file to GitHub.

## 🔄 API Resources

The backend provides REST APIs for:

* Authentication
* Hotels
* Rooms
* Amenities
* Bookings
* Reviews

## 🎯 Project Requirements

This project was developed to demonstrate:

* Full-stack MERN development
* REST API development
* MongoDB database integration
* JWT authentication
* Protected routes
* Role-based authorization
* CRUD operations
* Frontend state management
* Responsive user interface
* Backend/frontend integration

## 🚀 Future Improvements

Planned improvements for future versions include:

* Online payment integration
* Email booking confirmations
* Advanced availability search
* Image upload functionality
* Favorites/wishlist
* Admin analytics
* Enhanced reviews and ratings
* Improved booking search and filtering

## 👩‍💻 Author

**Haiqa Satti**

BS Computer Science
Full-Stack MERN Developer

---

⭐ HotelHub is a learning and portfolio project demonstrating a complete MERN-based hotel booking and management workflow.
