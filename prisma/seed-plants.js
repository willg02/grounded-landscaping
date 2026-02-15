const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

// Load all plants-*.json files from the data directory
function loadAllPlants() {
  const dataDir = path.join(__dirname, 'data')
  const files = fs.readdirSync(dataDir).filter(f => f.startsWith('plants-') && f.endsWith('.json'))
  
  let allPlants = []
  for (const file of files) {
    const filePath = path.join(dataDir, file)
    const plants = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    console.log(`  📂 ${file} — ${plants.length} plants`)
    allPlants = allPlants.concat(plants)
  }
  return allPlants
}

async function seedPlants() {
  const plants = loadAllPlants()
  console.log(`\n🌿 Seeding ${plants.length} plants total...`)

  let created = 0
  let updated = 0
  let errors = 0

  for (const plant of plants) {
    try {
      // Build a unique lookup key
      const uniqueKey =
        plant.scientificName && plant.cultivar
          ? { scientificName_cultivar: { scientificName: plant.scientificName, cultivar: plant.cultivar } }
          : undefined

      // Normalise array fields to always be arrays
      const arrayFields = [
        'tags', 'sunExposure', 'soilType', 'flowerColor', 'foliageColor',
        'fallColor', 'bloomSeason', 'pollinators', 'wildlifeValue',
        'resistances', 'commonSizes', 'designUses',
      ]
      for (const field of arrayFields) {
        if (plant[field] && !Array.isArray(plant[field])) {
          plant[field] = [plant[field]]
        }
        if (!plant[field]) {
          plant[field] = []
        }
      }

      if (uniqueKey) {
        const result = await prisma.plant.upsert({
          where: uniqueKey,
          update: plant,
          create: plant,
        })
        updated++
      } else {
        // No unique key available — just create
        await prisma.plant.create({ data: plant })
        created++
      }
    } catch (err) {
      console.error(`  ❌ Error with "${plant.commonName}":`, err.message)
      errors++
    }
  }

  console.log(`✅ Plants seeded — created: ${created}, upserted: ${updated}, errors: ${errors}`)
}

// Allow running standalone or as import
if (require.main === module) {
  seedPlants()
    .catch((e) => {
      console.error('Fatal error seeding plants:', e)
      process.exit(1)
    })
    .finally(() => prisma.$disconnect())
} else {
  module.exports = { seedPlants }
}
