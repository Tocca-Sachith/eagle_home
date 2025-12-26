import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/inquiries - Create a new inquiry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const { fullName, email, serviceType } = body;

    if (!fullName || !email || !serviceType) {
      return NextResponse.json(
        { error: 'Missing required fields: fullName, email, and serviceType are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Create inquiry
    const inquiry = await prisma.inquiry.create({
      data: {
        fullName,
        country: body.country || null,
        email,
        phone: body.phone || null,
        serviceType,
        hasLand: body.hasLand ? body.hasLand === 'yes' : null,
        desiredLocation: body.desiredLocation || null,
        budgetRange: body.budgetRange || null,
        message: body.message || null,
      },
    });

    return NextResponse.json(
      { 
        success: true, 
        inquiry,
        message: 'Inquiry submitted successfully' 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating inquiry:', error);
    return NextResponse.json(
      { error: 'Failed to create inquiry. Please try again.' },
      { status: 500 }
    );
  }
}

// GET /api/inquiries - Get latest inquiries
export async function GET(request: NextRequest) {
  try {
    const inquiries = await prisma.inquiry.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
    });

    return NextResponse.json({ inquiries }, { status: 200 });
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inquiries' },
      { status: 500 }
    );
  }
}
