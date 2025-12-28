import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/hero-images/[id] - Get single hero image
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const heroImage = await prisma.heroImage.findUnique({
      where: { id: params.id },
    })

    if (!heroImage) {
      return NextResponse.json(
        { error: 'Hero image not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ heroImage })
  } catch (error) {
    console.error('Error fetching hero image:', error)
    return NextResponse.json(
      { error: 'Failed to fetch hero image' },
      { status: 500 }
    )
  }
}

// PUT /api/hero-images/[id] - Update hero image
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, altText, displayOrder, isActive } = body

    const heroImage = await prisma.heroImage.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(altText !== undefined && { altText }),
        ...(displayOrder !== undefined && { displayOrder: parseInt(displayOrder) }),
        ...(isActive !== undefined && { isActive }),
      },
    })

    return NextResponse.json({ 
      success: true, 
      heroImage 
    })
  } catch (error) {
    console.error('Error updating hero image:', error)
    return NextResponse.json(
      { error: 'Failed to update hero image' },
      { status: 500 }
    )
  }
}

// DELETE /api/hero-images/[id] - Delete hero image
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get image info before deleting
    const heroImage = await prisma.heroImage.findUnique({
      where: { id: params.id },
    })

    if (!heroImage) {
      return NextResponse.json(
        { error: 'Hero image not found' },
        { status: 404 }
      )
    }

    // Delete from database
    await prisma.heroImage.delete({
      where: { id: params.id },
    })

    // Delete file from filesystem
    try {
      const fs = require('fs').promises
      const path = require('path')
      const filePath = path.join(process.cwd(), 'public', heroImage.imagePath)
      await fs.unlink(filePath)
    } catch (fileError) {
      console.error('Error deleting file:', fileError)
      // Continue even if file deletion fails
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Hero image deleted successfully' 
    })
  } catch (error) {
    console.error('Error deleting hero image:', error)
    return NextResponse.json(
      { error: 'Failed to delete hero image' },
      { status: 500 }
    )
  }
}
