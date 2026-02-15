import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/plants — list & filter plants
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    const where: Record<string, unknown> = { isActive: true }

    // Text search
    const q = searchParams.get('q')
    if (q) {
      where.OR = [
        { commonName: { contains: q, mode: 'insensitive' } },
        { scientificName: { contains: q, mode: 'insensitive' } },
        { cultivar: { contains: q, mode: 'insensitive' } },
        { genus: { contains: q, mode: 'insensitive' } },
      ]
    }

    // Filters
    const plantType = searchParams.get('plantType')
    if (plantType) where.plantType = plantType

    const category = searchParams.get('category')
    if (category) where.category = category

    const sunExposure = searchParams.get('sun')
    if (sunExposure) where.sunExposure = { has: sunExposure }

    const waterNeeds = searchParams.get('water')
    if (waterNeeds) where.waterNeeds = waterNeeds

    const zone = searchParams.get('zone')
    if (zone) {
      const z = parseInt(zone)
      where.usdaZoneMin = { lte: z }
      where.usdaZoneMax = { gte: z }
    }

    const tag = searchParams.get('tag')
    if (tag) where.tags = { has: tag }

    const designUse = searchParams.get('designUse')
    if (designUse) where.designUses = { has: designUse }

    // Pagination
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const skip = (page - 1) * limit

    const [plants, total] = await Promise.all([
      prisma.plant.findMany({
        where,
        orderBy: { commonName: 'asc' },
        skip,
        take: limit,
      }),
      prisma.plant.count({ where }),
    ])

    return NextResponse.json({ plants, total, page, limit })
  } catch (error) {
    console.error('Error fetching plants:', error)
    return NextResponse.json({ error: 'Failed to fetch plants' }, { status: 500 })
  }
}

// POST /api/plants — add one or many plants
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Accept a single plant or an array
    const plantsData = Array.isArray(body) ? body : [body]

    const results = []
    for (const plant of plantsData) {
      const created = await prisma.plant.create({ data: plant })
      results.push(created)
    }

    return NextResponse.json(
      results.length === 1 ? results[0] : results,
      { status: 201 },
    )
  } catch (error) {
    console.error('Error creating plant:', error)
    return NextResponse.json({ error: 'Failed to create plant' }, { status: 500 })
  }
}
