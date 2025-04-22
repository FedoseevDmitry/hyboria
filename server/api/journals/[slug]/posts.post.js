import { PrismaClient } from '@prisma/client'
import { getServerSession } from '#auth'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  const slug = event.context.params.slug

  if (!session?.user?.id) {
    throw createError({ statusCode: 401, message: 'Не авторизован' })
  }

  const journal = await prisma.journal.findUnique({
    where: { slug },
    select: { id: true, userId: true }
  })

  if (!journal) {
    throw createError({ statusCode: 404, message: 'Дневник не найден' })
  }

  // Только владелец может добавлять посты
  if (journal.userId !== session.user.id) {
    throw createError({ statusCode: 403, message: 'Нет доступа к дневнику' })
  }

  const body = await readBody(event)

  if (!body.title || !body.content) {
    throw createError({ statusCode: 400, message: 'Требуется заголовок и контент' })
  }

  const post = await prisma.journalPost.create({
    data: {
      journalId: journal.id,
      title: body.title,
      content: body.content,
      image: body.image || null
    }
  })

  return post
})
