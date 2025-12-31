# 🍽️ Restaurant Reservation Management System

A full-stack Restaurant Reservation Management System built with React, Node.js, Express, MongoDB, and JWT authentication. This system supports both customer and admin roles with role-based access control, allowing customers to make reservations and administrators to manage tables, reservations, and users.

## ✨ Features

### Customer Features
- **User Authentication**: Secure registration and login with JWT tokens
- **Make Reservations**: Create reservations with date, time slot, and number of guests
- **View Reservations**: View all your active and past reservations
- **Cancel Reservations**: Cancel your own reservations
- **Real-time Availability**: Automatic table assignment based on availability and capacity

### Admin Features
- **Admin Dashboard**: Comprehensive dashboard for managing the restaurant
- **Table Management**: Create, update, and delete restaurant tables with capacity settings
- **Reservation Management**: View all reservations, filter by status, and manage them
- **User Management**: View all registered users
- **Role-based Access Control**: Secure admin routes with role verification

## 🛠️ Technology Stack

### Frontend
- **React 19.2.0** - Modern UI library
- **Vite 7.2.4** - Fast build tool and dev server
- **React Router DOM 7.11.0** - Client-side routing
- **CSS3** - Styling

### Backend
- **Node.js** - JavaScript runtime
- **Express 4.18.2** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose 7.0.0** - MongoDB object modeling
- **JWT (jsonwebtoken 9.0.0)** - Authentication tokens
- **bcryptjs 2.4.3** - Password hashing
- **CORS 2.8.5** - Cross-origin resource sharing
- **dotenv 16.0.3** - Environment variable management

## 📁 Project Structure

```
VibeCoders_Restaurant_Reservation/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AuthForm.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── ReservationForm.jsx
│   │   │   └── ReservationsList.jsx
│   │   ├── api.js          # API client functions
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # Entry point
│   ├── package.json
│   └── Dockerfile
├── server/                 # Backend Express application
│   ├── config/
│   │   └── db.js          # Database connection
│   ├── middleware/
│   │   ├── auth.js        # JWT authentication middleware
│   │   └── role.js        # Role-based access control
│   ├── models/
│   │   ├── User.js        # User model
│   │   ├── Reservation.js # Reservation model
│   │   └── Table.js       # Table model
│   ├── routes/
│   │   ├── auth.routes.js      # Authentication routes
│   │   ├── reservation.routes.js # Reservation routes
│   │   └── admin.routes.js    # Admin routes
│   ├── app.js             # Express app configuration
│   ├── server.js          # Server entry point
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml     # Docker orchestration
├── LICENSE                # MIT License
└── README.md             # This file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v14 or higher)
- **MongoDB** (local installation or MongoDB Atlas account)
- **npm** or **yarn**
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   cd VibeCoders_Restaurant_Reservation_Full_Project/VibeCoders_Restaurant_Reservation
   ```

2. **Install Backend Dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Configure Environment Variables**

   Create a `.env` file in the `server` directory:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key_here_make_it_long_and_random
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```

   For MongoDB Atlas:
   - Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster
   - Get your connection string
   - Replace `<password>` with your database password

   Create a `.env` file in the `client` directory (optional for local development):
   ```env
   VITE_API_BASE=http://localhost:5000
   ```

### Running the Application

#### Option 1: Run Separately (Development)

**Terminal 1 - Start Backend:**
```bash
cd server
npm start
```
Backend will run on `http://localhost:5000`

**Terminal 2 - Start Frontend:**
```bash
cd client
npm run dev
```
Frontend will run on `http://localhost:5173`

#### Option 2: Docker Compose (Production-like)

```bash
# From the root directory
docker-compose up --build
```

This will start both services:
- Backend: `http://localhost:5000`
- Frontend: `http://localhost:3000`

#### Option 3: PowerShell Setup Script (Windows)

```powershell
.\setup.ps1
```

## 📖 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Reservations
- `GET /api/reservations` - Get all reservations (protected)
- `POST /api/reservations` - Create a new reservation (protected)
- `DELETE /api/reservations/:id` - Cancel a reservation (protected)

### Admin
- `GET /api/admin/dashboard` - Get admin dashboard data (admin only)
- `GET /api/admin/tables` - Get all tables (admin only)
- `POST /api/admin/tables` - Create a new table (admin only)
- `PUT /api/admin/tables/:id` - Update a table (admin only)
- `DELETE /api/admin/tables/:id` - Delete a table (admin only)
- `GET /api/admin/reservations` - Get all reservations (admin only)
- `GET /api/admin/users` - Get all users (admin only)

### Health Check
- `GET /api/health` - Server health check

## 🔐 Authentication & Authorization

- **JWT Tokens**: Used for authentication
- **Role-based Access**: Two roles - `customer` and `admin`
- **Protected Routes**: Most routes require authentication
- **Admin Routes**: Admin-only routes are protected with role middleware

## 🗄️ Database Models

### User
- `email` (unique, required)
- `password` (hashed, required)
- `role` (enum: 'customer', 'admin', default: 'customer')
- `createdAt`, `updatedAt` (timestamps)

### Table
- `tableNumber` (required, unique)
- `capacity` (required, min: 1, max: 50)
- `createdAt`, `updatedAt` (timestamps)

### Reservation
- `userId` (reference to User, required)
- `tableId` (reference to Table, required)
- `date` (YYYY-MM-DD format, required)
- `timeSlot` (HH:MM format, required)
- `guests` (number, min: 1, max: 50, required)
- `status` (enum: 'ACTIVE', 'CANCELLED', 'COMPLETED', default: 'ACTIVE')
- `createdAt`, `updatedAt` (timestamps)

## 🧪 Testing

To test the application:

1. **Create a Customer Account**: Register through the frontend
2. **Create an Admin Account**: 
   - Register normally, then manually update the role in MongoDB:
   ```javascript
   db.users.updateOne(
     { email: "admin@example.com" },
     { $set: { role: "admin" } }
   )
   ```
3. **Create Tables**: Login as admin and create tables through the admin dashboard
4. **Make Reservations**: Login as customer and create reservations

## 🚢 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions to:
- **Render** (Backend)
- **Vercel/Netlify** (Frontend)
- **MongoDB Atlas** (Database)

## 📝 Available Scripts

### Backend (`server/`)
- `npm start` - Start the server

### Frontend (`client/`)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 👤 Author

**ramyakatkam98**

## 🙏 Acknowledgments

- React team for the amazing framework
- Express.js for the robust backend framework
- MongoDB for the flexible database solution
- All open-source contributors

## 📞 Support

For support, email your-email@example.com or open an issue in the repository.

---

**Made with ❤️ by VibeCoders**
