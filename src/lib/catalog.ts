import fs from 'node:fs/promises'
import path from 'node:path'

type CatalogResult = {
  generatedAt: string
  items: unknown[]
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
  const items: unknown[] = []

  for (const fileName of plantFiles) {
    const filePath = path.join(dataDir, fileName)
    const raw = await fs.readFile(filePath, 'utf8')
    const parsed = JSON.parse(raw)

    if (Array.isArray(parsed)) {
      byFile[fileName] = parsed.length
      items.push(...parsed)
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
