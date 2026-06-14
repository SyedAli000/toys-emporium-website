# Toys Emporium - Complete Documentation

## Project Overview
A modern, professional e-commerce platform for toy retail with separate Admin and User panels, featuring product management, order tracking, user authentication, and comprehensive analytics.

---

## TABLE OF CONTENTS
1. [Project Structure](#project-structure)
2. [Input Fields & Validation](#input-fields--validation)
3. [Page Details & Functionality](#page-details--functionality)
4. [User Roles & Permissions](#user-roles--permissions)
5. [Design Guidelines](#design-guidelines)
6. [Database Schema](#database-schema)
7. [API Endpoints](#api-endpoints)

---

## PROJECT STRUCTURE

```
toys-emporium/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── (auth)/
│   │   ├── signup/page.tsx
│   │   ├── login/page.tsx
│   │   └── forgot-password/page.tsx
│   ├── (user)/
│   │   ├── dashboard/page.tsx
│   │   ├── products/page.tsx
│   │   ├── product/[id]/page.tsx
│   │   ├── cart/page.tsx
│   │   ├── checkout/page.tsx
│   │   ├── wishlist/page.tsx
│   │   ├── orders/page.tsx
│   │   ├── order/[id]/page.tsx
│   │   ├── profile/page.tsx
│   │   └── notifications/page.tsx
│   ├── (admin)/
│   │   ├── admin-dashboard/page.tsx
│   │   ├── orders/page.tsx
│   │   ├── order/[id]/page.tsx
│   │   ├── products/page.tsx
│   │   ├── products/add/page.tsx
│   │   ├── products/edit/[id]/page.tsx
│   │   ├── categories/page.tsx
│   │   ├── banners/page.tsx
│   │   ├── users/page.tsx
│   │   ├── analytics/page.tsx
│   │   └── settings/page.tsx
│   └── api/
│       ├── auth/
│       │   ├── signup/route.ts
│       │   ├── login/route.ts
│       │   └── logout/route.ts
│       ├── products/
│       │   ├── route.ts
│       │   ├── [id]/route.ts
│       │   └── search/route.ts
│       ├── categories/route.ts
│       ├── cart/route.ts
│       ├── orders/route.ts
│       ├── wishlist/route.ts
│       └── uploads/route.ts
├── components/
│   ├── ui/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Navbar.tsx
│   │   └── Sidebar.tsx
│   ├── common/
│   │   ├── ProductCard.tsx
│   │   ├── CategoryCard.tsx
│   │   ├── ReviewCard.tsx
│   │   ├── CartItem.tsx
│   │   └── OrderCard.tsx
│   └── forms/
│       ├── LoginForm.tsx
│       ├── SignupForm.tsx
│       ├── ProductForm.tsx
│       ├── CheckoutForm.tsx
│       └── ReviewForm.tsx
├── lib/
│   ├── utils.ts
│   ├── auth.ts
│   └── validation.ts
├── styles/
│   └── variables.css
└── public/
    └── images/
```

---

## INPUT FIELDS & VALIDATION

### 1. Authentication Forms

#### Signup Form
| Field | Type | Validation | Max Length |
|-------|------|-----------|-----------|
| Full Name | Text | Required, min 3 chars, letters & spaces only | 50 |
| Email | Email | Required, valid email format, unique | 100 |
| Password | Password | Required, min 8 chars, 1 uppercase, 1 number, 1 special char | 100 |
| Confirm Password | Password | Required, must match password | 100 |
| Phone | Text | Required, valid phone format (10 digits) | 15 |
| Address | Text | Required, min 10 chars | 200 |
| City | Text | Required, min 2 chars | 50 |
| State/Province | Text | Required, min 2 chars | 50 |
| ZIP Code | Text | Required, valid format | 20 |
| Country | Dropdown | Required, selected from list | - |
| Accept Terms | Checkbox | Required, must be checked | - |

**Error Messages:**
- "Full Name must be at least 3 characters"
- "Email already exists"
- "Password must contain uppercase, number, and special character"
- "Passwords do not match"
- "Phone must be 10 digits"
- "Please accept terms and conditions"

#### Login Form
| Field | Type | Validation | Max Length |
|-------|------|-----------|-----------|
| Email | Email | Required, valid email format | 100 |
| Password | Password | Required, min 8 chars | 100 |
| Remember Me | Checkbox | Optional | - |

**Error Messages:**
- "Email not found"
- "Incorrect password"
- "Account is inactive"
- "Too many login attempts. Try again later"

#### Forgot Password Form
| Field | Type | Validation | Max Length |
|-------|------|-----------|-----------|
| Email | Email | Required, valid email format | 100 |

**Error Messages:**
- "Email not found in system"
- "Password reset link sent to your email"

#### Reset Password Form
| Field | Type | Validation | Max Length |
|-------|------|-----------|-----------|
| New Password | Password | Required, min 8 chars, 1 uppercase, 1 number, 1 special char | 100 |
| Confirm Password | Password | Required, must match password | 100 |

---

### 2. Product Forms (Admin)

#### Add/Edit Product Form
| Field | Type | Validation | Max Length |
|-------|------|-----------|-----------|
| Product Name | Text | Required, min 3 chars, unique | 100 |
| Description | Textarea | Required, min 20 chars | 2000 |
| Category | Dropdown | Required, selected from categories | - |
| Sub-category | Dropdown | Required, selected from sub-categories | - |
| Price | Number | Required, min 0.01, decimal (2 places) | - |
| Discount (%) | Number | Optional, 0-100 range | - |
| Stock Quantity | Number | Required, min 0, integer | - |
| SKU | Text | Required, unique format | 50 |
| Images | File | Required, min 1, max 5 images, JPG/PNG only, max 5MB each | - |
| Tags | Text | Optional, comma-separated | 200 |
| Specifications | JSON | Optional, dynamic key-value pairs | - |
| Age Group | Dropdown | Required | - |
| Material | Text | Optional | 100 |
| Dimensions | Text | Optional | 100 |
| Weight | Number | Optional, in kg | - |
| Brand | Text | Optional | 50 |
| Is Featured | Toggle | Optional | - |
| Is Active | Toggle | Default true | - |

**Validation Rules:**
- Product Name must be unique and non-empty
- Price must be greater than 0 and formatted to 2 decimal places
- Discount cannot exceed 100%
- Stock quantity must be a non-negative integer
- Minimum 1 product image required
- Image file size maximum 5MB, format JPG/PNG
- Description must be descriptive (minimum 20 characters)

---

### 3. Category Management (Admin)

#### Add/Edit Category Form
| Field | Type | Validation | Max Length |
|-------|------|-----------|-----------|
| Category Name | Text | Required, min 3 chars, unique | 50 |
| Description | Textarea | Optional | 500 |
| Icon/Image | File | Optional, JPG/PNG, max 2MB | - |
| Display Order | Number | Optional, default auto | - |
| Is Active | Toggle | Default true | - |

---

### 4. Discount & Promotion Forms (Admin)

#### Add Banner/Carousel Form
| Field | Type | Validation | Max Length |
|-------|------|-----------|-----------|
| Banner Title | Text | Required, min 5 chars | 100 |
| Description | Text | Optional | 200 |
| Image | File | Required, JPG/PNG, max 5MB, recommended 1920x600px | - |
| Link URL | URL | Optional, valid URL format | 500 |
| Display Order | Number | Required, auto-increment | - |
| Start Date | DateTime | Required, future date | - |
| End Date | DateTime | Required, after start date | - |
| Is Active | Toggle | Default true | - |
| Discount Code | Text | Optional, unique | 20 |
| Discount (%) | Number | Optional, 0-100 | - |

---

### 5. User Profile Forms

#### Edit Profile Form
| Field | Type | Validation | Max Length |
|-------|------|-----------|-----------|
| Full Name | Text | Required, min 3 chars | 50 |
| Email | Email | Required, valid format, unique except own | 100 |
| Phone | Text | Required, 10 digits | 15 |
| Date of Birth | Date | Optional | - |
| Gender | Radio | Optional | - |
| Avatar | File | Optional, JPG/PNG, max 2MB | - |
| Bio | Textarea | Optional | 500 |

#### Address Management Form
| Field | Type | Validation | Max Length |
|-------|------|-----------|-----------|
| Address Type | Radio | Required (Home/Work/Other) | - |
| Full Name | Text | Required, min 3 chars | 50 |
| Phone | Text | Required, 10 digits | 15 |
| Street Address | Text | Required, min 10 chars | 100 |
| Apartment/Suite | Text | Optional | 50 |
| City | Text | Required, min 2 chars | 50 |
| State/Province | Text | Required, min 2 chars | 50 |
| ZIP Code | Text | Required, valid format | 20 |
| Country | Dropdown | Required | - |
| Is Default | Checkbox | Optional | - |

---

### 6. Checkout Forms

#### Shipping Information
| Field | Type | Validation | Max Length |
|-------|------|-----------|-----------|
| Shipping Address | Dropdown | Required, select from saved | - |
| Shipping Method | Radio | Required (Standard/Express/Overnight) | - |

#### Payment Information
| Field | Type | Validation | Max Length |
|-------|------|-----------|-----------|
| Payment Method | Radio | Required (Card/UPI/PayPal) | - |
| Card Number | Text | Conditional (if card), 16 digits, Luhn validation | - |
| Card Holder Name | Text | Conditional (if card), min 3 chars | 50 |
| Expiry Date | Text | Conditional (if card), MM/YY format, not expired | - |
| CVV | Text | Conditional (if card), 3-4 digits | - |
| Billing Address | Checkbox | Optional, same as shipping | - |

#### Order Review
| Field | Type | Validation | Max Length |
|-------|------|-----------|-----------|
| Coupon Code | Text | Optional, valid format | 20 |
| Special Instructions | Textarea | Optional | 500 |
| Accept Terms | Checkbox | Required | - |

---

### 7. Review & Rating Form

#### Product Review Form
| Field | Type | Validation | Max Length |
|-------|------|-----------|-----------|
| Rating | Radio/Stars | Required, 1-5 stars | - |
| Title | Text | Required, min 10 chars | 100 |
| Review Text | Textarea | Required, min 20 chars | 1000 |
| Verified Purchase | Checkbox | Auto-filled | - |
| Upload Images | File | Optional, max 3 images, JPG/PNG | - |
| Is Helpful Filter | Checkbox | Optional | - |

---

### 8. Search & Filter (User)

#### Product Search
| Field | Type | Validation | Max Length |
|-------|------|-----------|-----------|
| Search Query | Text | Optional, min 2 chars | 100 |
| Category | Dropdown | Optional | - |
| Price Range | Slider | Optional, min-max | - |
| Rating | Checkbox | Optional, 1-5 stars | - |
| Sort By | Dropdown | Optional (Newest/Price Low-High/Popular/Rating) | - |
| In Stock Only | Checkbox | Optional | - |

---

### 9. Admin Dashboard Filters

#### Order Filters
| Field | Type | Validation | Max Length |
|-------|------|-----------|-----------|
| Order Status | Dropdown | Optional | - |
| Date Range | Date Picker | Optional | - |
| Minimum Amount | Number | Optional, >= 0 | - |
| Customer Name | Text | Optional | 100 |

#### Analytics Filters
| Field | Type | Validation | Max Length |
|-------|------|-----------|-----------|
| Time Period | Radio | Required (Today/Week/Month/Year/Custom) | - |
| Date Range | Date Picker | Conditional (if custom) | - |

---

## PAGE DETAILS & FUNCTIONALITY

### User Panel Pages

#### 1. Homepage
**Functionality:**
- Auto-sliding carousel (3-5 banners, change every 4 seconds)
- Featured products section (6-8 top-rated products)
- Trending toys section (trending by sales/views)
- Category showcase (8-12 main categories with images)
- Limited-time offers section
- Customer testimonials section (3-4 reviews)
- Newsletter subscription section
- Footer with links and social icons

**Key Components:**
- Hero Banner
- Carousel/Slider
- Product Grid
- Category Grid
- Testimonial Section
- Newsletter Form

**Animations:**
- Fade-in on scroll
- Carousel smooth transitions
- Button hover effects
- Product card hover animations

---

#### 2. Products Page
**Functionality:**
- Browse all products with pagination
- Filter by category, price range, rating, availability
- Sort by newest, price, popular, rating
- Search functionality
- Display product cards with image, name, price, rating, review count
- Add to cart/wishlist quick actions
- Load more or pagination controls

**Page Features:**
- Responsive grid (1 column mobile, 2 columns tablet, 4 columns desktop)
- Active filters display with clear option
- Product count and sorting options visible
- Lazy loading for images

---

#### 3. Product Details Page
**Functionality:**
- Product image gallery (main + thumbnails, zoom feature)
- Product information (name, price, discount, availability)
- Rating and review summary
- In-stock/out-of-stock indicator
- Quantity selector
- Add to cart button
- Add to wishlist button
- Product specifications
- Similar products section
- Customer reviews section
- Write review form
- Share product buttons (social media)

**Key Components:**
- Image Gallery
- Price Section
- Stock Indicator
- Quantity Selector
- Action Buttons
- Specifications Table
- Reviews Section
- Similar Products

---

#### 4. Shopping Cart
**Functionality:**
- Display all cart items (image, name, price, quantity)
- Edit quantity
- Remove item option
- Save for later option
- Apply coupon code
- Cart total calculation
- Suggested products section
- Proceed to checkout button

**Calculations:**
- Subtotal
- Tax (if applicable)
- Discount
- Shipping (based on selection)
- Final Total

---

#### 5. Checkout Page
**Functionality:**
- Multi-step checkout (Shipping > Payment > Review > Confirmation)
- Order summary sidebar
- Shipping address form/selection
- Shipping method selection with cost
- Payment method selection
- Apply coupon code
- Order review
- Place order button
- Order confirmation with order number and tracking link

---

#### 6. Wishlist Page
**Functionality:**
- Display all wishlist items
- Remove from wishlist
- Move to cart
- Share wishlist with friends
- Empty wishlist message
- Sort options (price, date added)

---

#### 7. Orders Page
**Functionality:**
- Display all user orders in a list
- Order status indicators (Processing/Shipped/Delivered/Cancelled)
- Quick view order details
- Order date, total amount, estimated delivery
- Click to view full order details
- Cancel order option (if eligible)
- Re-order button
- Download invoice option
- Filter by status or date

---

#### 8. Order Details Page
**Functionality:**
- Order number, date, total amount
- Order items list (product image, name, qty, price)
- Shipping address
- Estimated delivery date
- Order timeline/progress indicator
- Track shipment (if shipped)
- Cancel order button (if eligible)
- Contact support button
- Return/Exchange option (if eligible)
- Download invoice

---

#### 9. User Profile Page
**Functionality:**
- Display user information
- Edit profile button (modal/page)
- Change password section
- Saved addresses management
- Add new address
- Edit/delete addresses
- Set default address
- Account preferences
- Notification settings
- Logout button
- Delete account option

---

#### 10. Notifications Page
**Functionality:**
- Display all user notifications
- Notification types (Order, Promotion, System)
- Mark as read/unread
- Delete notification
- Filter by type
- Notification preferences settings
- Push notification toggle
- Email notification toggle

---

### Admin Panel Pages

#### 1. Admin Dashboard
**Functionality:**
- Welcome message with admin name
- Key metrics cards:
  - Total Orders (count & trend)
  - Total Revenue (amount & trend)
  - Total Products (count)
  - Total Users (count)
  - Pending Orders (count)
- Charts:
  - Sales chart (line/bar, weekly/monthly)
  - Order status pie chart
  - Top selling products bar chart
  - Revenue trend
- Recent orders table
- Recent reviews/comments
- System alerts/notifications
- Quick action buttons

---

#### 2. Orders Management Page
**Functionality:**
- List all orders with pagination
- Order ID, customer name, amount, status, date columns
- Filter by status, date range, amount range
- Search by order ID or customer name
- Sort by date, amount, status
- Bulk action (export, status update)
- Click row to view order details
- Quick status update dropdown
- Print order option

---

#### 3. Order Details Page (Admin)
**Functionality:**
- Complete order information
- Customer details
- Shipping address
- Payment details
- Order items list
- Order timeline
- Status update dropdown with confirmation
- Reason input for cancellation/rejection
- Generate invoice
- Print order
- Contact customer option
- Add admin notes
- View payment status

---

#### 4. Products Management Page
**Functionality:**
- List all products with pagination
- Product image (thumbnail), name, category, price, stock, rating, status
- Search by name or SKU
- Filter by category, status, stock level
- Sort by name, price, sales, date
- Add product button
- Edit product (inline or form)
- Delete product with confirmation
- Bulk import products (CSV)
- Bulk export products
- Toggle active status
- View product details

---

#### 5. Add/Edit Product Page
**Functionality:**
- Product form as specified in Input Fields section
- Image upload with preview
- Drag-drop image reordering
- Auto-save draft functionality
- Validation in real-time
- Category and sub-category selection
- Dynamic specifications editor
- SEO section (meta title, description)
- Preview product page option
- Save and publish buttons
- Save as draft option

---

#### 6. Categories Management Page
**Functionality:**
- List all categories
- Category name, description, product count, status
- Add category button
- Edit category (inline or form)
- Delete category with confirmation
- Reorder categories (drag-drop)
- Toggle active status
- View products in category

---

#### 7. Banners & Carousel Management Page
**Functionality:**
- List all banners with preview
- Banner title, dates, status
- Add banner button
- Edit banner
- Delete banner
- Reorder banners (drag-drop)
- Preview carousel
- Upload new image
- Set display dates and duration
- Discount code association

---

#### 8. Users Management Page
**Functionality:**
- List all users with pagination
- User name, email, phone, registration date, status, orders count
- Search by name or email
- Filter by status (active, inactive, suspended)
- Sort by registration date, orders, spending
- View user profile/details
- Send message to user
- Suspend/activate user account
- View user order history
- Admin notes on user

---

#### 9. Analytics & Reports Page
**Functionality:**
- Time period selector (Today/Week/Month/Year/Custom)
- Key metrics:
  - Total Revenue
  - Total Orders
  - Average Order Value
  - Conversion Rate
  - Customer Acquisition
- Charts:
  - Revenue trend (line chart)
  - Orders count (bar chart)
  - Customer growth (line chart)
  - Product category sales (pie/doughnut)
  - Top 10 products (bar chart)
- Table reports:
  - Top selling products
  - Top selling categories
  - Customer spending
- Export reports (PDF/CSV)
- Scheduled report email option

---

#### 10. Settings Page (Admin)
**Functionality:**
- General settings (store name, logo, description)
- Email configuration
- Payment gateway settings
- Shipping settings (methods and costs)
- Tax settings
- Notification settings
- Website appearance settings
- API keys management
- Backup and restore
- User roles and permissions
- Activity logs

---

## USER ROLES & PERMISSIONS

### 1. Super Admin
- Full access to all features
- User and admin management
- System settings
- View all analytics
- Manage all content
- Permission: ALL

### 2. Admin/Manager
- Product management (CRUD)
- Order management (view, update status)
- User management (view, suspend)
- Banner and category management
- View analytics
- Cannot: Delete users, change system settings, manage admins
- Permission: PRODUCT_MANAGE, ORDER_MANAGE, USER_VIEW, CONTENT_MANAGE

### 3. Customer/User
- Browse products
- Make purchases
- View own orders
- Manage own profile
- Leave reviews
- Use cart and wishlist
- Permission: PRODUCT_VIEW, ORDER_VIEW_OWN, PROFILE_MANAGE, REVIEW_CREATE

### 4. Guest (Not logged in)
- Browse products
- View product details
- Search and filter
- Cannot: Checkout, add to wishlist, save orders, personalization
- Permission: PRODUCT_VIEW

---

## DESIGN GUIDELINES

### Color Palette
- **Primary Brand Color:** Vibrant Blue (#007BFF)
- **Secondary Color:** Playful Pink (#FF6B9D)
- **Accent Color:** Cheerful Yellow (#FFD700)
- **Neutral Dark:** Deep Gray (#1F2937)
- **Neutral Light:** Off-White (#F9FAFB)

### Typography
- **Headings:** Inter Bold/SemiBold (h1: 32px, h2: 24px, h3: 20px)
- **Body Text:** Inter Regular (base: 16px, line-height: 1.6)
- **Captions:** Inter Regular 14px

### Component Styling
- **Buttons:** Rounded 8px, padding 12px 20px, with hover animations
- **Cards:** Shadow elevation, rounded 12px, hover lift effect
- **Forms:** Clean input fields with floating labels, error states
- **Icons:** 24px primary, 20px secondary, consistent stroke weight

### Spacing
- Base unit: 8px
- Common: 16px (2 units), 24px (3 units), 32px (4 units), 48px (6 units)

### Responsive Breakpoints
- Mobile: 320px - 767px
- Tablet: 768px - 1024px
- Desktop: 1025px+

### Animation Guidelines
- Duration: 300-500ms for UI interactions
- Easing: ease-in-out for most animations
- Subtle: 0.2s fade, 0.3s slide, 0.4s complex
- Disable on reduce-motion preference

---

## DATABASE SCHEMA

### Users Table
```
id (UUID, primary key)
email (VARCHAR, unique)
password_hash (VARCHAR)
full_name (VARCHAR)
phone (VARCHAR)
avatar_url (VARCHAR)
date_of_birth (DATE)
gender (ENUM: M/F/O)
bio (TEXT)
role (ENUM: USER/ADMIN/SUPER_ADMIN)
status (ENUM: ACTIVE/INACTIVE/SUSPENDED)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

### Products Table
```
id (UUID, primary key)
name (VARCHAR, unique)
description (TEXT)
category_id (UUID, foreign key)
price (DECIMAL)
discount_percentage (DECIMAL)
stock_quantity (INT)
sku (VARCHAR, unique)
images (JSON array)
tags (JSON array)
specifications (JSON)
age_group (VARCHAR)
material (VARCHAR)
dimensions (VARCHAR)
weight (DECIMAL)
brand (VARCHAR)
is_featured (BOOLEAN)
is_active (BOOLEAN)
rating (DECIMAL)
review_count (INT)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

### Categories Table
```
id (UUID, primary key)
name (VARCHAR, unique)
description (TEXT)
icon_url (VARCHAR)
display_order (INT)
is_active (BOOLEAN)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

### Orders Table
```
id (UUID, primary key)
user_id (UUID, foreign key)
order_number (VARCHAR, unique)
status (ENUM: PENDING/PROCESSING/SHIPPED/DELIVERED/CANCELLED)
items (JSON array)
subtotal (DECIMAL)
tax (DECIMAL)
discount (DECIMAL)
shipping_cost (DECIMAL)
total (DECIMAL)
shipping_address (JSON)
payment_method (VARCHAR)
payment_status (ENUM: PENDING/COMPLETED/FAILED)
estimated_delivery (DATE)
actual_delivery (DATE)
tracking_number (VARCHAR)
notes (TEXT)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

### Reviews Table
```
id (UUID, primary key)
product_id (UUID, foreign key)
user_id (UUID, foreign key)
rating (INT, 1-5)
title (VARCHAR)
content (TEXT)
images (JSON array)
helpful_count (INT)
status (ENUM: PENDING/APPROVED/REJECTED)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

### Cart Table
```
id (UUID, primary key)
user_id (UUID, foreign key)
product_id (UUID, foreign key)
quantity (INT)
added_at (TIMESTAMP)
```

### Wishlist Table
```
id (UUID, primary key)
user_id (UUID, foreign key)
product_id (UUID, foreign key)
added_at (TIMESTAMP)
```

### Addresses Table
```
id (UUID, primary key)
user_id (UUID, foreign key)
address_type (ENUM: HOME/WORK/OTHER)
full_name (VARCHAR)
phone (VARCHAR)
street_address (VARCHAR)
apartment (VARCHAR)
city (VARCHAR)
state (VARCHAR)
zip_code (VARCHAR)
country (VARCHAR)
is_default (BOOLEAN)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

### Banners Table
```
id (UUID, primary key)
title (VARCHAR)
description (TEXT)
image_url (VARCHAR)
link_url (VARCHAR)
display_order (INT)
start_date (TIMESTAMP)
end_date (TIMESTAMP)
is_active (BOOLEAN)
discount_code (VARCHAR)
discount_percentage (DECIMAL)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

### Notifications Table
```
id (UUID, primary key)
user_id (UUID, foreign key)
type (ENUM: ORDER/PROMOTION/SYSTEM)
title (VARCHAR)
message (TEXT)
related_order_id (UUID)
is_read (BOOLEAN)
created_at (TIMESTAMP)
```

---

## API ENDPOINTS

### Authentication
- POST `/api/auth/signup` - User registration
- POST `/api/auth/login` - User login
- POST `/api/auth/logout` - User logout
- POST `/api/auth/forgot-password` - Request password reset
- POST `/api/auth/reset-password` - Reset password
- GET `/api/auth/verify` - Verify token

### Products
- GET `/api/products` - Get all products (with filters)
- GET `/api/products/[id]` - Get single product
- POST `/api/products` - Create product (admin)
- PUT `/api/products/[id]` - Update product (admin)
- DELETE `/api/products/[id]` - Delete product (admin)
- GET `/api/products/search` - Search products

### Categories
- GET `/api/categories` - Get all categories
- POST `/api/categories` - Create category (admin)
- PUT `/api/categories/[id]` - Update category (admin)
- DELETE `/api/categories/[id]` - Delete category (admin)

### Orders
- POST `/api/orders` - Create order
- GET `/api/orders` - Get user orders
- GET `/api/orders/[id]` - Get order details
- PUT `/api/orders/[id]` - Update order status (admin)
- GET `/api/orders/admin/all` - Get all orders (admin)

### Cart
- GET `/api/cart` - Get cart items
- POST `/api/cart` - Add to cart
- PUT `/api/cart/[id]` - Update cart item
- DELETE `/api/cart/[id]` - Remove from cart

### Wishlist
- GET `/api/wishlist` - Get wishlist
- POST `/api/wishlist` - Add to wishlist
- DELETE `/api/wishlist/[id]` - Remove from wishlist

### Reviews
- POST `/api/reviews` - Create review
- GET `/api/reviews/[productId]` - Get product reviews
- PUT `/api/reviews/[id]` - Update review
- DELETE `/api/reviews/[id]` - Delete review

### Users (Admin)
- GET `/api/users` - Get all users (admin)
- GET `/api/users/[id]` - Get user details
- PUT `/api/users/[id]` - Update user (admin)
- PUT `/api/users/[id]/status` - Update user status (admin)

### Analytics (Admin)
- GET `/api/analytics/dashboard` - Dashboard metrics
- GET `/api/analytics/sales` - Sales data
- GET `/api/analytics/products` - Product analytics
- GET `/api/analytics/customers` - Customer analytics

---

## VALIDATION RULES SUMMARY

### Email Validation
- Format: RFC 5322 compliant
- Must be unique across system
- Case-insensitive comparison

### Password Validation
- Minimum 8 characters
- Must contain: uppercase (A-Z), lowercase (a-z), number (0-9), special character (!@#$%^&*)
- Cannot contain email or name
- Cannot reuse last 3 passwords

### Phone Validation
- Format: (XXX) XXX-XXXX or XXX-XXX-XXXX or XXXXXXXXXX
- Minimum 10 digits
- Maximum 15 digits (international)

### Price Validation
- Decimal format (2 decimal places)
- Minimum: 0.01
- Maximum: No limit
- Sale price must be less than original price

### Stock Validation
- Non-negative integer
- Minimum: 0
- Maximum: No specific limit
- Cannot sell more than available stock

### Image Validation
- Format: JPG, PNG
- File size: 2MB max (avatars), 5MB max (product images)
- Dimensions: Minimum 300x300px, maximum 4000x4000px
- Required count: 1 (minimum for products)

---

**Document Version:** 1.0
**Last Updated:** 2024
**Status:** Complete
