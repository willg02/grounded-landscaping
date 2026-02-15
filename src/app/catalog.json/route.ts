import { loadCatalog } from '@/lib/catalog'

export const runtime = 'nodejs'
export const revalidate = 3600

export async function GET() {
  const { items, total, byFile, generatedAt } = await loadCatalog()

  return Response.json(
    {
      generatedAt,
      total,
      byFile,
      items,
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    }
  )
}
