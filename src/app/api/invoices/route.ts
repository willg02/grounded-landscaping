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

    const invoices = await prisma.invoice.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        client: {
          select: { firstName: true, lastName: true }
        },
        job: {
          select: { title: true }
        },
        lineItems: true,
      },
    })

    return NextResponse.json(invoices)
  } catch (error) {
    console.error('Failed to fetch invoices:', error)
    return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 })
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
      clientId, 
      jobId, 
      lineItems, 
      tax, 
      notes, 
      dueDate 
    } = body

    if (!clientId || !lineItems || lineItems.length === 0) {
      return NextResponse.json(
        { error: 'Client and at least one line item are required' },
        { status: 400 }
      )
    }

    // Calculate line item totals and subtotal
    const processedLineItems = lineItems.map((item: any) => ({
      ...item,
      total: item.quantity * item.unitPrice,
    }))
    const subtotal = processedLineItems.reduce((sum: number, item: any) => sum + item.total, 0)
    const taxAmount = tax || 0
    const total = subtotal + taxAmount

    // Generate invoice number
    const lastInvoice = await prisma.invoice.findFirst({
      orderBy: { invoiceNumber: 'desc' },
    })
    const nextNumber = lastInvoice 
      ? parseInt(lastInvoice.invoiceNumber.replace('INV-', '')) + 1 
      : 1001
    const invoiceNumber = `INV-${nextNumber}`

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        clientId,
        jobId: jobId || null,
        createdById: session.user.id,
        subtotal,
        tax: taxAmount,
        total,
        notes: notes || null,
        dueDate: new Date(dueDate),
        lineItems: {
          create: processedLineItems.map((item: any) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.total,
          })),
        },
      },
      include: {
        client: true,
        lineItems: true,
      },
    })

    return NextResponse.json(invoice, { status: 201 })
  } catch (error) {
    console.error('Failed to create invoice:', error)
    return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 })
  }
}
