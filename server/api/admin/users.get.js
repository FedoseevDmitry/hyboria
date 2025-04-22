// server/api/admin/users.get.js
import { getServerSession } from '#auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  if (!session || session.user.role !== 'admin') {
    throw createError({ statusCode: 403, message: 'Недостаточно прав' })
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      created_at: true,
      role: true,
      canCreateJournals: true,
    },
    orderBy: { created_at: 'desc' }
  })

  return users
})
