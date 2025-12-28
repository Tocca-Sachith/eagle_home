import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Clear existing data
  console.log('🗑️  Clearing existing data...')
  await prisma.service.deleteMany()
  await prisma.heroImage.deleteMany()
  await prisma.inquiry.deleteMany()
  await prisma.project.deleteMany()
  await prisma.customer.deleteMany()
  await prisma.user.deleteMany()

  // Seed default admin user
  console.log('👤 Creating default admin user...')
  const hashedPassword = await bcrypt.hash('admin123', 10)
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@eaglehome.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
      isActive: true,
    },
  })
  console.log(`✅ Created admin user: ${adminUser.email}`)

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
        fullName: 'James Wilson',
        email: 'james.wilson@example.com',
        phone: '+1 (555) 234-5678',
        country: 'United States',
      },
    }),
    prisma.customer.create({
      data: {
        fullName: 'Sophie Taylor',
        email: 'sophie.taylor@example.uk',
        phone: '+44 20 7234 5678',
        country: 'United Kingdom',
      },
    }),
    prisma.customer.create({
      data: {
        fullName: 'Hiroshi Tanaka',
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
        title: 'Modern Villa - Coastal Paradise',
        projectType: 'BUILD',
        status: 'COMPLETED',
        location: 'Seaside District',
        startDate: new Date('2023-06-01'),
        endDatePlanned: new Date('2024-03-15'),
        budgetTotal: 950000.00,
      },
    }),
    prisma.project.create({
      data: {
        title: 'Urban Townhouse Renovation',
        projectType: 'RENOVATION',
        status: 'COMPLETED',
        location: 'Downtown Historic District',
        startDate: new Date('2023-09-01'),
        endDatePlanned: new Date('2024-01-30'),
        budgetTotal: 320000.00,
      },
    }),
    prisma.project.create({
      data: {
        title: 'Executive Residence',
        projectType: 'BUILD',
        status: 'CONSTRUCTION',
        location: 'Premium Heights',
        startDate: new Date('2024-01-15'),
        endDatePlanned: new Date('2024-08-30'),
        budgetTotal: 1200000.00,
      },
    }),
    prisma.project.create({
      data: {
        title: 'Family Home Construction',
        projectType: 'BUILD',
        status: 'PLANNING',
        location: 'Suburban Community',
        startDate: new Date('2024-04-01'),
        budgetTotal: 450000.00,
      },
    }),
    prisma.project.create({
      data: {
        title: 'Beachfront Villa',
        projectType: 'BUILD',
        status: 'CONSTRUCTION',
        location: 'Coastal Area',
        startDate: new Date('2024-02-01'),
        endDatePlanned: new Date('2024-10-15'),
        budgetTotal: 1100000.00,
      },
    }),
  ])

  console.log(`✅ Created ${projects.length} projects`)

  // Seed Hero Images
  console.log('🖼️  Seeding hero images...')
  const heroImages = await Promise.all([
    prisma.heroImage.create({
      data: {
        title: 'Modern Family Home',
        imagePath: '/images/hero/modern-home.jpg',
        altText: 'Beautiful modern family home with spacious garden',
        width: 1920,
        height: 1080,
        displayOrder: 0,
        isActive: true,
      },
    }),
    prisma.heroImage.create({
      data: {
        title: 'Luxury Villa Construction',
        imagePath: '/images/hero/luxury-villa.jpg',
        altText: 'Luxury villa under construction with ocean view',
        width: 1920,
        height: 1080,
        displayOrder: 1,
        isActive: true,
      },
    }),
    prisma.heroImage.create({
      data: {
        title: 'Contemporary Architecture',
        imagePath: '/images/hero/contemporary.jpg',
        altText: 'Contemporary architectural design with clean lines',
        width: 1920,
        height: 1080,
        displayOrder: 2,
        isActive: true,
      },
    }),
  ])

  console.log(`✅ Created ${heroImages.length} hero images`)

  // Seed Services
  console.log('🔧 Seeding services...')
  const services = await Promise.all([
    prisma.service.create({
      data: {
        title: 'Build on Your Land',
        description: 'Already own a perfect plot? We specialize in building custom homes on client-owned land. Our team handles all aspects from design to completion, ensuring your property is transformed into the home of your dreams.\n\n• Custom home design\n• Site assessment and preparation\n• Full construction management\n• Quality materials and craftsmanship',
        category: 'construction',
        icon: '🏗️',
        displayOrder: 0,
        isActive: true,
      },
    }),
    prisma.service.create({
      data: {
        title: 'Land Purchase + Build Package',
        description: "Don't have land yet? No problem. We assist in finding and acquiring the ideal property for your needs, followed by complete construction services. One team, one vision, seamless execution.\n\n• Land sourcing and evaluation\n• Due diligence and legal support\n• Integrated design and build\n• Single point of contact",
        category: 'construction',
        icon: '🏞️',
        displayOrder: 1,
        isActive: true,
      },
    }),
    prisma.service.create({
      data: {
        title: 'Design & Planning Services',
        description: 'Professional architectural design and planning services to create approval-ready plans. Our experienced designers work closely with you to create functional, beautiful spaces that meet all regulatory requirements.\n\n• Architectural design\n• Engineering plans\n• Permit acquisition support\n• 3D visualization',
        category: 'design',
        icon: '📐',
        displayOrder: 2,
        isActive: true,
      },
    }),
    prisma.service.create({
      data: {
        title: 'Renovation & Remodeling',
        description: 'Transform your existing space with our comprehensive renovation services. From minor updates to complete overhauls, we breathe new life into your property while respecting its character.\n\n• Kitchen and bathroom remodels\n• Home additions and extensions\n• Interior redesign\n• Structural improvements',
        category: 'renovation',
        icon: '🔨',
        displayOrder: 3,
        isActive: true,
      },
    }),
    prisma.service.create({
      data: {
        title: 'Turnkey Delivery',
        description: 'Move into a completely finished home with our turnkey delivery service. Every detail is handled - from foundation to furnishing - so you can simply unlock the door and start living.\n\n• Complete construction\n• Interior finishing\n• Landscaping\n• Ready-to-move-in condition',
        category: 'construction',
        icon: '🔑',
        displayOrder: 4,
        isActive: true,
      },
    }),
    prisma.service.create({
      data: {
        title: 'Financing & Payment Support',
        description: 'We understand that building a home is a significant investment. Our financing support includes flexible monthly payment plans and introductions to trusted banking partners to make your dream achievable.\n\n• Flexible payment plans\n• Bank introductions\n• Loan application support\n• Budget planning assistance',
        category: 'financing',
        icon: '💰',
        displayOrder: 5,
        isActive: true,
      },
    }),
    prisma.service.create({
      data: {
        title: 'Consultation Services',
        description: 'Expert consultation to guide you through every phase of your construction project. From initial concept to final delivery, our consultants provide professional advice to ensure successful outcomes.\n\n• Project feasibility analysis\n• Budget estimation\n• Timeline planning\n• Risk assessment',
        category: 'consultation',
        icon: '💼',
        displayOrder: 6,
        isActive: true,
      },
    }),
  ])

  console.log(`✅ Created ${services.length} services`)
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
