import { PrismaClient } from '@prisma/client'
import { getServerSession } from '#auth'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  const { id } = event.context.params
  const body = await readBody(event)

  if (!session?.user?.id) {
    throw createError({ statusCode: 401, message: 'Не авторизован' })
  }

  const post = await prisma.journalPost.findUnique({
    where: { id },
    include: {
      journal: {
        select: { userId: true }
      }
    }
  })

  if (!post) {
    throw createError({ statusCode: 404, message: 'Пост не найден' })
  }

  const isOwner = post.journal.userId === session.user.id
  const isAdmin = session.user.role === 'admin'

  if (!isOwner && !isAdmin) {
    throw createError({ statusCode: 403, message: 'Нет доступа к посту' })
  }

  const updated = await prisma.journalPost.update({
    where: { id },
    data: {
      title: body.title,
      content: body.content,
    }
  })

  // Обновим дату последнего изменения у дневника
  await prisma.journal.update({
    where: { id: post.journalId },
    data: { updated_at: new Date() }
  })

  return updated
})
