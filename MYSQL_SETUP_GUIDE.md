# MySQL Setup Guide for Eagle Home & Construction

## Prerequisites
- MySQL Server installed and running
- MySQL credentials (username and password)

## Step 1: Create Database

Open MySQL command line or MySQL Workbench and run:

```sql
CREATE DATABASE eagle_construction CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## Step 2: Update .env File

Edit your `.env` file and update the DATABASE_URL with your MySQL credentials:

```env
DATABASE_URL="mysql://USERNAME:PASSWORD@HOST:PORT/DATABASE_NAME"
```

### Examples:

**Local MySQL with default settings:**
```env
DATABASE_URL="mysql://root:your_password@localhost:3306/eagle_construction"
```

**Local MySQL with custom port:**
```env
DATABASE_URL="mysql://root:your_password@localhost:3307/eagle_construction"
```

**Remote MySQL:**
```env
DATABASE_URL="mysql://username:password@remote-host.com:3306/eagle_construction"
```

## Step 3: Run Migrations

After updating the .env file, run the following commands:

```bash
# Generate Prisma Client
npx prisma generate

# Create and apply migrations
npx prisma migrate dev --name init

# (Optional) Seed the database with sample data
npm run db:seed
```

## Step 4: Verify Connection

Check if the connection is successful:

```bash
npx prisma db pull
```

## Common Issues and Solutions

### Issue: "Can't connect to MySQL server"
**Solution:** 
- Ensure MySQL server is running
- Check if the host and port are correct
- Verify firewall settings

### Issue: "Access denied for user"
**Solution:**
- Verify username and password in .env
- Check user privileges:
  ```sql
  GRANT ALL PRIVILEGES ON eagle_construction.* TO 'your_username'@'localhost';
  FLUSH PRIVILEGES;
  ```

### Issue: "Database does not exist"
**Solution:**
- Create the database first (see Step 1)

### Issue: "Unknown database charset"
**Solution:**
- Use UTF8MB4 charset:
  ```sql
  ALTER DATABASE eagle_construction CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  ```

## Quick Setup Script (Windows)

Save this as `setup-mysql.bat`:

```batch
@echo off
echo Eagle Home MySQL Setup
echo =====================

echo.
echo Step 1: Generating Prisma Client...
call npx prisma generate

echo.
echo Step 2: Running migrations...
call npx prisma migrate dev --name init

echo.
echo Step 3: Seeding database...
call npm run db:seed

echo.
echo Setup complete!
pause
```

## Quick Setup Script (Linux/Mac)

Save this as `setup-mysql.sh`:

```bash
#!/bin/bash
echo "Eagle Home MySQL Setup"
echo "====================="

echo ""
echo "Step 1: Generating Prisma Client..."
npx prisma generate

echo ""
echo "Step 2: Running migrations..."
npx prisma migrate dev --name init

echo ""
echo "Step 3: Seeding database..."
npm run db:seed

echo ""
echo "Setup complete!"
```

Make it executable:
```bash
chmod +x setup-mysql.sh
./setup-mysql.sh
```

## Need Help?

If you encounter any issues, check:
1. MySQL service is running
2. .env file has correct credentials
3. Database exists
4. User has proper permissions
