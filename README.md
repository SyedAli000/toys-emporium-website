# Toys Emporium - E-Commerce Platform

A full-stack e-commerce platform for selling toys with three distinct user panels: Customer, Manager, and Admin.

## Features

### Customer Panel (User)
- Browse and search products with advanced filtering
- Add products to cart and wishlist
- User account management and order tracking
- Order history with order status tracking
- Address management for quick checkout
- Product reviews and ratings

### Manager Panel
- Inventory management and stock tracking
- Order management and fulfillment
- Customer relationship management
- Sales and business analytics
- Notification system

### Admin Panel
- Complete system administration
- User management with role-based access control
- Product and category management
- Banner and promotional content management
- Analytics dashboard with key metrics
- Settings and configuration management

## Tech Stack

### Frontend
- **Framework:** Next.js 16 with App Router
- **UI Library:** shadcn/ui components
- **Styling:** Tailwind CSS v4
- **Form Handling:** React Hook Form + Zod
- **HTTP Client:** Axios with custom interceptors
- **Authentication:** JWT tokens with js-cookie

### Backend
- **Runtime:** Node.js with Next.js API Routes
- **Database:** MongoDB with Mongoose ORM
- **Authentication:** JWT with bcryptjs password hashing
- **Validation:** Zod schemas

### Hosting
- Deploy on Vercel or any Node.js compatible platform
- MongoDB Atlas for database

## Project Structure

```
/app
  /user                    # Customer panel
    /dashboard
    /products
    /cart
    /orders
    /wishlist
  /manager                 # Manager panel
    /inventory
    /orders
    /customers
    /settings
  /admin                   # Admin panel
    /users
    /products
    /categories
    /banners
    /roles
    /settings
  /api
    /auth
      /login
      /register
    /products
    /categories
    /orders
    /reviews

/lib
  - auth.ts               # JWT utilities
  - api.ts                # API client setup
  - db.ts                 # MongoDB connection
  - types.ts              # TypeScript interfaces

/models
  - User.ts               # User schema
  - Product.ts            # Product schema
  - Category.ts           # Category schema
  - Order.ts              # Order schema
  - Review.ts             # Review schema

/hooks
  - useAuth.ts            # Authentication hook

/components/ui
  - (shadcn components)
```

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB database (local or MongoDB Atlas)
- Environment variables configured

### Installation

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```

   Configure these variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Generate with `openssl rand -base64 32`
   - `NEXT_PUBLIC_API_URL`: API base URL (default: http://localhost:3000/api)

3. **Start the development server:**
   ```bash
   pnpm dev
   ```

   Open http://localhost:3000 in your browser.

## Authentication & Authorization

### User Roles
- **Super Admin:** Full system access
- **Admin:** User, product, and order management
- **Manager:** Order and inventory management
- **Customer:** Shop and manage personal orders
- **Guest:** Browse products (limited access)

### Login Flow
1. User submits login form with email and password
2. API validates credentials and generates JWT token
3. Token stored in httpOnly cookie (js-cookie)
4. Subsequent requests include token in Authorization header
5. Protected routes check token validity and user role

## Payment Method

Currently supports **Cash on Delivery (COD)** only.
- Orders are created with COD as the default payment method
- No payment gateway integration required
- Orders show COD status during checkout

## Database Schema

### User
- email (unique)
- password (hashed)
- name
- role
- avatar
- phone
- isActive

### Product
- name
- description
- price, cost
- category (reference)
- stock
- images
- ratings, reviews
- tags
- isFeatured, isActive

### Order
- userId (reference)
- items (products with quantity and price)
- shippingAddress
- totalAmount
- status (pending/confirmed/shipped/delivered/cancelled)
- paymentMethod (cod)
- trackingNumber
- notes

### Category
- name (unique)
- description
- image
- isActive

### Review
- productId (reference)
- userId (reference)
- rating (1-5)
- comment

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/register` - Create new customer account

### Products
- `GET /api/products` - List all products (with filters)
- `GET /api/products/[id]` - Get product details
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/[id]` - Update product (admin only)
- `DELETE /api/products/[id]` - Delete product (admin only)

### Categories
- `GET /api/categories` - List all categories
- `POST /api/categories` - Create category (admin only)
- `PUT /api/categories/[id]` - Update category (admin only)
- `DELETE /api/categories/[id]` - Delete category (admin only)

### Orders
- `GET /api/orders` - List user's orders (customer) or all orders (manager/admin)
- `POST /api/orders` - Create new order
- `GET /api/orders/[id]` - Get order details
- `PUT /api/orders/[id]` - Update order status (manager/admin)
- `DELETE /api/orders/[id]` - Cancel order

### Reviews
- `GET /api/reviews` - List reviews for a product
- `POST /api/reviews` - Create review (authenticated users)
- `DELETE /api/reviews/[id]` - Delete review (owner or admin)

## Security Features

1. **Password Security:** Bcrypt hashing with salt
2. **JWT Tokens:** Secure token-based authentication
3. **Role-Based Access Control:** Different permissions per user role
4. **Protected Routes:** Client-side route protection + server-side validation
5. **Input Validation:** Zod schema validation on frontend and backend
6. **CORS Handling:** Configured for secure cross-origin requests

## Performance Optimizations

1. **Image Optimization:** Next.js Image component for lazy loading
2. **Code Splitting:** Automatic by Next.js
3. **Caching:** API response caching with SWR
4. **Database Indexing:** Indexes on frequently queried fields
5. **Minification:** Automatic by Next.js production build

## Responsive Design

- Mobile-first approach
- Fully responsive on all screen sizes
- Touch-friendly interfaces
- Optimized for various device types

## Development Workflow

1. Create feature branch: `git checkout -b feature/name`
2. Make changes and test locally
3. Commit with descriptive messages
4. Push and create pull request
5. Deploy after review and testing

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel dashboard
3. Configure environment variables
4. Deploy with one click

### Custom Server
1. Set environment variables on server
2. Install dependencies: `pnpm install`
3. Build: `pnpm build`
4. Start: `pnpm start`
5. Use PM2 or similar for process management

## Testing

```bash
# Run tests
pnpm test

# Run with coverage
pnpm test:coverage

# Run linter
pnpm lint

# Type check
pnpm type-check
```

## Troubleshooting

### MongoDB Connection Issues
- Verify `MONGODB_URI` in `.env.local`
- Check IP whitelist in MongoDB Atlas
- Ensure network connectivity to database

### Authentication Errors
- Clear cookies and refresh page
- Verify JWT_SECRET is set and consistent
- Check token expiration (default: 7 days)

### API Not Found Errors
- Ensure API routes are in `/app/api` directory
- Check file naming follows Next.js conventions
- Verify correct HTTP method usage

## Future Enhancements

- [ ] Payment gateway integration (Stripe/PayPal)
- [ ] Email notifications system
- [ ] Advanced analytics dashboard
- [ ] Inventory alerts and reordering
- [ ] Customer loyalty program
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Advanced search with Elasticsearch

## Contributing

1. Follow code style and conventions
2. Write meaningful commit messages
3. Test changes before submitting PR
4. Update documentation as needed

## Support

For support or issues, contact the development team or create an issue in the repository.

## License

This project is proprietary and confidential.

---

**Last Updated:** 2024
**Version:** 1.0.0
