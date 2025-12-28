#!/bin/bash

echo "========================================"
echo "Eagle Home MySQL Setup"
echo "========================================"
echo ""

echo "Checking MySQL connection..."
echo ""

# Check if .env is configured
if ! grep -q "mysql://" .env; then
    echo "ERROR: DATABASE_URL is not configured for MySQL in .env file"
    echo ""
    echo "Please update your .env file with MySQL credentials:"
    echo 'DATABASE_URL="mysql://username:password@localhost:3306/eagle_construction"'
    echo ""
    exit 1
fi

echo "Step 1: Generating Prisma Client..."
npx prisma generate
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to generate Prisma Client"
    exit 1
fi

echo ""
echo "Step 2: Creating database and running migrations..."
npx prisma migrate dev --name init
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to run migrations"
    echo ""
    echo "Common solutions:"
    echo "1. Make sure MySQL server is running"
    echo "2. Verify database credentials in .env"
    echo "3. Ensure database 'eagle_construction' exists"
    echo ""
    exit 1
fi

echo ""
echo "Step 3: Seeding database with sample data..."
npm run db:seed
if [ $? -ne 0 ]; then
    echo "WARNING: Seed failed but migration was successful"
    echo "You can run 'npm run db:seed' manually later"
fi

echo ""
echo "========================================"
echo "Setup Complete!"
echo "========================================"
echo ""
echo "You can now run: npm run dev"
echo ""
