import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

// POST /api/projects/[id]/images - Upload project image
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: projectId } = await params
    const formData = await request.formData()
    
    const file = formData.get('file') as File
    const caption = formData.get('caption') as string
    const phase = formData.get('phase') as string
    const displayOrder = formData.get('displayOrder') as string

    if (!file) {
      return NextResponse.json(
        { error: 'File is required' },
        { status: 400 }
      )
    }

    // Verify project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Save file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadDir = path.join(process.cwd(), 'public/uploads/projects')
    await mkdir(uploadDir, { recursive: true })

    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    const filename = `${projectId}_${uniqueSuffix}_${file.name}`
    const filepath = path.join(uploadDir, filename)

    await writeFile(filepath, buffer)
    const imagePath = `/uploads/projects/${filename}`

    // Get next display order if not provided
    let order = displayOrder ? parseInt(displayOrder) : 0
    if (!displayOrder) {
      const lastImage = await prisma.projectImage.findFirst({
        where: { projectId },
        orderBy: { displayOrder: 'desc' },
      })
      order = lastImage ? lastImage.displayOrder + 1 : 0
    }

    // Save to database
    const projectImage = await prisma.projectImage.create({
      data: {
        projectId,
        imagePath,
        caption: caption || null,
        phase: phase || null,
        displayOrder: order,
      },
    })

    return NextResponse.json({
      success: true,
      image: projectImage,
    })
  } catch (error) {
    console.error('Error uploading project image:', error)
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    )
  }
}
