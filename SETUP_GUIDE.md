# Toys Emporium - Complete Setup Guide

This guide walks you through setting up the Toys Emporium e-commerce platform from scratch.

## Prerequisites

Before starting, ensure you have:
- Node.js 18 or higher
- npm, pnpm, or yarn package manager
- MongoDB Atlas account (or local MongoDB installed)
- Git (for version control)

## Step 1: Clone and Install

```bash
# Clone the repository (if applicable)
git clone <repository-url>
cd toys-emporium

# Install dependencies using pnpm (recommended)
pnpm install

# Or with npm
npm install

# Or with yarn
yarn install
```

## Step 2: MongoDB Setup

### Option A: MongoDB Atlas (Cloud)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster (M0 free tier)
4. In "Database Access", create a database user with username and password
5. In "Network Access", add your IP address (or 0.0.0.0/0 for development)
6. Click "Connect" and copy the connection string
7. Replace `<username>` and `<password>` with your database credentials

### Option B: Local MongoDB

1. Install MongoDB Community Edition from https://docs.mongodb.com/manual/installation/
2. Start MongoDB service:
   ```bash
   # macOS
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   
   # Windows
   # Use MongoDB Compass or command line
   ```
3. Your connection string: `mongodb://localhost:27017/toys_emporium`

## Step 3: Environment Variables

1. Copy the example file:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` with your values:
   ```
   # MongoDB Connection String
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/toys_emporium
   
   # JWT Secret (generate a secure random string)
   JWT_SECRET=your_random_jwt_secret_here
   
   # API Configuration
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   
   # Environment
   NODE_ENV=development
   ```

3. Generate a secure JWT secret:
   ```bash
   # macOS/Linux
   openssl rand -base64 32
   
   # Or use Node.js
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

## Step 4: Run Development Server

```bash
# Start the development server
pnpm dev

# Or with npm
npm run dev

# Or with yarn
yarn dev
```

The application should now be running at http://localhost:3000

## Step 5: Test the Application

### Create a Test Admin Account

1. Go to http://localhost:3000/register
2. Sign up with test credentials:
   - Email: admin@example.com
   - Password: password123
   - Name: Admin User

3. To make this account an admin, you'll need to modify it directly in MongoDB:
   ```bash
   # Using MongoDB Atlas
   # 1. Go to your cluster
   # 2. Click "Collections"
   # 3. Find "Users" collection
   # 4. Update the admin account and change "role" to "admin" or "super_admin"
   ```

### Test Different User Panels

1. **Customer Panel (User):**
   - Log in and navigate to http://localhost:3000/user/dashboard
   - Browse products, add to cart/wishlist

2. **Manager Panel:**
   - Log in with a manager account
   - Navigate to http://localhost:3000/manager
   - Manage inventory and orders

3. **Admin Panel:**
   - Log in with an admin account
   - Navigate to http://localhost:3000/admin
   - Full system administration

## Step 6: Database Seed Data (Optional)

To populate the database with sample data:

```bash
# This would create sample products, categories, etc.
# Currently, you'll need to add these via the API or directly in MongoDB

# Example: Create a test category
# Use MongoDB Atlas UI or command line to create documents
```

## Project Structure Overview

```
/app                  # Next.js App Router pages and layouts
  /login             # Authentication pages
  /register
  /user              # Customer dashboard and shopping
  /manager           # Manager panel
  /admin             # Admin panel
  /api               # Backend API routes

/lib                 # Shared utilities
  - auth.ts          # JWT token handling
  - api.ts           # API client setup
  - db.ts            # MongoDB connection
  - types.ts         # TypeScript interfaces

/models              # Mongoose schemas
  - User.ts
  - Product.ts
  - Category.ts
  - Order.ts
  - Review.ts

/components          # React components
  /ui                # shadcn UI components
  - (custom components)

/hooks               # Custom React hooks
  - useAuth.ts       # Authentication state management

/public              # Static assets
```

## Key Files to Know

1. **`.env.local`** - Environment variables (NEVER commit this)
2. **`package.json`** - Project dependencies
3. **`next.config.mjs`** - Next.js configuration
4. **`tsconfig.json`** - TypeScript configuration
5. **`app/globals.css`** - Global styles and design tokens

## Common Commands

```bash
# Development
pnpm dev              # Start dev server

# Build
pnpm build            # Production build
pnpm start            # Start production server

# Code Quality
pnpm lint             # Run ESLint
pnpm type-check       # Run TypeScript type checking
pnpm format           # Format code with Prettier

# Database
# Direct MongoDB access (if using local MongoDB)
mongosh              # Open MongoDB shell
```

## API Documentation

### Authentication Endpoints

**POST /api/auth/login**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "role": "customer"
  }
}
```

**POST /api/auth/register**
```json
{
  "name": "New User",
  "email": "newuser@example.com",
  "password": "password123"
}
```

## User Roles Explanation

1. **Super Admin**
   - Full system access
   - Can create/edit/delete users, products, categories
   - Access to all panels
   - View analytics and reports

2. **Admin**
   - Manage products, categories, orders
   - Manage customers
   - View analytics
   - Configure settings

3. **Manager**
   - View and manage orders
   - Manage inventory/stock
   - View customers
   - Limited to manager dashboard

4. **Customer**
   - Browse products
   - Add to cart/wishlist
   - Place orders
   - View order history
   - Access customer dashboard

## Troubleshooting

### MongoDB Connection Issues
```
Error: "connect ECONNREFUSED 127.0.0.1:27017"
```
- Ensure MongoDB is running
- Check MONGODB_URI in .env.local
- For Atlas, verify IP whitelist includes your computer

### Port Already in Use
```bash
# Kill process on port 3000
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <pid> /F
```

### JWT Token Issues
- Clear browser cookies
- Regenerate JWT_SECRET in .env.local
- Restart dev server

### Next.js Caching Issues
```bash
# Clear Next.js cache
rm -rf .next

# Restart dev server
pnpm dev
```

## Security Checklist

- [ ] Change JWT_SECRET to a unique value
- [ ] Set secure MongoDB credentials
- [ ] Enable network restrictions in MongoDB Atlas
- [ ] Use HTTPS in production
- [ ] Set secure cookie flags
- [ ] Implement rate limiting
- [ ] Add CSRF protection
- [ ] Enable CORS properly
- [ ] Sanitize user inputs
- [ ] Add input validation

## Production Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Go to https://vercel.com
3. Click "New Project" and import your repository
4. Configure environment variables
5. Deploy with one click

### Other Platforms

See README.md for additional deployment options.

## Next Steps

1. Test all user flows
2. Populate with sample data
3. Customize branding and colors
4. Add additional features
5. Set up error monitoring (Sentry, etc.)
6. Configure email notifications
7. Set up backup system
8. Deploy to production

## Support and Resources

- **Next.js:** https://nextjs.org/docs
- **Mongoose:** https://mongoosejs.com/docs
- **shadcn/ui:** https://ui.shadcn.com
- **Tailwind CSS:** https://tailwindcss.com/docs
- **TypeScript:** https://www.typescriptlang.org/docs

## Quick Reference

| Feature | Status | Notes |
|---------|--------|-------|
| User Authentication | ✓ Complete | JWT-based |
| Product Management | ✓ Complete | Full CRUD |
| Shopping Cart | ✓ Complete | Client-side state |
| Order Management | ✓ Complete | COD only |
| Admin Panel | ✓ Complete | Full access |
| Manager Panel | ✓ Complete | Limited access |
| Reviews & Ratings | ✓ Complete | Ready to implement |
| Payment Integration | ⏳ Future | COD only for now |
| Email Notifications | ⏳ Future | Coming soon |

---

**Version:** 1.0.0  
**Last Updated:** 2024  
**Maintenance:** Ongoing
