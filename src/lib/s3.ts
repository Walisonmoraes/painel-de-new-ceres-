import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

const BUCKET_NAME = process.env.AWS_S3_BUCKET!

export async function uploadToS3(file: Buffer, fileName: string) {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: `visitas-comerciais/${fileName}`,
    Body: file,
    ContentType: "image/jpeg", // Ajuste conforme necessário
  })

  await s3Client.send(command)
  return `https://${BUCKET_NAME}.s3.amazonaws.com/visitas-comerciais/${fileName}`
}

export async function generatePresignedUrl(fileName: string) {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: `visitas-comerciais/${fileName}`,
    ContentType: "image/jpeg", // Ajuste conforme necessário
  })

  return await getSignedUrl(s3Client, command, { expiresIn: 3600 }) // URL válida por 1 hora
}
