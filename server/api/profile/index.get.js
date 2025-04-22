import { getServerSession } from '#auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)

  if (!session?.user?.id) {
    throw createError({ statusCode: 401, message: 'Не авторизован' })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      created_at: true,
      role: true,
      journals: {
        select: { id: true } // Просто считаем количество
      }
    }
  })

  if (!user) {
    throw createError({ statusCode: 404, message: 'Пользователь не найден' })
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    created_at: user.created_at,
    role: user.role,
    journalCount: user.journals.length
  }
})
