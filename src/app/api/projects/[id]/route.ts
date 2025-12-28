import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { writeFile, mkdir, unlink } from 'fs/promises'
import path from 'path'

// GET /api/projects/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        customer: true,
        images: {
          orderBy: { displayOrder: 'asc' },
        },
      },
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ project })
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    )
  }
}

// PUT /api/projects/[id]
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

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const location = formData.get('location') as string
    const projectType = formData.get('projectType') as string
    const status = formData.get('status') as string
    const customerId = formData.get('customerId') as string
    const budgetTotal = formData.get('budgetTotal') as string
    const actualCost = formData.get('actualCost') as string
    const contractDate = formData.get('contractDate') as string
    const startDate = formData.get('startDate') as string
    const endDatePlanned = formData.get('endDatePlanned') as string
    const actualEndDate = formData.get('actualEndDate') as string
    const investorName = formData.get('investorName') as string
    const investorContact = formData.get('investorContact') as string
    const currentPhase = formData.get('currentPhase') as string
    const progressPercent = formData.get('progressPercent') as string
    const isPublished = formData.get('isPublished') as string
    const displayOrder = formData.get('displayOrder') as string
    const notes = formData.get('notes') as string
    const thumbnailFile = formData.get('thumbnail') as File | null

    // Get existing project
    const existingProject = await prisma.project.findUnique({
      where: { id },
    })

    if (!existingProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    let thumbnailPath = existingProject.thumbnailImage

    // Handle thumbnail upload
    if (thumbnailFile && thumbnailFile.size > 0) {
      // Delete old thumbnail if exists
      if (existingProject.thumbnailImage) {
        try {
          const oldPath = path.join(process.cwd(), 'public', existingProject.thumbnailImage)
          await unlink(oldPath)
        } catch (error) {
          console.error('Error deleting old thumbnail:', error)
        }
      }

      const bytes = await thumbnailFile.arrayBuffer()
      const buffer = Buffer.from(bytes)

      const uploadDir = path.join(process.cwd(), 'public/uploads/projects')
      await mkdir(uploadDir, { recursive: true })

      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
      const filename = `thumb_${uniqueSuffix}_${thumbnailFile.name}`
      const filepath = path.join(uploadDir, filename)

      await writeFile(filepath, buffer)
      thumbnailPath = `/uploads/projects/${filename}`
    }

    const project = await prisma.project.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description: description || null }),
        ...(location !== undefined && { location: location || null }),
        ...(projectType && { projectType }),
        ...(status && { status }),
        ...(customerId !== undefined && { customerId: customerId || null }),
        ...(budgetTotal !== undefined && { 
          budgetTotal: budgetTotal ? parseFloat(budgetTotal) : null 
        }),
        ...(actualCost !== undefined && { 
          actualCost: actualCost ? parseFloat(actualCost) : null 
        }),
        ...(contractDate !== undefined && { 
          contractDate: contractDate ? new Date(contractDate) : null 
        }),
        ...(startDate !== undefined && { 
          startDate: startDate ? new Date(startDate) : null 
        }),
        ...(endDatePlanned !== undefined && { 
          endDatePlanned: endDatePlanned ? new Date(endDatePlanned) : null 
        }),
        ...(actualEndDate !== undefined && { 
          actualEndDate: actualEndDate ? new Date(actualEndDate) : null 
        }),
        ...(investorName !== undefined && { investorName: investorName || null }),
        ...(investorContact !== undefined && { investorContact: investorContact || null }),
        ...(currentPhase !== undefined && { currentPhase: currentPhase || null }),
        ...(progressPercent !== undefined && { 
          progressPercent: progressPercent ? parseInt(progressPercent) : 0 
        }),
        ...(isPublished !== undefined && { isPublished: isPublished === 'true' }),
        ...(displayOrder !== undefined && { 
          displayOrder: displayOrder ? parseInt(displayOrder) : 0 
        }),
        ...(notes !== undefined && { notes: notes || null }),
        ...(thumbnailPath && { thumbnailImage: thumbnailPath }),
      },
      include: {
        customer: true,
        images: true,
      },
    })

    return NextResponse.json({
      success: true,
      project,
    })
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    )
  }
}

// DELETE /api/projects/[id]
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

    // Get project with images
    const project = await prisma.project.findUnique({
      where: { id },
      include: { images: true },
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Delete thumbnail
    if (project.thumbnailImage) {
      try {
        const thumbPath = path.join(process.cwd(), 'public', project.thumbnailImage)
        await unlink(thumbPath)
      } catch (error) {
        console.error('Error deleting thumbnail:', error)
      }
    }

    // Delete all project images
    for (const image of project.images) {
      try {
        const imagePath = path.join(process.cwd(), 'public', image.imagePath)
        await unlink(imagePath)
      } catch (error) {
        console.error('Error deleting image:', error)
      }
    }

    // Delete project (cascade will delete images from DB)
    await prisma.project.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    )
  }
}
