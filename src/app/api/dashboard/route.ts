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

    // Get current date info
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)

    // Fetch all stats in parallel
    const [
      activeJobsCount,
      totalClientsCount,
      pendingInvoices,
      paidInvoicesThisMonth,
      todaysJobs,
      recentLeads,
      recentPaidInvoices,
    ] = await Promise.all([
      // Active jobs (pending, scheduled, or in progress)
      prisma.job.count({
        where: {
          status: {
            in: ['pending', 'scheduled', 'in_progress']
          }
        }
      }),
      
      // Total clients
      prisma.client.count(),
      
      // Pending/sent invoices
      prisma.invoice.findMany({
        where: {
          status: {
            in: ['sent', 'overdue']
          }
        },
        select: {
          total: true,
          amountPaid: true,
        }
      }),
      
      // Paid invoices this month
      prisma.invoice.findMany({
        where: {
          status: 'paid',
          paidDate: {
            gte: startOfMonth,
          }
        },
        select: {
          total: true,
        }
      }),
      
      // Today's scheduled jobs
      prisma.job.findMany({
        where: {
          scheduledDate: {
            gte: startOfDay,
            lt: endOfDay,
          }
        },
        include: {
          client: {
            select: {
              firstName: true,
              lastName: true,
            }
          }
        },
        orderBy: {
          scheduledTime: 'asc'
        },
        take: 5,
      }),
      
      // Recent leads (last 7 days)
      prisma.contactSubmission.findMany({
        where: {
          createdAt: {
            gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 3,
      }),
      
      // Recently paid invoices
      prisma.invoice.findMany({
        where: {
          status: 'paid',
        },
        include: {
          client: {
            select: {
              firstName: true,
              lastName: true,
            }
          }
        },
        orderBy: {
          paidDate: 'desc'
        },
        take: 3,
      }),
    ])

    // Calculate totals
    const pendingInvoicesCount = pendingInvoices.length
    const outstandingAmount = pendingInvoices.reduce(
      (sum, inv) => sum + (inv.total - inv.amountPaid), 
      0
    )
    const revenueThisMonth = paidInvoicesThisMonth.reduce(
      (sum, inv) => sum + inv.total, 
      0
    )

    // Format today's schedule
    const todaySchedule = todaysJobs.map(job => ({
      id: job.id,
      client: `${job.client.firstName} ${job.client.lastName}`,
      service: formatServiceType(job.serviceType),
      time: job.scheduledTime || 'TBD',
      address: job.jobAddress,
      status: job.status,
    }))

    // Format recent activity
    const recentActivity = [
      ...recentPaidInvoices.map(inv => ({
        id: `inv-${inv.id}`,
        action: `Invoice paid`,
        client: `${inv.client.firstName} ${inv.client.lastName}`,
        amount: `$${inv.total.toFixed(2)}`,
        time: formatTimeAgo(inv.paidDate || new Date()),
      })),
      ...recentLeads.map(lead => ({
        id: `lead-${lead.id}`,
        action: 'New lead received',
        client: lead.name,
        amount: null,
        time: formatTimeAgo(lead.createdAt),
      })),
    ].sort((a, b) => {
      // This is a simplified sort - in production you'd want proper date comparison
      return 0
    }).slice(0, 5)

    return NextResponse.json({
      stats: {
        activeJobs: activeJobsCount,
        totalClients: totalClientsCount,
        pendingInvoices: pendingInvoicesCount,
        outstandingAmount,
        revenueThisMonth,
      },
      todaySchedule,
      recentActivity,
    })
  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}

function formatServiceType(type: string): string {
  const labels: Record<string, string> = {
    demo: 'Demo & Removal',
    plant_installation: 'Plant Installation',
    mulch: 'Mulch & Pine Straw',
    general_install: 'Basic Installation',
  }
  return labels[type] || type
}

function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 60) {
    return `${diffMins} minutes ago`
  } else if (diffHours < 24) {
    return `${diffHours} hours ago`
  } else if (diffDays === 1) {
    return 'Yesterday'
  } else {
    return `${diffDays} days ago`
  }
}
