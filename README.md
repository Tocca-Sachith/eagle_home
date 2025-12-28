# Eagle Home & Construction

A professional construction company website with an admin dashboard for managing customer inquiries. Built with Next.js, TypeScript, Tailwind CSS, and Prisma with MySQL.

## Features

### Public Website
- **Home Page**: Company overview with service highlights
- **Services**: Detailed information about all construction services
- **Projects**: Showcase of completed projects
- **Process**: Step-by-step explanation of the construction process
- **Contact**: Inquiry form for potential clients
- **Multi-language**: English and Sinhala support

### Admin Dashboard
- **Dashboard**: Overview of business metrics
- **Inquiries**: View and manage customer inquiries from the contact form
- **Hero Images**: Manage homepage carousel images with drag-and-drop ordering
- **Services**: Manage construction services with images and descriptions
- **Customers**: Complete customer management with auto-generated customer numbers
- **Projects**: Project management (placeholder)
- **Finance**: Financial tracking (placeholder)
- **Reports**: Business analytics (placeholder)
- **User Management**: Complete CRUD operations for users (add, edit, delete, password reset)

### Authentication & Security
- **Login System**: Secure authentication with NextAuth.js
- **Password Hashing**: bcryptjs for secure password storage
- **Session Management**: JWT-based sessions
- **Role-based Access**: ADMIN and USER roles
- **Protected Routes**: Admin dashboard requires authentication

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: MySQL
- **ORM**: Prisma v6
- **Authentication**: NextAuth.js v4
- **Password Hashing**: bcryptjs
- **Image Processing**: sharp
- **Deployment**: Ready for Vercel or any Node.js hosting

## Getting Started

### Prerequisites

- Node.js 20+ installed
- npm or yarn package manager
- MySQL Server installed and running

### Quick Setup (Recommended)

**IMPORTANT:** Before running the setup, you must:
1. Install and start MySQL Server
2. Create the database: `CREATE DATABASE eagle_construction;`
3. Update the `.env` file with your MySQL credentials

See [MYSQL_SETUP_GUIDE.md](./MYSQL_SETUP_GUIDE.md) for detailed instructions.

#### For Windows:

```bash
setup-mysql.bat
```

Or in PowerShell:

```powershell
.\setup-mysql.bat
```

#### For macOS/Linux:

```bash
chmod +x setup-mysql.sh
./setup-mysql.sh
```

This will automatically:
- ✅ Generate Prisma Client
- ✅ Run database migrations
- ✅ Seed sample data (including admin user)

### Manual Installation

1. **Clone the repository and install dependencies:**

```bash
npm install
```

2. **Set up your environment variables:**

Create a `.env` file in the root directory:

```env
# MySQL Database
DATABASE_URL="mysql://root:your_password@localhost:3306/eagle_construction"

# NextAuth Configuration
NEXTAUTH_SECRET="your-secret-key-change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

**Note:** Update the DATABASE_URL with your actual MySQL credentials.

3. **Set up MySQL database:**

```bash
# Create database in MySQL
mysql -u root -p
CREATE DATABASE eagle_construction;
exit;
```

4. **Generate Prisma Client and set up database:**

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed sample data
npm run db:seed
```

5. **Start the development server:**

```bash
npm run dev
```

6. **Login to admin dashboard:**

Visit [http://localhost:3000/login](http://localhost:3000/login)

```
Email: admin@eaglehome.com
Password: admin123
```

### Troubleshooting

If you encounter any database errors, see:
- **MYSQL_SETUP_GUIDE.md** - Comprehensive MySQL setup guide
- **setup-mysql.bat** (Windows) or **setup-mysql.sh** (Linux/Mac) - Automated setup scripts
- **USAGE_GUIDE.md** - Complete usage guide

## Database Schema

### User Model
Stores user accounts for admin dashboard access:
- `id` - Unique identifier (CUID)
- `email` - Email address (unique, required)
- `name` - User's name (required)
- `password` - Hashed password (bcrypt)
- `role` - USER or ADMIN (default: USER)
- `isActive` - Account status (default: true)
- `lastLogin` - Last login timestamp (optional)
- `createdAt` - Account creation timestamp
- `updatedAt` - Last update timestamp
- `createdBy` - ID of user who created this account (optional)

### Inquiry Model
Stores customer inquiries from the contact form:
- `id` - Unique identifier (CUID)
- `fullName` - Customer name (required)
- `country` - Country of origin (optional)
- `email` - Email address (required)
- `phone` - Phone number (optional)
- `serviceType` - Type of service requested (required)
- `hasLand` - Whether customer owns land (optional boolean)
- `desiredLocation` - Preferred location (optional)
- `budgetRange` - Budget range (optional)
- `message` - Additional details (optional)
- `createdAt` - Timestamp

### Customer Model (Placeholder)
For future customer management functionality.

### Project Model (Placeholder)
For future project tracking functionality.

## API Routes

### Authentication

#### POST /api/auth/[...nextauth]
NextAuth.js authentication endpoints:
- `/api/auth/signin` - Sign in
- `/api/auth/signout` - Sign out
- `/api/auth/session` - Get current session
- `/api/auth/csrf` - CSRF token

### Users

#### GET /api/users
Get all users (Admin only)

**Response:**
```json
{
  "users": [
    {
      "id": "...",
      "email": "admin@eaglehome.com",
      "name": "Admin User",
      "role": "ADMIN",
      "isActive": true,
      "createdAt": "2024-12-26T10:00:00.000Z"
    }
  ]
}
```

#### POST /api/users
Create a new user (Admin only)

**Request Body:**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "securepassword",
  "role": "USER"
}
```

#### PUT /api/users/[id]
Update a user (Admin only)

**Request Body:**
```json
{
  "name": "Updated Name",
  "email": "updated@example.com",
  "role": "ADMIN"
}
```

#### DELETE /api/users/[id]
Delete a user (Admin only)

#### POST /api/users/[id]/reset-password
Reset user password (Admin only)

**Request Body:**
```json
{
  "newPassword": "newpassword123"
}
```

### Inquiries

#### POST /api/inquiries
Submit a new customer inquiry.

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "country": "USA",
  "phone": "+1234567890",
  "serviceType": "build-on-land",
  "hasLand": "yes",
  "desiredLocation": "Downtown",
  "budgetRange": "400k-600k",
  "message": "Looking to build a 3-bedroom home"
}
```

**Response (Success):**
```json
{
  "success": true,
  "inquiry": { ... },
  "message": "Inquiry submitted successfully"
}
```

**Example cURL:**
```bash
curl -X POST http://localhost:3000/api/inquiries \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "serviceType": "build-on-land",
    "message": "Interested in building a home"
  }'
```

#### GET /api/inquiries
Retrieve the latest 20 inquiries (most recent first).

**Response:**
```json
{
  "inquiries": [
    {
      "id": "...",
      "fullName": "John Doe",
      "email": "john@example.com",
      "serviceType": "build-on-land",
      "createdAt": "2024-12-26T10:30:00.000Z",
      ...
    }
  ]
}
```

## Routes to Test

### Public Routes
- `/` - Home page
- `/services` - Services page
- `/projects` - Projects showcase
- `/process` - Construction process
- `/contact` - Contact form

### Authentication
- `/login` - Login page

### Admin Routes (Protected - Requires Authentication)
- `/admin` - Admin dashboard
- `/admin/inquiries` - View customer inquiries
- `/admin/users` - User management (CRUD operations)
- `/admin/customers` - Customer management (placeholder)
- `/admin/projects` - Project tracking (placeholder)
- `/admin/finance` - Financial management (placeholder)
- `/admin/reports` - Reports & analytics (placeholder)

## Brand Colors

The site uses a professional construction/real-estate color scheme:

- **Navy Blue** (`#1e3a5f`) - Primary brand color (use `text-brand-navy` or `bg-brand-navy`)
- **Gray** (`#64748b`) - Secondary text and accents (use `text-brand-gray` or `bg-brand-gray`)
- **Gold** (`#d4a574`) - Accent color for CTAs and highlights (use `text-brand-gold` or `bg-brand-gold`)

## Database Management

### View data with Prisma Studio:
```bash
npx prisma studio
```

### Create a new migration after schema changes:
```bash
npx prisma migrate dev --name migration_name
```

### Reset database (⚠️ deletes all data):
```bash
npx prisma migrate reset
```

## Production Deployment

### Build the application:
```bash
npm run build
```

### Start production server:
```bash
npm start
```

### Deploy to Vercel:
1. Push your code to GitHub
2. Import project in Vercel
3. Add `DATABASE_URL` environment variable
4. Deploy

## Future Enhancements

- [x] Add authentication for admin dashboard ✅
- [x] User management system ✅
- [x] Multi-language support (English/Sinhala) ✅
- [ ] Implement customer management functionality
- [ ] Add project tracking system
- [ ] Create financial management tools
- [ ] Build reporting and analytics
- [ ] Add file upload for project photos
- [ ] Implement email notifications
- [ ] Password recovery system
- [ ] Two-factor authentication

## Documentation

- **README.md** (this file) - Project overview and quick start
- **USAGE_GUIDE.md** - Complete usage guide with login instructions
- **QUICK_SETUP.md** - Quick setup for fixing seed errors
- **SEED_TROUBLESHOOTING.md** - Detailed troubleshooting for database issues
- **DATABASE_SETUP.md** - Database configuration details
- **AUTH_IMPLEMENTATION.md** - Authentication system details
- **I18N_IMPLEMENTATION.md** - Multi-language implementation
- **IMPLEMENTATION_SUMMARY.md** - Overall implementation summary

## Notes

- **Authentication**: Admin dashboard is now protected with NextAuth.js authentication
- **Default Admin**: After seeding, login with `admin@eaglehome.com` / `admin123`
- **Mobile Responsive**: All pages are fully responsive and mobile-friendly
- **Overseas Clients**: The site specifically highlights support for international/overseas clients with remote communication
- **Security**: Passwords are hashed with bcryptjs (10 rounds)

## License

Private - Eagle Home & Construction

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
