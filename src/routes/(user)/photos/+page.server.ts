import type { PageServerLoad } from "../$types";
import { error, fail } from "@sveltejs/kit";
import path from "path";
import { writeFile, readdir, unlink, access } from "fs/promises";
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const load:PageServerLoad  = async ({locals})=>{
  if(!locals.session.data.user) throw error(400);
  
  const files = await readdir('static/uploadedPhotos');

  return { photos:files};
}



export const actions = {
  uploadPhoto:async({request, locals})=>{
    if(!locals.session.data.user) return fail(400);
    // Parse the form data
    const formData = await request.formData();
    const photo = formData.get('photo') as File;

    // Check if a file was uploaded
    if (!photo || !photo.name) {
      return { success: false, error: 'No file uploaded' };
    }

    // Generate a unique filename and save path
    const filename = `${Date.now()}_${locals.session.data.user?.pg.nums}ch${locals.session.data.user?.pg.proms}_${photo.name}`;
    const savePath = path.join('static/uploadedPhotos', filename);

    // Convert the file into a buffer and save it
    const arrayBuffer = await photo.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await writeFile(savePath, buffer);
    // Return a success response
    return { success: true, filename };
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

    await deleteFile(photoSrc);
    return {success:true, photoSrc}
  }
}


async function deleteFile(photoSrc:string) {
  // Validate and sanitize the photoSrc input
  const sanitizedPhotoSrc = path.basename(photoSrc); // Remove directory paths
  const filePath = path.join('static', 'uploads', sanitizedPhotoSrc);

  try {
      // Check if the file exists before attempting to delete
      await access(filePath);
      
      // Delete the file
      await unlink(filePath);
  } catch (err) {
    if (err instanceof Error) {
        if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
            console.error('File not found:', filePath);
        } else {
            console.error('Error deleting file:', err);
        }
    }
  }
}