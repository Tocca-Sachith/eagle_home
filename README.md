# Eagle Home & Construction

A professional construction company website with an admin dashboard for managing customer inquiries. Built with Next.js, TypeScript, Tailwind CSS, and Prisma with MySQL.

## Features

### Public Website
- **Home Page**: Company overview with service highlights
- **Services**: Detailed information about all construction services
- **Projects**: Showcase of completed projects
- **Process**: Step-by-step explanation of the construction process
- **Contact**: Inquiry form for potential clients

### Admin Dashboard
- **Dashboard**: Overview of business metrics
- **Inquiries**: View and manage customer inquiries from the contact form
- **Customers**: Customer database (placeholder)
- **Projects**: Project management (placeholder)
- **Finance**: Financial tracking (placeholder)
- **Reports**: Business analytics (placeholder)

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: MySQL
- **ORM**: Prisma v6
- **Deployment**: Ready for Vercel or any Node.js hosting

## Getting Started

### Prerequisites

- Node.js 20+ installed
- MySQL database (local or remote)
- npm or yarn package manager

### Installation

1. **Clone the repository and install dependencies:**

```bash
npm install
```

2. **Set up your environment variables:**

Create a `.env` file in the root directory (copy from `.env.example`):

```bash
cp .env.example .env
```

Edit `.env` and add your MySQL connection string:

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"

# Example for local MySQL:
# DATABASE_URL="mysql://root:password@localhost:3306/eagle_construction"
```

3. **Generate Prisma Client and run database migrations:**

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database (development)
npm run db:push

# Or create migration (production)
npx prisma migrate dev --name init

# Seed sample data
npm run db:seed
```

**Note:** See [DATABASE_SETUP.md](./DATABASE_SETUP.md) for detailed database setup instructions.

4. **Start the development server:**

```bash
npm run dev
```

5. **Open your browser:**

Visit [http://localhost:3000](http://localhost:3000) to see the website.

Visit [http://localhost:3000/admin](http://localhost:3000/admin) to access the admin dashboard.

## Database Schema

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

### POST /api/inquiries
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

### GET /api/inquiries
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

### Admin Routes
- `/admin` - Admin dashboard
- `/admin/inquiries` - View customer inquiries
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

- [ ] Add authentication for admin dashboard
- [ ] Implement customer management functionality
- [ ] Add project tracking system
- [ ] Create financial management tools
- [ ] Build reporting and analytics
- [ ] Add file upload for project photos
- [ ] Implement email notifications
- [ ] Add multi-language support

## Notes

- **Authentication**: Admin dashboard currently has no authentication. This is intentional for MVP. Authentication will be added in a future update.
- **Mobile Responsive**: All pages are fully responsive and mobile-friendly.
- **Overseas Clients**: The site specifically highlights support for international/overseas clients with remote communication.

## License

Private - Eagle Home & Construction

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
