
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const count = await prisma.project.count()
  console.log(`Project count: ${count}`)
  
  if (count > 0) {
    const projects = await prisma.project.findMany({ take: 3 })
    console.log('Sample projects:', JSON.stringify(projects, null, 2))
  }
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
