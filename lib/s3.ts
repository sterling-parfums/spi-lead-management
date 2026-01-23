import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { scaleImage } from "./image";

type UploadResult = {
  file: File;
  url: string;
  key: string;
};

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const bucket = process.env.AWS_S3_BUCKET!;

export async function uploadImagesToS3(
  files: File[],
  prefix: string,
): Promise<UploadResult[]> {
  const timestamp = formatTimestamp(new Date());

  const uploads = files.map(async (file) => {
    const key = `${prefix}_${timestamp}_${file.name}`;

    const body = Buffer.from(await file.arrayBuffer());

    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body,
        ContentType: file.type,
      }),
    );

    return {
      file,
      key,
      url: `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
    };
  });

  return Promise.all(uploads);
}

function formatTimestamp(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    date.getFullYear().toString() +
    pad(date.getMonth() + 1) +
    pad(date.getDate()) +
    pad(date.getHours()) +
    pad(date.getMinutes()) +
    pad(date.getSeconds())
  );
}
