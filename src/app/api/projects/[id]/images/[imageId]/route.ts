import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { unlink } from 'fs/promises'
import path from 'path'

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
