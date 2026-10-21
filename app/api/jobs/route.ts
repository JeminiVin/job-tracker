import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all jobs from Database
export async function GET() {
  try {
    const jobs = await prisma.job.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(jobs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}

// POST new job to Database
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { companyName, role, location, status, appliedDate, salary, matchScore } = body;

    const newJob = await prisma.job.create({
      data: {
        companyName,
        role,
        location: location || 'Remote',
        status: status || 'Applied',
        appliedDate: appliedDate || new Date().toISOString().split('T')[0],
        salary: salary || 'Negotiable',
        matchScore: matchScore || Math.floor(Math.random() * 15) + 85,
      },
    });

    return NextResponse.json(newJob, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 });
  }
}

// PATCH (Update status) or DELETE
export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json();
    const updatedJob = await prisma.job.update({
      where: { id },
      data: { status },
    });
    return NextResponse.json(updatedJob);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update job' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Job ID required' }, { status: 400 });
    }

    await prisma.job.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Job deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete job' }, { status: 500 });
  }
}