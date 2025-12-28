import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { writeFile, mkdir, unlink } from 'fs/promises'
import path from 'path'

// GET /api/investors/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const investor = await prisma.investor.findUnique({
      where: { id },
    })

    if (!investor) {
      return NextResponse.json(
        { error: 'Investor not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ investor })
  } catch (error) {
    console.error('Error fetching investor:', error)
    return NextResponse.json(
      { error: 'Failed to fetch investor' },
      { status: 500 }
    )
  }
}

// PUT /api/investors/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const formData = await request.formData()

    const fullName = formData.get('fullName') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const country = formData.get('country') as string
    const address = formData.get('address') as string
    const notes = formData.get('notes') as string
    const isActive = formData.get('isActive') as string
    const profileImageFile = formData.get('profileImage') as File | null

    if (!fullName) {
      return NextResponse.json(
        { error: 'Full name is required' },
        { status: 400 }
      )
    }

    // Get existing investor
    const existingInvestor = await prisma.investor.findUnique({
      where: { id },
    })

    if (!existingInvestor) {
      return NextResponse.json(
        { error: 'Investor not found' },
        { status: 404 }
      )
    }

    let profileImagePath = existingInvestor.profileImage

    // Handle profile image upload
    if (profileImageFile && profileImageFile.size > 0) {
      // Delete old profile image if exists
      if (existingInvestor.profileImage) {
        try {
          const oldPath = path.join(process.cwd(), 'public', existingInvestor.profileImage)
          await unlink(oldPath)
        } catch (error) {
          console.error('Error deleting old profile image:', error)
        }
      }

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

    const investor = await prisma.investor.update({
      where: { id },
      data: {
        fullName,
        email: email || null,
        phone: phone || null,
        country: country || null,
        address: address || null,
        notes: notes || null,
        isActive: isActive === 'true',
        profileImage: profileImagePath,
      },
    })

    return NextResponse.json({
      success: true,
      investor,
    })
  } catch (error) {
    console.error('Error updating investor:', error)
    return NextResponse.json(
      { error: 'Failed to update investor' },
      { status: 500 }
    )
  }
}

// DELETE /api/investors/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Get investor
    const investor = await prisma.investor.findUnique({
      where: { id },
    })

    if (!investor) {
      return NextResponse.json(
        { error: 'Investor not found' },
        { status: 404 }
      )
    }

    // Delete profile image if exists
    if (investor.profileImage) {
      try {
        const imagePath = path.join(process.cwd(), 'public', investor.profileImage)
        await unlink(imagePath)
      } catch (error) {
        console.error('Error deleting profile image:', error)
      }
    }

    // Delete investor
    await prisma.investor.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Investor deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting investor:', error)
    return NextResponse.json(
      { error: 'Failed to delete investor' },
      { status: 500 }
    )
  }
}
