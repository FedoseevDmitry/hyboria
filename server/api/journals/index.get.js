import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async () => {
  const journals = await prisma.journal.findMany({
    where: { isPublished: true },
    select: {
      id: true,
      slug: true,
      characterName: true,
      description: true,
      image: true,
      created_at: true,
      updated_at: true,
    },
    orderBy: { updated_at: 'desc' },
  })

  return journals
})
