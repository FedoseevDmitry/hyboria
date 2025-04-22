import { getServerSession } from '#auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  if (!event.node.req.url.startsWith('/api/admin')) return

  const session = await getServerSession(event)

  if (!session?.user?.id) {
    throw createError({ statusCode: 401, message: 'Не авторизован' })
  }

  // Всегда получаем свежие данные пользователя
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, role: true, name: true, canCreateJournals: true }
  })

  if (!user || user.role !== 'admin') {
    throw createError({ statusCode: 403, message: 'Недостаточно прав' })
  }

  event.context.user = user
})
