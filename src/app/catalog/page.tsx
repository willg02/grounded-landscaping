import Link from 'next/link'
import CatalogCopyLink from '@/components/CatalogCopyLink'
import CatalogExplorer from '@/components/CatalogExplorer'
import { loadCatalog } from '@/lib/catalog'

export const metadata = {
  title: 'Plant Catalog | Grounded Landscaping',
  description: 'Public plant catalog for Grounded Landscaping.',
}

export default async function CatalogPage() {
  const { total, byFile, items, generatedAt } = await loadCatalog()
  const files = Object.entries(byFile)
  const formattedUpdatedAt = new Date(generatedAt).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  return (
    <main className="min-h-screen bg-white dark:bg-bark-900">
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="section-heading">Plant Catalog</h1>
            <span className="rounded-full border border-bark-200 bg-bark-50 px-3 py-1 text-xs font-semibold text-bark-700 dark:border-bark-700 dark:bg-bark-800 dark:text-bark-200">
              Last updated: {formattedUpdatedAt}
            </span>
          </div>
          <p className="section-subheading">
            This page hosts the public plant catalog for Grounded Landscaping.
            Share the JSON endpoint with AI tools to generate designs and
            advice based on this exact list.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/catalog.json" className="btn-primary">
              Open JSON Endpoint
            </Link>
            <CatalogCopyLink />
            <a
              href="/catalog.json"
              className="btn-outline"
              target="_blank"
              rel="noreferrer"
            >
              View in New Tab
            </a>
          </div>

          <div className="mt-10 card">
            <h2 className="text-xl font-semibold text-bark-900 dark:text-white">
              Catalog Summary
            </h2>
            <p className="mt-2 text-bark-600 dark:text-bark-300">
              Total plants: <span className="font-semibold">{total}</span>
            </p>

            <div className="mt-6 overflow-hidden rounded-lg border border-bark-200 dark:border-bark-700">
              <div className="grid grid-cols-2 bg-bark-50 text-bark-700 dark:bg-bark-800 dark:text-bark-200">
                <div className="px-4 py-2 text-sm font-semibold">File</div>
                <div className="px-4 py-2 text-sm font-semibold">Count</div>
              </div>
              {files.map(([fileName, count]) => (
                <div
                  key={fileName}
                  className="grid grid-cols-2 border-t border-bark-200 text-bark-700 dark:border-bark-700 dark:text-bark-200"
                >
                  <div className="px-4 py-2 text-sm">{fileName}</div>
                  <div className="px-4 py-2 text-sm">{count}</div>
                </div>
              ))}
            </div>
          </div>

          <CatalogExplorer items={items} />

          <section className="mt-12">
            <div className="rounded-2xl border border-primary-200 bg-gradient-to-br from-primary-50 via-white to-earth-50 p-6 shadow-sm dark:border-primary-800 dark:from-bark-900 dark:via-bark-900 dark:to-bark-800">
              <h2 className="text-xl font-semibold text-bark-900 dark:text-white">
                Use This Catalog With AI
              </h2>
              <p className="mt-2 text-bark-600 dark:text-bark-300">
                Share the JSON link and ask the agent to rely only on the
                catalog data. The endpoint returns total counts and a full list
                of plants.
              </p>

              <div className="mt-4 rounded-lg border border-bark-200 bg-white p-4 text-sm text-bark-700 dark:border-bark-700 dark:bg-bark-900 dark:text-bark-200">
                <p className="font-semibold">Example prompt</p>
                <p className="mt-2">
                  "Use this catalog only: https://YOUR-DOMAIN/catalog.json.
                  Create a foundation planting for full-sun with drought-tolerant
                  shrubs and perennials. List exact cultivars from the catalog."
                </p>
                <div className="mt-3">
                  <CatalogCopyLink className="btn-outline" />
                </div>
              </div>

              <div className="mt-4 text-sm text-bark-600 dark:text-bark-300">
                <p className="font-semibold text-bark-900 dark:text-white">What is in the JSON</p>
                <ul className="mt-2 list-disc pl-5">
                  <li>generatedAt, total, byFile, items</li>
                  <li>Each item includes names, sizes, sun, water, tags, and more</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
