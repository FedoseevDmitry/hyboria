import formidable from 'formidable'
import fs from 'fs'
import path from 'path'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default defineEventHandler(async (event) => {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'images')
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
  const imageUrl = `/uploads/images/${fileName}`

  return { imageUrl }
})
