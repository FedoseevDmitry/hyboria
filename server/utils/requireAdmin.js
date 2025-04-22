import { getServerSession } from '#auth'

export async function requireAdmin(event) {
  const session = await getServerSession(event)

  if (!session?.user?.id) {
    throw createError({ statusCode: 401, message: 'Не авторизован' })
  }

  if (session.user.role !== 'admin') {
    throw createError({ statusCode: 403, message: 'Недостаточно прав' })
  }

  return session
}
