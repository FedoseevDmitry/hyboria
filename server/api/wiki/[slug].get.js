import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const { slug } = event.context.params

  const article = await prisma.wikiArticle.findUnique({
    where: { slug }
  })

  if (!article) {
    throw createError({ statusCode: 404, message: 'Статья не найдена' })
  }

  return article
})
