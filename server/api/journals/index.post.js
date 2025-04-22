import { PrismaClient } from '@prisma/client'
import { getServerSession } from '#auth'
import slugify from 'slugify'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)

  if (!session?.user?.email) {
    throw createError({ statusCode: 401, message: 'Требуется авторизация' })
  }

  const body = await readBody(event)

  if (!body.characterName || !body.content) {
    throw createError({ statusCode: 400, message: 'Имя персонажа и контент обязательны' })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  if (!user) {
    throw createError({ statusCode: 404, message: 'Пользователь не найден' })
  }

  // Генерация уникального slug
  let baseSlug = slugify(body.characterName, { lower: true, strict: true })
  let slug = baseSlug
  let count = 1

  while (await prisma.journal.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${count++}`
  }

  const journal = await prisma.journal.create({
    data: {
      characterName: body.characterName,
      description: body.description || body.content.slice(0, 150),
      image: body.image || null,
      isPublished: body.isPublished ?? false,
      slug,
      userId: user.id,
      posts: {
        create: [
          {
            title: body.postTitle || 'Первая запись',
            content: body.content
          }
        ]
      }
    },
    include: { posts: true }
  })

  return journal
})
