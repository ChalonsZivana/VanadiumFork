import type { PageServerLoad } from "../$types";
import { error, fail, redirect } from "@sveltejs/kit";
import { S3Client, PutObjectCommand, ListObjectsV2Command, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { env } from '$env/dynamic/private';

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
     accessKeyId: env.R2_ACCESS_KEY,
     secretAccessKey: env.R2_SECRET_KEY
  }
});

export const load:PageServerLoad  = async ({locals})=>{
  if(!locals.session.data.user) throw error(400);

  const command = new ListObjectsV2Command({
      Bucket: env.R2_BUCKET_NAME
  });
  const response = await s3.send(command);

  const files = response.Contents?.map((item) => ({
         key: item.Key,
         lastModified: item.LastModified,
         size: item.Size,
         url: `${env.R2_PUBLIC_URL}/${item.Key}`
      })) || [];

  return { photos:files };
}


export const actions = {
  uploadPhoto:async({request, locals})=>{
    if(!locals.session.data.user) return fail(400);
    // Parse the form data
    const formData = await request.formData();
    const file = formData.get('photo') as File;

    // Check if a file was uploaded
    if (!file || !file.name) {
      return { success: false, error: 'No file uploaded' };
    }
    const buffer = Buffer.from(await file.arrayBuffer());

    const command = new PutObjectCommand({
      Bucket: env.R2_BUCKET_NAME,
      Key: `${Date.now()}_${locals.session.data.user.pg.nums}ch${locals.session.data.user.pg.proms}_${file.name}`,
      Body: buffer,
      ContentType: file.type
   });

   await s3.send(command);
   const url = `${env.R2_PUBLIC_URL}/${file.name}`;

   return { url };
  },
  deletePhoto:async({request, locals})=>{
    //2625=89cH223
    if(!locals.session.data.user || locals.session.data.user.pg.id_pg !== 2625) return fail(400);

    const formData = await request.formData();
    const photoSrc = formData.get('photoSrc') as string;

    // Check if a file was uploaded
    if (!photoSrc) {
      return { success: false, error: 'No file uploaded' };
    }

    const command = new DeleteObjectCommand({
      Bucket: env.R2_BUCKET_NAME,
      Key: photoSrc,
   });
   await s3.send(command);

    return {success:true, photoSrc}
  }
}