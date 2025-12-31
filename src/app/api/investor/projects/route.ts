import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/investor/projects - Get projects for logged-in investor
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'INVESTOR') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Find investor by user email
    const investor = await prisma.investor.findFirst({
      where: {
        email: session.user.email,
      },
    });

    if (!investor) {
      return NextResponse.json({ projects: [] });
    }

    // Get projects assigned to this investor
    const projectInvestors = await prisma.projectInvestor.findMany({
      where: {
        investorId: investor.id,
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            description: true,
            location: true,
            projectType: true,
            status: true,
            budgetTotal: true,
            actualCost: true,
            startDate: true,
            endDatePlanned: true,
            progressPercent: true,
            currentPhase: true,
            thumbnailImage: true,
          },
        },
      },
      orderBy: {
        assignedAt: 'desc',
      },
    });

    const projects = projectInvestors.map((pi) => pi.project);

    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Error fetching investor projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}
