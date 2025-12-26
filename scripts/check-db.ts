import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkData() {
  console.log('📊 データベースの内容を確認中...\n')

  const inquiriesCount = await prisma.inquiry.count()
  const customersCount = await prisma.customer.count()
  const projectsCount = await prisma.project.count()

  console.log('✅ データベース統計:')
  console.log(`   - Inquiries: ${inquiriesCount}件`)
  console.log(`   - Customers: ${customersCount}件`)
  console.log(`   - Projects: ${projectsCount}件`)
  console.log('')

  if (inquiriesCount > 0) {
    console.log('📬 最新の問い合わせ3件:')
    const recentInquiries = await prisma.inquiry.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
      select: {
        fullName: true,
        email: true,
        country: true,
        serviceType: true,
        createdAt: true,
      },
    })

    recentInquiries.forEach((inquiry, i) => {
      console.log(`\n   ${i + 1}. ${inquiry.fullName} (${inquiry.country || 'Local'})`)
      console.log(`      Email: ${inquiry.email}`)
      console.log(`      Service: ${inquiry.serviceType}`)
      console.log(`      Date: ${inquiry.createdAt.toLocaleString()}`)
    })
  }

  console.log('\n✅ データベースは正常に動作しています！')
}

checkData()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ エラー:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
