import { getServerSession } from '#auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)

  if (!session?.user?.id) {
    throw createError({ statusCode: 401, message: 'Не авторизован' })
  }

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true }
  })

  if (currentUser?.role !== 'admin') {
    throw createError({ statusCode: 403, message: 'Недостаточно прав' })
  }

  const userId = event.context.params.id
  const body = await readBody(event)

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      name: body.name,
      role: body.role,
      image: body.image,
      canCreateJournals: body.canCreateJournals
    }
  })

  return {
    success: true,
    user: {
      id: updatedUser.id,
      name: updatedUser.name,
      role: updatedUser.role,
      image: updatedUser.image
    }
  }
})
