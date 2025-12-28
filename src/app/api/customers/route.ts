import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Generate customer number in format: CUS-YYYYMMDD-XXX
async function generateCustomerNumber(): Promise<string> {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const dateStr = `${year}${month}${day}`
  
  // Get the count of customers created today
  const startOfDay = new Date(date.setHours(0, 0, 0, 0))
  const endOfDay = new Date(date.setHours(23, 59, 59, 999))
  
  const count = await prisma.customer.count({
    where: {
      createdAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
  })
  
  const sequence = String(count + 1).padStart(3, '0')
  return `CUS-${dateStr}-${sequence}`
}

// GET /api/customers - Get all customers
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
            { customerNumber: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {}

    const customers = await prisma.customer.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        projects: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
      },
    })

    return NextResponse.json({ customers })
  } catch (error) {
    console.error('Error fetching customers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    )
  }
}

// POST /api/customers - Create new customer
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { fullName, email, phone, address, country, isOverseas, notes } = body

    if (!fullName) {
      return NextResponse.json(
        { error: 'Full name is required' },
        { status: 400 }
      )
    }

    // Generate customer number
    const customerNumber = await generateCustomerNumber()

    const customer = await prisma.customer.create({
      data: {
        customerNumber,
        fullName,
        email: email || null,
        phone: phone || null,
        address: address || null,
        country: country || null,
        isOverseas: isOverseas || false,
        notes: notes || null,
      },
      include: {
        projects: true,
      },
    })

    return NextResponse.json({
      success: true,
      customer,
    })
  } catch (error) {
    console.error('Error creating customer:', error)
    return NextResponse.json(
      { error: 'Failed to create customer' },
      { status: 500 }
    )
  }
}
