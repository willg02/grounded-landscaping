const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@grounded.com' },
    update: {},
    create: {
      email: 'admin@grounded.com',
      password: hashedPassword,
      name: 'Admin User',
      phone: '(555) 123-4567',
      role: 'admin',
    },
  })

  console.log('✅ Created admin user:', admin.email)

  // Create default services
  const services = [
    {
      name: 'Demo & Removal',
      slug: 'demo',
      description: 'Professional removal of old landscaping, stumps, debris, and unwanted vegetation.',
      basePrice: 150,
      priceUnit: 'per_hour',
    },
    {
      name: 'Plant Installation',
      slug: 'plant-installation',
      description: 'Expert planting of trees, shrubs, flowers, and ornamental plants.',
      basePrice: 75,
      priceUnit: 'per_hour',
    },
    {
      name: 'Mulch & Ground Cover',
      slug: 'mulch',
      description: 'Quality mulch installation for healthier plants and beautiful beds.',
      basePrice: 85,
      priceUnit: 'per_yard',
    },
    {
      name: 'Basic Installation',
      slug: 'installation',
      description: 'Foundation landscaping, bed creation, and general installation services.',
      basePrice: 100,
      priceUnit: 'per_hour',
    },
  ]

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: service,
      create: service,
    })
  }

  console.log('✅ Created default services')

  console.log('🎉 Seeding complete!')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
