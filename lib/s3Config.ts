import { S3Client } from "@aws-sdk/client-s3";

export const s3Client = new S3Client({
  region: process.env.EXPO_PUBLIC_S3_REGION as string,
  credentials: {
    accessKeyId: process.env.EXPO_PUBLIC_AWS_ACCESS_KEY as string,
    secretAccessKey: process.env.EXPO_PUBLIC_AWS_SECRET_KEY as string,
  },
});
