import fs from 'node:fs/promises'
import path from 'node:path'

export type CatalogItem = {
  commonName?: string
  scientificName?: string
  cultivar?: string | null
  plantType?: string
  sunExposure?: string[]
  waterNeeds?: string
  tags?: string[]
}

type CatalogResult = {
  generatedAt: string
  items: CatalogItem[]
  total: number
  byFile: Record<string, number>
}

export async function loadCatalog(): Promise<CatalogResult> {
  const dataDir = path.join(process.cwd(), 'prisma', 'data')
  const entries = await fs.readdir(dataDir)
  const plantFiles = entries
    .filter((name) => name.startsWith('plants-') && name.endsWith('.json'))
    .sort()

  const byFile: Record<string, number> = {}
  const items: CatalogItem[] = []

  for (const fileName of plantFiles) {
    const filePath = path.join(dataDir, fileName)
    const raw = await fs.readFile(filePath, 'utf8')
    const parsed = JSON.parse(raw) as unknown

    if (Array.isArray(parsed)) {
      const catalogItems = parsed as CatalogItem[]
      byFile[fileName] = catalogItems.length
      items.push(...catalogItems)
    } else {
      byFile[fileName] = 0
    }
  }

  return {
    generatedAt: new Date().toISOString(),
    items,
    total: items.length,
    byFile,
  }
}
