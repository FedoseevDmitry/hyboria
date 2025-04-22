import formidable from 'formidable'
import fs from 'fs'
import path from 'path'
import { getServerSession } from '#auth'
import prisma from '~/server/db/client'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  if (!session?.user) {
    throw createError({ statusCode: 401, message: 'Не авторизован' })
  }

  const slug = event.context.params.slug

  const journal = await prisma.journal.findUnique({
    where: { slug },
  })

  if (!journal || journal.userId !== session.user.id) {
    throw createError({ statusCode: 403, message: 'Нет доступа к дневнику' })
  }

  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'journals')
  fs.mkdirSync(uploadDir, { recursive: true })

  const form = formidable({
    multiples: false,
    uploadDir,
    keepExtensions: true,
    filename: (name, ext, part) => {
      const unique = `${Date.now()}-${Math.random().toString(16).slice(2)}`
      return `${unique}${path.extname(part.originalFilename)}`
    },
  })

  const [fields, files] = await new Promise((resolve, reject) => {
    form.parse(event.node.req, (err, fields, files) => {
      if (err) reject(err)
      else resolve([fields, files])
    })
  })

  const imageFile = files.image?.[0]
  if (!imageFile) {
    throw createError({ statusCode: 400, message: 'Файл не передан' })
  }

  const fileName = path.basename(imageFile.filepath)
  const imageUrl = `/uploads/journals/${fileName}`

  await prisma.journal.update({
    where: { slug },
    data: { image: imageUrl },
  })

  return { imageUrl }
})
