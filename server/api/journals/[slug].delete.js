import { PrismaClient } from '@prisma/client'
import { getServerSession } from '#auth'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const { slug } = event.context.params
  const session = await getServerSession(event)

  if (!session?.user?.id) {
    throw createError({ statusCode: 401, message: 'Не авторизован' })
  }

  const journal = await prisma.journal.findUnique({
    where: { slug },
    include: { user: true }
  })

  if (!journal) {
    throw createError({ statusCode: 404, message: 'Дневник не найден' })
  }

  const isOwner = journal.userId === session.user.id
  const isAdmin = session.user.role === 'admin'

  if (!isOwner && !isAdmin) {
    throw createError({ statusCode: 403, message: 'Недостаточно прав' })
  }

  // Сначала удалим все посты
  await prisma.journalPost.deleteMany({
    where: { journalId: journal.id }
  })

  // Теперь сам дневник
  await prisma.journal.delete({
    where: { id: journal.id }
  })

  return { success: true }
})