# Restaurant Reservation Management System

A full-stack web application for managing restaurant table reservations with role-based access control for customers and administrators.

## Technology Stack

- **Frontend:** React
- **Backend:** Node.js with Express
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens)

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the server directory:
```env
MONGO_URI=mongodb://127.0.0.1:27017/vibecoders
JWT_SECRET=your-secret-key-here
PORT=5000
```

4. Seed the database with tables (optional):
```bash
node seed/tables.seed.js
```

5. Create an admin user (optional):
```bash
node seed/admin.seed.js
```

6. Start the server:
```bash
npm start
# or
node server.js
```

The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the client directory (if needed):
```env
VITE_API_BASE=http://localhost:5000
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (or similar)

## Assumptions Made

1. **Single Restaurant:** The system is designed for a single restaurant with fixed tables.
2. **Table Assignment:** Uses a first-fit strategy - assigns the smallest available table that can accommodate the number of guests.
3. **Time Slots:** Time slots are stored as strings (HH:MM format) without timezone normalization.
4. **Reservation Status:** Reservations have three states: ACTIVE, CANCELLED, and COMPLETED.
5. **User Roles:** Two roles are supported - 'user' (customer) and 'admin' (administrator).
6. **No Overlapping Bookings:** A table cannot have multiple ACTIVE reservations for the same date and time slot.
7. **Capacity Validation:** Table capacity must be greater than or equal to the number of guests.

## Reservation and Availability Logic

### Table Assignment Algorithm

When a customer creates a reservation:

1. **Input Validation:**
   - Date, time slot, and number of guests are required
   - Number of guests must be between 1 and 20

2. **Availability Check:**
   - System finds all tables that are already booked (ACTIVE status) for the requested date and time slot
   - Excludes these booked tables from consideration

3. **Table Selection:**
   - Finds tables with `capacity >= number of guests`
   - Selects the smallest available table that fits (first-fit strategy)
   - This ensures efficient table utilization

4. **Conflict Prevention:**
   - If no table is available, returns HTTP 409 (Conflict) with an appropriate error message
   - Prevents double bookings by checking existing ACTIVE reservations

5. **Reservation Creation:**
   - Creates reservation with ACTIVE status
   - Links reservation to user and assigned table
   - Returns reservation details including assigned table information

### Example Flow:
```
Customer requests: 4 guests, 2025-12-31, 19:00
→ System checks: Tables 1 (capacity: 2), 2 (capacity: 4), 3 (capacity: 6)
→ Table 1 is booked at 19:00
→ Table 2 is available and fits (capacity 4 >= guests 4)
→ Assigns Table 2 to reservation
```

## Role-Based Access Control

### Customer (User) Role

**Authentication:**
- Can register new account via `/api/auth/register`
- Can login via `/api/auth/login`
- Receives JWT token upon successful authentication

**Reservations:**
- **Create:** `POST /api/reservations` - Create new reservation (requires authentication)
- **View Own:** `GET /api/reservations/my` - View only their own reservations
- **Cancel Own:** `DELETE /api/reservations/:id` - Cancel only their own reservations

**Restrictions:**
- Cannot view other users' reservations
- Cannot cancel reservations they don't own
- Cannot access admin endpoints

### Administrator (Admin) Role

**Authentication:**
- Can login via `/api/auth/login` (registration not available through UI)
- Admin accounts must be created via seed script or directly in database

**Reservations:**
- **View All:** `GET /api/admin/reservations` - View all reservations
- **View by Date:** `GET /api/admin/reservations?date=YYYY-MM-DD` - Filter by specific date
- **Update:** `PUT /api/admin/reservations/:id` - Update any reservation status
- **Cancel Any:** Can cancel any reservation through update endpoint

**Table Management:**
- **View All:** `GET /api/admin/tables` - View all restaurant tables
- **Create:** `POST /api/admin/tables` - Add new table
- **Update:** `PUT /api/admin/tables/:id` - Update table details
- **Delete:** `DELETE /api/admin/tables/:id` - Remove table (only if no active reservations)

**Restrictions:**
- All admin endpoints require authentication AND admin role
- Protected by role-based middleware

### Authorization Flow

1. **JWT Token Verification:** All protected routes verify JWT token
2. **User Lookup:** System fetches user from database to get current role
3. **Role Check:** Role middleware verifies user has required permissions
4. **Access Grant/Deny:** Returns 403 Forbidden if role doesn't match

## Data Modeling

### User Schema
```javascript
{
  name: String,
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['user', 'admin'], default: 'user')
}
```

### Table Schema
```javascript
{
  tableNumber: Number (unique),
  capacity: Number (required)
}
```

### Reservation Schema
```javascript
{
  userId: ObjectId (ref: 'User'),
  tableId: ObjectId (ref: 'Table'),
  date: String (YYYY-MM-DD format),
  timeSlot: String (HH:MM format),
  guests: Number,
  status: String (default: 'ACTIVE', enum: ['ACTIVE', 'CANCELLED', 'COMPLETED']),
  timestamps: true (createdAt, updatedAt)
}
```

### Design Decisions

1. **Reservation Status:** Three-state system allows tracking active, cancelled, and completed reservations
2. **Date/Time Storage:** Stored as strings for simplicity; could be enhanced with Date objects and timezone handling
3. **Table Capacity:** Integer field allows flexible capacity management
4. **User Roles:** Enum ensures only valid roles are assigned
5. **Password Hashing:** Automatic hashing via Mongoose pre-save hook using bcrypt

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new customer
- `POST /api/auth/login` - Login (customer or admin)

### Reservations (Customer)
- `GET /api/reservations/my` - Get user's own reservations
- `POST /api/reservations` - Create new reservation
- `DELETE /api/reservations/:id` - Cancel own reservation

### Admin - Reservations
- `GET /api/admin/reservations` - Get all reservations (optional: `?date=YYYY-MM-DD`)
- `PUT /api/admin/reservations/:id` - Update reservation status

### Admin - Tables
- `GET /api/admin/tables` - Get all tables
- `POST /api/admin/tables` - Create new table
- `PUT /api/admin/tables/:id` - Update table
- `DELETE /api/admin/tables/:id` - Delete table

## Known Limitations

1. **No Email Verification:** User registration doesn't require email verification
2. **No Password Reset:** No functionality to reset forgotten passwords
3. **Time Slot Format:** Time slots are simple strings without timezone handling
4. **No Real-time Updates:** Availability is checked at reservation time only
5. **Simple Table Assignment:** Uses first-fit algorithm; doesn't optimize for best table utilization
6. **No Reservation Modifications:** Customers cannot modify existing reservations (only cancel)
7. **No Time Range Validation:** Doesn't validate that reservation date is in the future
8. **No Business Hours:** System doesn't enforce restaurant operating hours

## Areas for Improvement

Given additional time, the following enhancements would be valuable:

1. **Enhanced Table Assignment:**
   - Implement best-fit algorithm for better table utilization
   - Consider table location/preferences
   - Load balancing across tables

2. **Reservation Management:**
   - Allow customers to modify existing reservations
   - Add reservation confirmation emails
   - Implement reservation reminders

3. **Validation & Business Logic:**
   - Add date validation (prevent past dates)
   - Implement business hours checking
   - Add minimum advance booking time
   - Timezone normalization

4. **User Experience:**
   - Add `GET /api/auth/me` endpoint for current user profile
   - Improve error messages with more context
   - Add loading states and better feedback

5. **Testing & Quality:**
   - Add unit tests for business logic
   - Integration tests for API endpoints
   - End-to-end tests for user flows
   - CI/CD pipeline setup

6. **Security:**
   - Implement rate limiting
   - Add input sanitization
   - Password strength requirements
   - Session management improvements

7. **Performance:**
   - Add database indexing for frequently queried fields
   - Implement caching for table availability
   - Optimize database queries

8. **Documentation:**
   - API documentation (Swagger/OpenAPI)
   - Code comments and JSDoc
   - Architecture diagrams

## Deployment

### Quick Deployment Guide

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

#### Step 1: Push to GitHub

**PowerShell (Windows):**
```powershell
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

**Bash (Linux/Mac):**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

#### Step 2: Deploy Backend (Render/Railway)
1. Sign up at [render.com](https://render.com) or [railway.app](https://railway.app)
2. Create new Web Service
3. Connect GitHub repository
4. Set root directory to `server`
5. Add environment variables:
   - `MONGO_URI` - MongoDB connection string
   - `JWT_SECRET` - Secret key for JWT
   - `PORT` - Port number (auto-set on Render)
   - `FRONTEND_URL` - Your frontend URL
6. Deploy and copy backend URL

#### Step 3: Deploy Frontend (Vercel/Netlify)
1. Sign up at [vercel.com](https://vercel.com) or [netlify.com](https://netlify.com)
2. Import from GitHub
3. Set root directory to `client`
4. Add environment variable:
   - `VITE_API_BASE` - Your backend URL (e.g., `https://your-backend.onrender.com`)
5. Deploy

#### Step 4: Seed Database
After backend is deployed, seed tables:

**PowerShell (Windows):**
```powershell
# Navigate to server directory
cd server

# Update .env with production MONGO_URI, then run:
node seed/tables.seed.js
node seed/admin.seed.js
```

**Bash (Linux/Mac):**
```bash
# Navigate to server directory
cd server

# Update .env with production MONGO_URI, then run:
node seed/tables.seed.js
node seed/admin.seed.js
```

#### Step 5: Update CORS
The backend CORS is configured to allow your frontend domain. Update `FRONTEND_URL` environment variable on backend.

### Docker Deployment
```bash
docker-compose up --build
```

### Live URLs
After deployment, update this section with:
- **Frontend URL:** `https://your-app.vercel.app`
- **Backend URL:** `https://your-backend.onrender.com`
- **GitHub Repository:** `https://github.com/your-username/your-repo`

## Project Structure

```
├── server/
│   ├── config/
│   │   └── db.js              # Database connection
│   ├── middleware/
│   │   ├── auth.js           # JWT authentication
│   │   └── role.js           # Role-based authorization
│   ├── models/
│   │   ├── User.js           # User model
│   │   ├── Table.js          # Table model
│   │   └── Reservation.js   # Reservation model
│   ├── routes/
│   │   ├── auth.routes.js    # Authentication routes
│   │   ├── reservation.routes.js  # Customer reservation routes
│   │   └── admin.routes.js   # Admin routes
│   ├── seed/
│   │   ├── admin.seed.js     # Admin user seed
│   │   └── tables.seed.js    # Tables seed
│   ├── app.js                # Express app configuration
│   └── server.js             # Server entry point
│
└── client/
    ├── src/
    │   ├── components/
    │   │   ├── AuthForm.jsx           # Login/Register form
    │   │   ├── ReservationForm.jsx    # Create reservation
    │   │   ├── ReservationsList.jsx   # View reservations
    │   │   └── AdminDashboard.jsx    # Admin interface
    │   ├── api.js             # API client functions
    │   ├── App.jsx            # Main app component
    │   └── styles.css         # Global styles
    └── package.json
```

