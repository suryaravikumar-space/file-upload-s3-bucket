// s3Service.js
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

export const s3Uploadv3 = async (files) => {
  const s3client = new S3Client();

  const params = files.map((file) => ({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `uploads/${uuidv4()}-${file.originalname}`,
    Body: file.buffer,
  }));

  return await Promise.all(
    params.map((param) => s3client.send(new PutObjectCommand(param)))
  );
};
