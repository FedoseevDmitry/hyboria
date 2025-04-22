import { PrismaClient } from '@prisma/client'
import { getServerSession } from '#auth'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const { slug } = event.context.params
  const session = await getServerSession(event)

  const journal = await prisma.journal.findUnique({
    where: { slug },
    include: {
      posts: {
        orderBy: { created_at: 'desc' }
      },
      user: {
        select: {
          id: true,
          name: true,
          image: true, // ✅ вот он!
          email: true
        }
      }      
    }
  })

  if (!journal) {
    throw createError({ statusCode: 404, message: 'Дневник не найден' })
  }

  // Проверка доступа к неопубликованному дневнику
  const isOwner = session?.user?.email === journal.user.email
  const isAdmin = session?.user?.isAdmin // если будешь реализовывать роли
  if (!journal.isPublished && !isOwner && !isAdmin) {
    throw createError({ statusCode: 403, message: 'Доступ запрещён' })
  }

  return journal
})
