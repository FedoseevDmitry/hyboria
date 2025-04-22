import { PrismaClient } from '@prisma/client'
import { slugify } from './slugify.js'

const prisma = new PrismaClient()

export async function generateUniqueSlug(title) {
  const baseSlug = slugify(title)
  let slug = baseSlug
  let i = 1

  while (true) {
    const existing = await prisma.news.findUnique({ where: { slug } })
    if (!existing) break
    slug = `${baseSlug}-${i++}`
  }

  return slug
}
