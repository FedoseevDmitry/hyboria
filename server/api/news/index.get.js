import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async () => {
  const news = await prisma.news.findMany({
    orderBy: { created_at: 'desc' },
    take: 6
  })
  return news
})
