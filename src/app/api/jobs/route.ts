import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const jobs = await prisma.job.findMany({
      orderBy: [
        { scheduledDate: 'asc' },
        { createdAt: 'desc' },
      ],
      include: {
        client: {
          select: { firstName: true, lastName: true }
        },
        assignedTo: {
          select: { name: true }
        },
      },
    })

    return NextResponse.json(jobs)
  } catch (error) {
    console.error('Failed to fetch jobs:', error)
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      title, 
      description, 
      serviceType, 
      priority,
      clientId,
      scheduledDate,
      scheduledTime,
      estimatedHours,
      estimatedCost,
      jobAddress,
      jobCity,
      jobState,
      jobZipCode,
    } = body

    if (!title || !serviceType || !clientId || !jobAddress || !jobCity || !jobState || !jobZipCode) {
      return NextResponse.json(
        { error: 'Required fields are missing' },
        { status: 400 }
      )
    }

    const job = await prisma.job.create({
      data: {
        title,
        description: description || null,
        serviceType,
        priority: priority || 'normal',
        status: scheduledDate ? 'scheduled' : 'pending',
        clientId,
        createdById: session.user.id,
        scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
        scheduledTime: scheduledTime || null,
        estimatedHours: estimatedHours || null,
        estimatedCost: estimatedCost || null,
        jobAddress,
        jobCity,
        jobState,
        jobZipCode,
      },
      include: {
        client: true,
      },
    })

    return NextResponse.json(job, { status: 201 })
  } catch (error) {
    console.error('Failed to create job:', error)
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 })
  }
}
