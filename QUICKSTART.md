# 🚀 Quick Start Guide - চড়ুইভাতি ২০২৬

## Prerequisites Checklist
- [ ] Node.js 18+ installed
- [ ] PostgreSQL installed and running
- [ ] Gmail account (or other email service) for sending emails

## Step-by-Step Setup

### 1. Database Setup (5 minutes)

```bash
# Start PostgreSQL (if not running)
# macOS:
brew services start postgresql

# Create database
createdb picnic_db

# Or using psql:
psql postgres
CREATE DATABASE picnic_db;
\q
```

### 2. Backend Setup (5 minutes)

```bash
# Navigate to backend
cd Backend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env file with your credentials
# Required changes:
# - DATABASE_URL: Update with your PostgreSQL credentials
# - JWT_SECRET: Change to a random secure string
# - EMAIL_USER: Your Gmail address
# - EMAIL_PASS: Gmail App-Specific Password

# Push database schema
npx drizzle-kit push

# Start backend server
npm run dev
```

Backend will be running on **http://localhost:5000**

### 3. Frontend Setup (3 minutes)

```bash
# Open new terminal
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# No changes needed if backend is on localhost:5000

# Start frontend server
npm run dev
```

Frontend will be running on **http://localhost:5173**

### 4. Create Admin Account (2 minutes)

1. Visit **http://localhost:5173/register**
2. Create an account with:
   - Name: Your Name
   - Email: your-email@gmail.com
   - Password: Strong password
3. Verify email (check inbox/spam)
4. Login at **http://localhost:5173/login**

### 5. Access Admin Dashboard

Visit **http://localhost:5173/admin-dashboard**

## 📧 Gmail App-Specific Password Setup

1. Go to Google Account Settings
2. Security → 2-Step Verification (enable if not enabled)
3. App Passwords → Generate new password
4. Select "Mail" and "Other (Custom name)"
5. Copy the 16-character password
6. Paste in `.env` as `EMAIL_PASS`

## 🎯 Testing the Application

### Test User Registration
1. Visit **http://localhost:5173/**
2. Click "রেজিস্ট্রেশন করুন"
3. Fill the form and submit
4. Check email for confirmation

### Test Admin Features
1. Login to admin dashboard
2. View registrations
3. Mark payment status
4. Add expenses
5. Download reports

## 🐛 Common Issues

### Database Connection Error
```bash
# Check if PostgreSQL is running
pg_isready

# If not running, start it
brew services start postgresql
```

### Email Not Sending
- Verify Gmail App-Specific Password
- Check spam folder
- Ensure 2FA is enabled on Gmail

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### Module Not Found
```bash
# Reinstall dependencies
cd Backend && npm install
cd ../frontend && npm install
```

## 📱 URLs Reference

- **Landing Page**: http://localhost:5173/
- **Registration**: http://localhost:5173/picnic-register
- **Admin Login**: http://localhost:5173/login
- **Admin Dashboard**: http://localhost:5173/admin-dashboard
- **Backend API**: http://localhost:5000

## 🎨 Features to Test

### User Flow
1. ✅ View landing page with animations
2. ✅ Click food menu toggle
3. ✅ Register for picnic
4. ✅ Receive confirmation email
5. ✅ View success page with confetti

### Admin Flow
1. ✅ Login to dashboard
2. ✅ View financial summary
3. ✅ Search and filter registrations
4. ✅ Update payment status (single/bulk)
5. ✅ Add/delete expenses
6. ✅ Download CSV reports

## 🎉 You're All Set!

The application is now running and ready to use.

**Default Admin Access:**
- Create your account at `/register`
- Login at `/login`
- Access dashboard at `/admin-dashboard`

**For Users:**
- Visit homepage at `/`
- Register at `/picnic-register`

---

Need help? Check the main README.md for detailed documentation.

🌸 **চড়ুইভাতি – ২০২৬ এ স্বাগতম!** 🌿
