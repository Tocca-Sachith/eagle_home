#!/bin/bash

echo "========================================"
echo "Eagle Home - Database Setup (Unix)"
echo "========================================"
echo ""

echo "[1/4] Deleting existing database..."
rm -f prisma/dev.db prisma/dev.db-journal
echo "Done!"
echo ""

echo "[2/4] Generating Prisma Client..."
npx prisma generate
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to generate Prisma Client"
    exit 1
fi
echo "Done!"
echo ""

echo "[3/4] Running migrations..."
npx prisma migrate deploy
if [ $? -ne 0 ]; then
    echo "WARNING: migrate deploy failed, trying migrate reset..."
    npx prisma migrate reset --force
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to run migrations"
        exit 1
    fi
fi
echo "Done!"
echo ""

echo "[4/4] Running seed..."
npm run db:seed
if [ $? -ne 0 ]; then
    echo "ERROR: Seed failed"
    exit 1
fi
echo "Done!"
echo ""

echo "========================================"
echo "Setup completed successfully!"
echo "========================================"
echo ""
echo "You can now login with:"
echo "  Email: admin@eaglehome.com"
echo "  Password: admin123"
echo ""
echo "Start the development server with:"
echo "  npm run dev"
echo ""
