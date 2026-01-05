import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { unlink } from 'fs/promises'
import path from 'path'

// PUT /api/projects/[id]/images/[imageId] - Update image metadata (caption/phase/displayOrder)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; imageId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { imageId } = await params
    const body = await request.json().catch(() => null) as
      | { caption?: string | null; phase?: string | null; displayOrder?: number }
      | null

    if (!body) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    const image = await prisma.projectImage.findUnique({
      where: { id: imageId },
    })

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    const updated = await prisma.projectImage.update({
      where: { id: imageId },
      data: {
        ...(body.caption !== undefined && { caption: body.caption || null }),
        ...(body.phase !== undefined && { phase: body.phase || null }),
        ...(body.displayOrder !== undefined && {
          displayOrder: Number.isFinite(body.displayOrder) ? body.displayOrder : image.displayOrder,
        }),
      },
    })

    return NextResponse.json({ success: true, image: updated })
  } catch (error) {
    console.error('Error updating image:', error)
    return NextResponse.json({ error: 'Failed to update image' }, { status: 500 })
  }
}

// DELETE /api/projects/[id]/images/[imageId]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; imageId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { imageId } = await params

    const image = await prisma.projectImage.findUnique({
      where: { id: imageId },
    })

    if (!image) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      )
    }

    // Delete file
    try {
      const imagePath = path.join(process.cwd(), 'public', image.imagePath)
      await unlink(imagePath)
    } catch (error) {
      console.error('Error deleting image file:', error)
    }

    // Delete from database
    await prisma.projectImage.delete({
      where: { id: imageId },
    })

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting image:', error)
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    )
  }
}
