import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/services - Get all active services
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeInactive = searchParams.get('includeInactive') === 'true'

    const services = await prisma.service.findMany({
      where: includeInactive ? {} : { isActive: true },
      orderBy: {
        displayOrder: 'asc',
      },
    })

    return NextResponse.json({ services })
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    )
  }
}

// POST /api/services - Create new service
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const category = formData.get('category') as string
    const icon = formData.get('icon') as string
    const displayOrder = parseInt(formData.get('displayOrder') as string) || 0

    if (!title || !description || !category) {
      return NextResponse.json(
        { error: 'Title, description, and category are required' },
        { status: 400 }
      )
    }

    let imagePath: string | null = null

    // Handle image upload if file is provided
    if (file && file.type.startsWith('image/')) {
      const timestamp = Date.now()
      const originalName = file.name.replace(/[^a-zA-Z0-9.]/g, '_')
      const filename = `${timestamp}_${originalName}`

      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      const fs = require('fs').promises
      const path = require('path')
      const publicPath = path.join(process.cwd(), 'public', 'uploads', 'services')

      // Ensure directory exists
      await fs.mkdir(publicPath, { recursive: true })

      // Resize and save image
      const sharp = require('sharp')
      const resizedFilename = `resized_${filename}`
      const resizedPath = path.join(publicPath, resizedFilename)

      await sharp(buffer)
        .resize(800, 600, {
          fit: 'cover',
          position: 'center',
        })
        .toFile(resizedPath)

      imagePath = `/uploads/services/${resizedFilename}`
    }

    const service = await prisma.service.create({
      data: {
        title,
        description,
        category,
        icon: icon || null,
        imagePath,
        displayOrder,
        isActive: true,
      },
    })

    return NextResponse.json(
      { success: true, service },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating service:', error)
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    )
  }
}
