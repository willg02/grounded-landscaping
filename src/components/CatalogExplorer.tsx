'use client'

import { useMemo, useState } from 'react'

type CatalogItem = {
  commonName?: string
  scientificName?: string
  cultivar?: string | null
  plantType?: string
  sunExposure?: string[]
  waterNeeds?: string
  tags?: string[]
}

type CatalogExplorerProps = {
  items: CatalogItem[]
}

const pageSize = 50

export default function CatalogExplorer({ items }: CatalogExplorerProps) {
  const [query, setQuery] = useState('')
  const [plantType, setPlantType] = useState('all')
  const [sunExposure, setSunExposure] = useState('all')
  const [waterNeeds, setWaterNeeds] = useState('all')
  const [visibleCount, setVisibleCount] = useState(pageSize)

  const normalizedQuery = query.trim().toLowerCase()

  const filters = useMemo(() => {
    const plantTypes = new Set<string>()
    const sunOptions = new Set<string>()
    const waterOptions = new Set<string>()

    for (const item of items) {
      if (item.plantType) {
        plantTypes.add(item.plantType)
      }
      if (item.waterNeeds) {
        waterOptions.add(item.waterNeeds)
      }
      if (item.sunExposure) {
        for (const exposure of item.sunExposure) {
          sunOptions.add(exposure)
        }
      }
    }

    return {
      plantTypes: Array.from(plantTypes).sort(),
      sunOptions: Array.from(sunOptions).sort(),
      waterOptions: Array.from(waterOptions).sort(),
    }
  }, [items])

  const filteredItems = useMemo(() => {
    const result = items.filter((item) => {
      if (plantType !== 'all' && item.plantType !== plantType) {
        return false
      }
      if (sunExposure !== 'all' && !item.sunExposure?.includes(sunExposure)) {
        return false
      }
      if (waterNeeds !== 'all' && item.waterNeeds !== waterNeeds) {
        return false
      }
      if (!normalizedQuery) {
        return true
      }

      const haystack = [
        item.commonName,
        item.scientificName,
        item.cultivar ?? undefined,
        item.tags?.join(' '),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return haystack.includes(normalizedQuery)
    })

    return result
  }, [items, normalizedQuery, plantType, sunExposure, waterNeeds])

  const visibleItems = filteredItems.slice(0, visibleCount)

  return (
    <section className="mt-12">
      <div className="rounded-2xl border border-bark-200 bg-bark-50 p-6 shadow-sm dark:border-bark-700 dark:bg-bark-800">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[220px]">
            <label className="text-sm font-semibold text-bark-700 dark:text-bark-200">
              Search
            </label>
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setVisibleCount(pageSize)
              }}
              placeholder="Search by name, cultivar, or tag"
              className="input-field mt-2"
            />
          </div>

          <div className="min-w-[180px]">
            <label className="text-sm font-semibold text-bark-700 dark:text-bark-200">
              Plant Type
            </label>
            <select
              value={plantType}
              onChange={(event) => {
                setPlantType(event.target.value)
                setVisibleCount(pageSize)
              }}
              className="input-field mt-2"
            >
              <option value="all">All</option>
              {filters.plantTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="min-w-[180px]">
            <label className="text-sm font-semibold text-bark-700 dark:text-bark-200">
              Sun Exposure
            </label>
            <select
              value={sunExposure}
              onChange={(event) => {
                setSunExposure(event.target.value)
                setVisibleCount(pageSize)
              }}
              className="input-field mt-2"
            >
              <option value="all">All</option>
              {filters.sunOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="min-w-[180px]">
            <label className="text-sm font-semibold text-bark-700 dark:text-bark-200">
              Water Needs
            </label>
            <select
              value={waterNeeds}
              onChange={(event) => {
                setWaterNeeds(event.target.value)
                setVisibleCount(pageSize)
              }}
              className="input-field mt-2"
            >
              <option value="all">All</option>
              {filters.waterOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-bark-600 dark:text-bark-300">
          <span className="font-semibold text-bark-900 dark:text-white">
            {filteredItems.length} results
          </span>
          <span>Showing {visibleItems.length} of {filteredItems.length}</span>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {visibleItems.map((item, index) => (
          <div
            key={`${item.commonName ?? 'plant'}-${index}`}
            className="rounded-xl border border-bark-200 bg-white p-4 shadow-sm dark:border-bark-700 dark:bg-bark-900"
          >
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold text-bark-900 dark:text-white">
                {item.commonName ?? 'Unnamed Plant'}
              </h3>
              {item.cultivar ? (
                <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-800 dark:bg-primary-900/40 dark:text-primary-200">
                  {item.cultivar}
                </span>
              ) : null}
              {item.plantType ? (
                <span className="rounded-full bg-bark-100 px-3 py-1 text-xs font-semibold text-bark-700 dark:bg-bark-800 dark:text-bark-200">
                  {item.plantType}
                </span>
              ) : null}
            </div>
            <p className="mt-2 text-sm text-bark-600 dark:text-bark-300">
              {item.scientificName ?? 'Scientific name not listed'}
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-bark-600 dark:text-bark-300">
              {item.sunExposure?.length ? (
                <span>Sun: {item.sunExposure.join(', ')}</span>
              ) : null}
              {item.waterNeeds ? <span>Water: {item.waterNeeds}</span> : null}
              {item.tags?.length ? <span>Tags: {item.tags.join(', ')}</span> : null}
            </div>
          </div>
        ))}
      </div>

      {visibleItems.length < filteredItems.length ? (
        <div className="mt-6">
          <button
            className="btn-outline"
            type="button"
            onClick={() => setVisibleCount((count) => count + pageSize)}
          >
            Show more
          </button>
        </div>
      ) : null}
    </section>
  )
}
