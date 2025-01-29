// src/routes/api/get-image.ts
import { getImage } from "$lib/r2";
import { error, json } from "@sveltejs/kit";

export const GET = async ({ locals, url }) => {
  if (!locals.session.data.user) throw error(400);

  const key = url.searchParams.get("key");

  if (!key) {
    return json({
      status: 400,
      body: { error: "Missing image key" },
    });
  }

  const imageBuffer = await getImage(key);
  if (!imageBuffer) {
    return json({
      status: 404,
      body: { error: "Image not found" },
    });
  }

  return new Response(imageBuffer, {
    status: 200,
    headers: {
      "Content-Type": "image/jpeg", // Change based on your image type
      "Content-Length": imageBuffer.length.toString(),
    },
  });
};
