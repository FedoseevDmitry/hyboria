import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const slug = event.context.params.slug

  const journal = await prisma.journal.findUnique({
    where: { slug },
    select: { id: true }
  })

  if (!journal) {
    throw createError({ statusCode: 404, message: 'Дневник не найден' })
  }

  const posts = await prisma.journalPost.findMany({
    where: { journalId: journal.id },
    orderBy: { created_at: 'asc' }
  })

  return posts
})
