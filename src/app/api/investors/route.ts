import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import bcrypt from 'bcryptjs'

// Generate investor number in format: INV-YYYYMMDD-XXX
async function generateInvestorNumber(): Promise<string> {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const dateStr = `${year}${month}${day}`
  
  // Get the count of investors created today
  const startOfDay = new Date(date.setHours(0, 0, 0, 0))
  const endOfDay = new Date(date.setHours(23, 59, 59, 999))
  
  const count = await prisma.investor.count({
    where: {
      createdAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
  })
  
  const sequence = String(count + 1).padStart(3, '0')
  return `INV-${dateStr}-${sequence}`
}

// GET /api/investors - Get all investors
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')

    const where = search
      ? {
          OR: [
            { fullName: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
            { phone: { contains: search, mode: 'insensitive' as const } },
            { investorNumber: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {}

    const investors = await prisma.investor.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ investors })
  } catch (error) {
    console.error('Error fetching investors:', error)
    return NextResponse.json(
      { error: 'Failed to fetch investors' },
      { status: 500 }
    )
  }
}

// POST /api/investors - Create new investor
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const fullName = formData.get('fullName') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const country = formData.get('country') as string
    const address = formData.get('address') as string
    const notes = formData.get('notes') as string
    const profileImageFile = formData.get('profileImage') as File | null

    // Validation
    if (!fullName) {
      return NextResponse.json(
        { error: 'Full name is required' },
        { status: 400 }
      )
    }
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required for investor account' },
        { status: 400 }
      )
    }
    
    if (!phone) {
      return NextResponse.json(
        { error: 'Phone number is required for investor account' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already exists in the system' },
        { status: 400 }
      )
    }

    // Generate investor number
    const investorNumber = await generateInvestorNumber()

    let profileImagePath = null

    // Handle profile image upload
    if (profileImageFile && profileImageFile.size > 0) {
      const bytes = await profileImageFile.arrayBuffer()
      const buffer = Buffer.from(bytes)

      const uploadDir = path.join(process.cwd(), 'public/uploads/investors')
      await mkdir(uploadDir, { recursive: true })

      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
      const filename = `profile_${uniqueSuffix}_${profileImageFile.name}`
      const filepath = path.join(uploadDir, filename)

      await writeFile(filepath, buffer)
      profileImagePath = `/uploads/investors/${filename}`
    }

    // Hash phone number for password (initial password)
    const hashedPassword = await bcrypt.hash(phone, 10)

    // Create User account first
    const user = await prisma.user.create({
      data: {
        email,
        name: fullName,
        password: hashedPassword,
        role: 'INVESTOR',
        isActive: true,
      },
    })

    // Create Investor and link to User
    const investor = await prisma.investor.create({
      data: {
        investorNumber,
        fullName,
        email,
        phone,
        country: country || null,
        address: address || null,
        notes: notes || null,
        profileImage: profileImagePath,
        userId: user.id,
      },
    })

    return NextResponse.json({
      success: true,
      investor,
      user: {
        email: user.email,
        initialPassword: phone, // Return this info for admin to inform investor
      },
    })
  } catch (error) {
    console.error('Error creating investor:', error)
    return NextResponse.json(
      { error: 'Failed to create investor' },
      { status: 500 }
    )
  }
}
