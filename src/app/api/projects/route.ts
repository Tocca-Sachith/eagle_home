import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

type InvestorAssignmentInput = {
  investorId: string
  investmentAmount?: number | null
}

type InvestorPaymentsInput = {
  investorId: string
  payments: Array<{
    amount: number
    paidAt?: string | null
  }>
}

type ProjectExpenseInput = {
  phase?: string | null
  category?: string | null
  item: string
  amount: number
  currency?: string | null
  expenseDate?: string | null
  notes?: string | null
}

function safeJsonParse<T>(value: string | null): T | null {
  if (!value) return null
  try {
    return JSON.parse(value) as T
  } catch {
    return null
  }
}

// GET /api/projects - Get all projects
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeImages = searchParams.get('includeImages') === 'true'
    const publishedOnly = searchParams.get('publishedOnly') === 'true'

    const where = publishedOnly ? { isPublished: true } : {}

    const session = await getServerSession(authOptions).catch(() => null)
    const isAdmin = !!session?.user && session.user.role === 'ADMIN'

    const projects = await prisma.project.findMany({
      where,
      include: {
        customer: isAdmin
          ? {
              select: {
                id: true,
                customerNumber: true,
                fullName: true,
                email: true,
                phone: true,
              },
            }
          : false,
        images: includeImages ? {
          orderBy: { displayOrder: 'asc' },
        } : false,
      },
      orderBy: publishedOnly 
        ? { displayOrder: 'asc' }
        : { createdAt: 'desc' },
    })

    return NextResponse.json({ projects })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

// POST /api/projects - Create new project
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const location = formData.get('location') as string
    const projectType = formData.get('projectType') as string
    const status = formData.get('status') as string
    const customerId = formData.get('customerId') as string
    const budgetTotal = formData.get('budgetTotal') as string
    const contractDate = formData.get('contractDate') as string
    const startDate = formData.get('startDate') as string
    const endDatePlanned = formData.get('endDatePlanned') as string
    const investorName = formData.get('investorName') as string
    const investorContact = formData.get('investorContact') as string
    const currentPhase = formData.get('currentPhase') as string
    const progressPercent = formData.get('progressPercent') as string
    const thumbnailFile = formData.get('thumbnail') as File | null
    const investorsJson = formData.get('investorsJson') as string | null
    const investorPaymentsJson = formData.get('investorPaymentsJson') as string | null
    const expensesJson = formData.get('expensesJson') as string | null

    if (!title || !projectType) {
      return NextResponse.json(
        { error: 'Title and project type are required' },
        { status: 400 }
      )
    }

    let thumbnailPath = null

    // Handle thumbnail upload
    if (thumbnailFile) {
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

    const parsedInvestors = safeJsonParse<InvestorAssignmentInput[]>(investorsJson)
    const parsedInvestorPayments = safeJsonParse<InvestorPaymentsInput[]>(investorPaymentsJson)
    const parsedExpenses = safeJsonParse<ProjectExpenseInput[]>(expensesJson)

    const project = await prisma.$transaction(async (tx) => {
      const created = await tx.project.create({
        data: {
          title,
          description: description || null,
          location: location || null,
          projectType,
          status: status || 'PLANNING',
          customerId: customerId || null,
          budgetTotal: budgetTotal ? parseFloat(budgetTotal) : null,
          contractDate: contractDate ? new Date(contractDate) : null,
          startDate: startDate ? new Date(startDate) : null,
          endDatePlanned: endDatePlanned ? new Date(endDatePlanned) : null,
          investorName: investorName || null,
          investorContact: investorContact || null,
          currentPhase: currentPhase || null,
          progressPercent: progressPercent ? parseInt(progressPercent) : 0,
          thumbnailImage: thumbnailPath,
        },
      })

      const assignments = Array.isArray(parsedInvestors) ? parsedInvestors : []
      const paymentGroups = Array.isArray(parsedInvestorPayments) ? parsedInvestorPayments : []

      const investorIds = new Set<string>()
      for (const a of assignments) {
        if (a?.investorId) investorIds.add(a.investorId)
      }
      for (const pg of paymentGroups) {
        if (pg?.investorId) investorIds.add(pg.investorId)
      }

      const uniqueInvestorIds = Array.from(investorIds)
      if (uniqueInvestorIds.length > 0) {
        await tx.projectInvestor.createMany({
          data: uniqueInvestorIds.map((investorId) => ({
            projectId: created.id,
            investorId,
            investmentAmount: null,
          })),
          skipDuplicates: true,
        })
      }

      // Investor payments (multiple installments)
      if (paymentGroups.length > 0) {
        const rows: Array<{
          projectId: string
          investorId: string
          installmentNo: number
          amount: number
          paidAt: Date | null
        }> = []

        for (const group of paymentGroups) {
          if (!group?.investorId) continue
          const payments = Array.isArray(group.payments) ? group.payments : []
          payments.forEach((p, idx) => {
            if (typeof p?.amount !== 'number') return
            rows.push({
              projectId: created.id,
              investorId: group.investorId,
              installmentNo: idx + 1,
              amount: p.amount,
              paidAt: p.paidAt ? new Date(p.paidAt) : null,
            })
          })
        }
        if (rows.length > 0) {
          await tx.projectInvestment.createMany({ data: rows })
        }
      } else {
        // Backward compatibility: investmentAmount as single installment
        const legacyRows = assignments
          .filter((a) => a?.investorId && typeof a.investmentAmount === 'number')
          .map((a) => ({
            projectId: created.id,
            investorId: a.investorId,
            installmentNo: 1,
            amount: a.investmentAmount as number,
            paidAt: null,
          }))
        if (legacyRows.length > 0) {
          await tx.projectInvestment.createMany({ data: legacyRows })
        }
      }

      const expenses = Array.isArray(parsedExpenses) ? parsedExpenses : []
      if (expenses.length > 0) {
        await tx.projectExpense.createMany({
          data: expenses
            .filter((e) => typeof e?.item === 'string' && e.item && typeof e.amount === 'number')
            .map((e) => ({
              projectId: created.id,
              phase: e.phase || null,
              category: e.category || null,
              item: e.item,
              amount: e.amount,
              currency: e.currency || 'LKR',
              expenseDate: e.expenseDate ? new Date(e.expenseDate) : null,
              notes: e.notes || null,
            })),
        })
      }

      return await tx.project.findUniqueOrThrow({
        where: { id: created.id },
        include: {
          customer: true,
          images: true,
          investors: {
            include: { investor: true },
          },
          expenses: true,
          investments: true,
        },
      })
    })

    return NextResponse.json({
      success: true,
      project,
    })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}
