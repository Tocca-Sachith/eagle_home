import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Clear existing data
  console.log('🗑️  Clearing existing data...')
  await prisma.inquiry.deleteMany()
  await prisma.customer.deleteMany()
  await prisma.project.deleteMany()

  // Seed Inquiries
  console.log('📬 Seeding inquiries...')
  const inquiries = await Promise.all([
    prisma.inquiry.create({
      data: {
        fullName: 'John Smith',
        country: 'United States',
        email: 'john.smith@example.com',
        phone: '+1 (555) 123-4567',
        serviceType: 'build-on-land',
        hasLand: true,
        desiredLocation: 'Suburban area, West District',
        budgetRange: '400k-600k',
        message: 'I own a 2000 sqm plot and would like to build a modern 3-bedroom family home with a garden.',
      },
    }),
    prisma.inquiry.create({
      data: {
        fullName: 'Sarah Johnson',
        country: 'United Kingdom',
        email: 'sarah.j@example.co.uk',
        phone: '+44 20 7123 4567',
        serviceType: 'land-purchase-build',
        hasLand: false,
        desiredLocation: 'Coastal area',
        budgetRange: '600k-1m',
        message: 'Looking to purchase land and build a vacation home. I am based overseas and need full remote support.',
      },
    }),
    prisma.inquiry.create({
      data: {
        fullName: 'Michael Chen',
        country: 'Singapore',
        email: 'michael.chen@example.sg',
        phone: '+65 9123 4567',
        serviceType: 'turnkey',
        hasLand: true,
        desiredLocation: 'Downtown area',
        budgetRange: 'over-1m',
        message: 'Need turnkey delivery of a luxury 5-bedroom executive home. Timeline is flexible but quality is priority.',
      },
    }),
    prisma.inquiry.create({
      data: {
        fullName: 'Emma Williams',
        email: 'emma.w@example.com',
        serviceType: 'renovation',
        desiredLocation: 'Historic district',
        budgetRange: '200k-400k',
        message: 'Complete renovation of 100-year-old townhouse. Want to preserve character while modernizing.',
      },
    }),
    prisma.inquiry.create({
      data: {
        fullName: 'David Park',
        country: 'South Korea',
        email: 'david.park@example.kr',
        phone: '+82 10 1234 5678',
        serviceType: 'design-planning',
        hasLand: true,
        desiredLocation: 'Mountain view area',
        budgetRange: 'flexible',
        message: 'Need architectural design and planning services for a unique hillside property. Open to creative designs.',
      },
    }),
    prisma.inquiry.create({
      data: {
        fullName: 'Lisa Anderson',
        country: 'Australia',
        email: 'lisa.anderson@example.au',
        phone: '+61 4 1234 5678',
        serviceType: 'build-on-land',
        hasLand: true,
        desiredLocation: 'Beachfront',
        budgetRange: '600k-1m',
        message: 'Building from overseas. Need weekly video updates and someone to handle all on-site decisions.',
      },
    }),
    prisma.inquiry.create({
      data: {
        fullName: 'Robert Martinez',
        email: 'robert.m@example.com',
        phone: '+1 (555) 987-6543',
        serviceType: 'consultation',
        budgetRange: 'under-200k',
        message: 'First-time builder. Need consultation on the process, budget planning, and financing options.',
      },
    }),
    prisma.inquiry.create({
      data: {
        fullName: 'Maria Garcia',
        country: 'Spain',
        email: 'maria.garcia@example.es',
        phone: '+34 612 345 678',
        serviceType: 'land-purchase-build',
        hasLand: false,
        desiredLocation: 'Quiet residential area',
        budgetRange: '400k-600k',
        message: 'Retiring soon and looking to build dream home. Need help finding suitable land and managing the entire process.',
      },
    }),
  ])

  console.log(`✅ Created ${inquiries.length} inquiries`)

  // Seed Customers
  console.log('👥 Seeding customers...')
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        name: 'James Wilson',
        email: 'james.wilson@example.com',
        phone: '+1 (555) 234-5678',
        country: 'United States',
      },
    }),
    prisma.customer.create({
      data: {
        name: 'Sophie Taylor',
        email: 'sophie.taylor@example.uk',
        phone: '+44 20 7234 5678',
        country: 'United Kingdom',
      },
    }),
    prisma.customer.create({
      data: {
        name: 'Hiroshi Tanaka',
        email: 'h.tanaka@example.jp',
        phone: '+81 90 1234 5678',
        country: 'Japan',
      },
    }),
  ])

  console.log(`✅ Created ${customers.length} customers`)

  // Seed Projects
  console.log('🏗️  Seeding projects...')
  const projects = await Promise.all([
    prisma.project.create({
      data: {
        name: 'Modern Villa - Coastal Paradise',
        status: 'Completed',
        location: 'Seaside District',
        startDate: new Date('2023-06-01'),
        endDate: new Date('2024-03-15'),
      },
    }),
    prisma.project.create({
      data: {
        name: 'Urban Townhouse Renovation',
        status: 'Completed',
        location: 'Downtown Historic District',
        startDate: new Date('2023-09-01'),
        endDate: new Date('2024-01-30'),
      },
    }),
    prisma.project.create({
      data: {
        name: 'Executive Residence',
        status: 'In Progress',
        location: 'Premium Heights',
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-08-30'),
      },
    }),
    prisma.project.create({
      data: {
        name: 'Family Home Construction',
        status: 'Planning',
        location: 'Suburban Community',
        startDate: new Date('2024-04-01'),
      },
    }),
    prisma.project.create({
      data: {
        name: 'Beachfront Villa',
        status: 'In Progress',
        location: 'Coastal Area',
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-10-15'),
      },
    }),
  ])

  console.log(`✅ Created ${projects.length} projects`)

  console.log('🎉 Seed completed successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error during seed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
