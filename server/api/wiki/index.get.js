import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(() =>
  prisma.wikiArticle.findMany({
    orderBy: { created_at: 'desc' }
  })
)
