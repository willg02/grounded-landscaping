import Link from 'next/link'
import CatalogCopyLink from '@/components/CatalogCopyLink'
import { loadCatalog } from '@/lib/catalog'

export const metadata = {
  title: 'Plant Catalog Data | Grounded Landscaping',
  description: 'Complete plant catalog for Grounded Landscaping. JSON API with 330+ cultivars for AI design tools, landscape design, and plant recommendations.',
  keywords: 'plant catalog, landscape design, plant data, cultivars, JSON API, shrubs, trees, perennials',
  robots: 'index, follow',
  openGraph: {
    title: 'Plant Catalog Data | Grounded Landscaping',
    description: 'Public plant catalog API with detailed plant information for landscape design and AI agents.',
    type: 'website',
  },
}

export default async function PlantCatalogPage() {
  const { total, byFile, items, generatedAt } = await loadCatalog()
  const files = Object.entries(byFile)
  const formattedUpdatedAt = new Date(generatedAt).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  // JSON-LD schema for better SEO
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'Grounded Landscaping Plant Catalog',
    description: 'Comprehensive plant catalog with 330+ cultivars for landscape design and AI-powered design tools.',
    url: 'https://grounded-landscaping.vercel.app/api/plants.json',
    datePublished: generatedAt,
    creator: {
      '@type': 'Organization',
      name: 'Grounded Landscaping',
    },
    distribution: {
      '@type': 'DataDownload',
      contentUrl: 'https://grounded-landscaping.vercel.app/api/plants.json',
      encodingFormat: 'application/json',
    },
  }

  return (
    <main className="min-h-screen bg-white dark:bg-bark-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl">
          <div className="mb-4">
            <Link href="/" className="text-primary-600 hover:text-primary-700 dark:text-primary-400">
              ← Back to Grounded
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <h1 className="section-heading">Plant Catalog</h1>
            <span className="rounded-full border border-bark-200 bg-bark-50 px-3 py-1 text-xs font-semibold text-bark-700 dark:border-bark-700 dark:bg-bark-800 dark:text-bark-200">
              {total} plants • Updated {formattedUpdatedAt}
            </span>
          </div>

          <p className="section-subheading max-w-2xl">
            Public plant catalog API for AI design tools, landscape architects, and developers.
            Use this JSON data with Copilot, ChatGPT, or any tool to generate planting designs
            based on Grounded&apos;s specific cultivar list.
          </p>

          {/* API Access Section */}
          <section className="mt-10 rounded-2xl border border-primary-200 bg-gradient-to-br from-primary-50 via-white to-earth-50 p-6 shadow-sm dark:border-primary-800 dark:from-bark-900 dark:via-bark-900 dark:to-bark-800">
            <h2 className="text-xl font-semibold text-bark-900 dark:text-white">API Access</h2>
            <p className="mt-2 text-bark-600 dark:text-bark-300">
              Share this endpoint with AI agents or fetch it directly for your own tools.
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href="/api/plants.json"
                className="btn-primary"
                target="_blank"
                rel="noreferrer"
              >
                Open API Endpoint
              </a>
              <CatalogCopyLink path="/api/plants.json" className="btn-outline" />
            </div>

            <div className="mt-4 rounded-lg border border-bark-200 bg-white p-4 font-mono text-sm text-bark-700 dark:border-bark-700 dark:bg-bark-900 dark:text-bark-200">
              https://grounded-landscaping.vercel.app/api/plants.json
            </div>
          </section>

          {/* Usage Examples */}
          <section className="mt-10">
            <h2 className="text-lg font-semibold text-bark-900 dark:text-white mb-4">
              Use With AI
            </h2>

            <div className="space-y-4">
              <div className="rounded-lg border border-bark-200 bg-bark-50 p-4 dark:border-bark-700 dark:bg-bark-800">
                <p className="font-semibold text-bark-900 dark:text-white">Copilot, ChatGPT, Claude</p>
                <p className="mt-2 text-sm text-bark-600 dark:text-bark-300">
                  "Use this plant catalog only: https://grounded-landscaping.vercel.app/api/plants.json. 
                  Create a pollinator garden with native shrubs and perennials. List exact cultivars from the catalog."
                </p>
              </div>

              <div className="rounded-lg border border-bark-200 bg-bark-50 p-4 dark:border-bark-700 dark:bg-bark-800">
                <p className="font-semibold text-bark-900 dark:text-white">Programmatic Access</p>
                <p className="mt-2 text-sm text-bark-600 dark:text-bark-300">
                  Fetch JSON and parse by plantType, sunExposure, waterNeeds, tags, or search text.
                </p>
                <pre className="mt-3 overflow-x-auto rounded bg-bark-900 p-3 text-xs text-bark-50 dark:bg-bark-950">
                  {`fetch('https://grounded-landscaping.vercel.app/api/plants.json')
  .then(r => r.json())
  .then(data => console.log(data.items))`}
                </pre>
              </div>
            </div>
          </section>

          {/* Catalog Overview */}
          <section className="mt-10">
            <h2 className="text-lg font-semibold text-bark-900 dark:text-white mb-4">
              Catalog Breakdown
            </h2>

            <div className="overflow-hidden rounded-lg border border-bark-200 dark:border-bark-700">
              <div className="grid grid-cols-2 bg-bark-50 text-bark-700 dark:bg-bark-800 dark:text-bark-200">
                <div className="px-4 py-3 font-semibold">Category</div>
                <div className="px-4 py-3 font-semibold text-right">Count</div>
              </div>
              {files.map(([fileName, count]) => (
                <div
                  key={fileName}
                  className="grid grid-cols-2 border-t border-bark-200 text-sm dark:border-bark-700"
                >
                  <div className="px-4 py-3 text-bark-900 dark:text-bark-100">
                    {fileName.replace('plants-', '').replace('.json', '')}
                  </div>
                  <div className="px-4 py-3 text-right text-bark-700 dark:text-bark-300 font-semibold">
                    {count}
                  </div>
                </div>
              ))}
              <div className="grid grid-cols-2 border-t-2 border-primary-300 bg-primary-50 text-bark-900 dark:border-primary-700 dark:bg-primary-900/20 dark:text-white">
                <div className="px-4 py-3 font-semibold">Total</div>
                <div className="px-4 py-3 text-right font-bold">{total}</div>
              </div>
            </div>
          </section>

          {/* Data Schema */}
          <section className="mt-10">
            <h2 className="text-lg font-semibold text-bark-900 dark:text-white mb-4">
              Data Schema
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-lg border border-bark-200 bg-bark-50 p-4 dark:border-bark-700 dark:bg-bark-800">
                <p className="font-semibold text-bark-900 dark:text-white text-sm">Root Fields</p>
                <ul className="mt-3 space-y-1 text-xs text-bark-700 dark:text-bark-300">
                  <li>• <span className="font-mono">generatedAt</span></li>
                  <li>• <span className="font-mono">total</span></li>
                  <li>• <span className="font-mono">byFile</span></li>
                  <li>• <span className="font-mono">items[]</span></li>
                </ul>
              </div>

              <div className="rounded-lg border border-bark-200 bg-bark-50 p-4 dark:border-bark-700 dark:bg-bark-800">
                <p className="font-semibold text-bark-900 dark:text-white text-sm">Item Properties</p>
                <ul className="mt-3 space-y-1 text-xs text-bark-700 dark:text-bark-300">
                  <li>• <span className="font-mono">commonName, scientificName, cultivar</span></li>
                  <li>• <span className="font-mono">plantType, category, tags</span></li>
                  <li>• <span className="font-mono">sunExposure, waterNeeds, soilType</span></li>
                  <li>• <span className="font-mono">matureHeight/Spread, growthRate</span></li>
                  <li>• <span className="font-mono">flowerColor, foliageColor, fallColor</span></li>
                  <li>• <span className="font-mono">bloomSeason, designUses, notes</span></li>
                </ul>
              </div>
            </div>
          </section>

          {/* Footer CTA */}
          <div className="mt-12 rounded-xl border border-earth-300 bg-gradient-to-r from-earth-50 to-primary-50 p-6 dark:border-earth-800 dark:from-bark-800 dark:to-primary-900/20">
            <h3 className="text-lg font-semibold text-bark-900 dark:text-white">Ready to design?</h3>
            <p className="mt-2 text-sm text-bark-600 dark:text-bark-300">
              Copy the API link and share it with your preferred AI tool to start generating landscape designs
              based on this catalog.
            </p>
            <div className="mt-4">
              <CatalogCopyLink path="/api/plants.json" className="btn-primary" />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
