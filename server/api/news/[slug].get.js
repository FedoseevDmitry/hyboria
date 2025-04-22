// server/api/news/[slug].get.js
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const { slug } = event.context.params

  const news = await prisma.news.findUnique({
    where: { slug }
  })

  if (!news) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Новость не найдена'
    })
  }

  return news
})
