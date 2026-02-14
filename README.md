# ইফতার পার্টি – ২০২৬ | ICE Department Iftar Party Management System

A premium, full-stack web application for managing the ICE Department iftar party registration, payments, and expenses with a beautiful Bangladeshi-themed UI.

## ✨ Features

### 🎯 User Features
- **Bilingual Landing Page** with GSAP animations and floating elements
- **Food Menu Toggle** with glassmorphism and smooth animations
- **Registration Form** with:
  - Dynamic "Others" batch field with GSAP animation
  - Real-time validation
  - Mobile number and email verification
  - Locked ICE department field
- **Success Page** with confetti celebration and email confirmation
- **Responsive Design** - Works perfectly on all devices

### 👨‍💼 Admin Features
- **Secure Authentication** - Admin login with JWT
- **Comprehensive Dashboard** with 4 tabs:
  1. **Overview** - Payment progress, recent activity, quick stats
  2. **Registrations** - Search, filter, bulk payment updates
  3. **Expenses** - Add/delete expenses, financial tracking
  4. **Reports** - CSV exports (all, batch-wise, paid, unpaid, financial)

### 💰 Financial Management
- Real-time calculation of:
  - Total collected amount (paid users × ৳450)
  - Total expenses
  - Remaining balance
- Expense tracking with notes
- Batch-wise statistics
- Comprehensive financial reports

### 📧 Email System
- **Registration Confirmation** - Sent immediately after registration
- **Payment Confirmation** - Sent when admin marks payment as done
- Beautiful HTML email templates with Bangladeshi theme

## 🛠️ Tech Stack

### Frontend
- **React 19** + **Vite** - Fast, modern development
- **Tailwind CSS** - Utility-first styling
- **GSAP** - Professional animations
- **Canvas Confetti** - Celebration effects
- **React Router DOM** - Navigation
- **React Hot Toast** - Notifications
- **Axios** - API requests
- **Lucide React** - Beautiful icons

### Backend
- **Node.js** + **Express** - Server framework
- **TypeScript** - Type safety
- **Drizzle ORM** - Database management
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Nodemailer** - Email service
- **Bcrypt** - Password hashing

## 📦 Installation

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database running
- Email service credentials (Gmail, etc.)

### Backend Setup

1. Navigate to backend directory:
```bash
cd Backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env`:
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/iftar_db

# JWT
JWT_SECRET=your-super-secret-jwt-key-here

# Server
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Email (Gmail example)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
EMAIL_FROM=ICE Department <your-email@gmail.com>
```

4. Run database migrations:
```bash
npm run db:push
```

5. Start the backend server:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env`:
```env
VITE_API_URL=http://localhost:5000
```

4. Start the development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## 🚀 Usage

### For Users

1. Visit the landing page
2. Click **"রেজিস্ট্রেশন করুন"** to register
3. Fill in the registration form:
   - Name
   - Batch (select from dropdown or choose "Others")
   - Mobile number (11 digits)
   - Email address
4. Submit and receive confirmation email
5. Wait for payment instructions via email

### For Admins

1. Register an admin account at `/register`
2. Login at `/login`
3. Navigate to `/admin-dashboard`
4. Manage registrations, expenses, and generate reports

## 📊 Database Schema

### Users Table (Admin Authentication)
- id, name, email, password
- isEmailVerified, createdAt, updatedAt

### Registrations Table
- id, name, department, batch
- mobile, email, paymentStatus
- createdAt, updatedAt

### Expenses Table
- id, title, amount, note
- createdAt

## 🎨 Design Features

- **Bangladeshi Theme** - Green, teal, and cyan color palette
- **Glassmorphism** - Modern frosted glass effects
- **GSAP Animations** - Smooth, professional animations
- **Responsive** - Mobile-first design
- **Accessibility** - Proper ARIA labels and semantic HTML

## 📧 Email Templates

Two beautiful HTML email templates:
1. **Registration Confirmation** - Sent after successful registration
2. **Payment Confirmation** - Sent when payment is marked as done

Both templates feature:
- Gradient backgrounds
- Responsive design
- Bangladeshi styling
- Clear information display

## 🔒 Security

- JWT-based authentication
- Password hashing with bcrypt
- Protected admin routes
- Input validation on both frontend and backend
- SQL injection prevention with Drizzle ORM
- CORS configuration

## 📱 API Endpoints

### Public Routes
- `POST /api/iftar/register` - Register for iftar

### Protected Admin Routes
- `GET /api/iftar/registrations` - Get all registrations
- `GET /api/iftar/registrations/:id` - Get single registration
- `PATCH /api/iftar/registrations/:id/payment` - Update payment status
- `PATCH /api/iftar/registrations/payment/bulk` - Bulk payment update
- `POST /api/iftar/expenses` - Add expense
- `GET /api/iftar/expenses` - Get all expenses
- `DELETE /api/iftar/expenses/:id` - Delete expense
- `GET /api/iftar/financials` - Get financial summary

## 🎯 Key Calculations

- **Total Collected** = Paid Users × ৳450
- **Remaining Balance** = Total Collected - Total Expenses
- **Payment Percentage** = (Paid Users / Total Users) × 100

## 📄 Reports & Exports

CSV exports available for:
- All registrations
- Batch-wise registrations
- Paid registrations only
- Unpaid registrations only
- Complete financial report with expense breakdown

## 🌟 Special Features

### Food Menu Toggle
- Smooth GSAP slide + fade + blur animation
- Glassmorphic panel design
- 7 traditional Bangladeshi dishes
- Hover animations on dish cards
- Click outside to close

### Dynamic Batch Field
- Smooth GSAP animation when "Others" is selected
- Auto-clear when switching back
- Validation for custom batch input

### Confetti Celebration
- Triggered on successful registration
- Multi-color confetti (green, teal, cyan)
- 3-second celebration animation

## 🐛 Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env
- Run `npm run db:push` to sync schema

### Email Not Sending
- Verify EMAIL_USER and EMAIL_PASS
- For Gmail, use App-Specific Password
- Check spam folder

### CORS Errors
- Ensure FRONTEND_URL matches your frontend URL
- Check CORS configuration in backend

## 📝 License

This project is created for ICE Department, NSTU.

## 👥 Credits

Developed with ❤️ for **ইফতার পার্টি – ২০২৬**

**ICE Department**  
Information & Communication Engineering

---

 **আমরা ইফতার পার্টি – ২০২৬ এ আপনাকে স্বাগতম জানাচ্ছি!** 🌿
