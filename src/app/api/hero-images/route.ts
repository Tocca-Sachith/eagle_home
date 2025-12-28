import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/hero-images - Get all active hero images
export async function GET(request: NextRequest) {
  try {
    const heroImages = await prisma.heroImage.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        displayOrder: 'asc',
      },
    })

    return NextResponse.json({ heroImages })
  } catch (error) {
    console.error('Error fetching hero images:', error)
    return NextResponse.json(
      { error: 'Failed to fetch hero images' },
      { status: 500 }
    )
  }
}

// POST /api/hero-images - Create new hero image
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const title = formData.get('title') as string
    const altText = formData.get('altText') as string
    const displayOrder = parseInt(formData.get('displayOrder') as string) || 0

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      )
    }

    // Generate unique filename
    const timestamp = Date.now()
    const originalName = file.name.replace(/[^a-zA-Z0-9.]/g, '_')
    const filename = `${timestamp}_${originalName}`
    const filepath = `/uploads/hero-images/${filename}`

    // Save file to public directory
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const fs = require('fs').promises
    const path = require('path')
    const publicPath = path.join(process.cwd(), 'public', 'uploads', 'hero-images')
    
    // Ensure directory exists
    await fs.mkdir(publicPath, { recursive: true })

    // Resize image to fixed size: 1920x1080 (Full HD, 16:9)
    const sharp = require('sharp')
    const resizedFilename = `resized_${filename}`
    const resizedPath = path.join(publicPath, resizedFilename)
    
    await sharp(buffer)
      .resize(1920, 1080, { 
        fit: 'cover',
        position: 'center'
      })
      .toFile(resizedPath)

    const finalPath = `/uploads/hero-images/${resizedFilename}`

    // Save to database with fixed dimensions
    const heroImage = await prisma.heroImage.create({
      data: {
        title,
        imagePath: finalPath,
        altText: altText || title,
        width: 1920,
        height: 1080,
        displayOrder,
        isActive: true,
      },
    })

    return NextResponse.json({ 
      success: true, 
      heroImage 
    }, { status: 201 })
  } catch (error) {
    console.error('Error uploading hero image:', error)
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    )
  }
}
