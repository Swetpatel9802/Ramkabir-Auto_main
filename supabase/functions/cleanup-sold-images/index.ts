// @ts-nocheck
// Supabase Edge Function: cleanup-sold-images
// Triggered by Database Webhook when tractors.status changes to 'sold' or 'partial_payment'
// Deletes associated Cloudinary images and clears DB columns

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CLOUDINARY_CLOUD_NAME = Deno.env.get("CLOUDINARY_CLOUD_NAME")!;
const CLOUDINARY_API_KEY = Deno.env.get("CLOUDINARY_API_KEY")!;
const CLOUDINARY_API_SECRET = Deno.env.get("CLOUDINARY_API_SECRET")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

interface WebhookPayload {
  type: "UPDATE";
  table: "tractors";
  schema: "public";
  record: Record<string, unknown>;
  old_record: Record<string, unknown>;
}

/**
 * Extract Cloudinary public_id from a secure URL.
 * URL format: https://res.cloudinary.com/{cloud}/image/upload/v12345/ramkabir-auto/inventory/Make_Model_Year/filename.jpg
 * public_id: ramkabir-auto/inventory/Make_Model_Year/filename
 */
function extractPublicId(url: string): string | null {
  try {
    const match = url.match(/\/upload\/(?:v\d+\/)?(.*?)(?:\.\w+)?$/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

/**
 * Delete a single image from Cloudinary using the Admin API
 */
async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  const timestamp = Math.floor(Date.now() / 1000);

  // Generate signature: "public_id={id}&timestamp={ts}" + api_secret
  const signatureString = `public_id=${publicId}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(signatureString);
  const hashBuffer = await crypto.subtle.digest("SHA-1", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const signature = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

  const formData = new FormData();
  formData.append("public_id", publicId);
  formData.append("timestamp", timestamp.toString());
  formData.append("api_key", CLOUDINARY_API_KEY);
  formData.append("signature", signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/destroy`,
    { method: "POST", body: formData }
  );

  const result = await response.json();
  console.log(`Delete ${publicId}: ${result.result}`);
  return result.result === "ok";
}

Deno.serve(async (req) => {
  try {
    const payload: WebhookPayload = await req.json();

    const oldStatus = payload.old_record?.status as string;
    const newStatus = payload.record?.status as string;

    // Only proceed if status changed TO sold or partial_payment
    if (
      oldStatus === newStatus ||
      !["sold", "partial_payment"].includes(newStatus)
    ) {
      return new Response(
        JSON.stringify({ message: "No cleanup needed", oldStatus, newStatus }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    const tractorId = payload.record.id as string;
    const images = (payload.old_record.images || payload.record.images) as string[] | null;

    if (!images || images.length === 0) {
      return new Response(
        JSON.stringify({ message: "No images to delete", tractorId }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log(`Cleaning up ${images.length} images for tractor ${tractorId}`);

    // Delete each image from Cloudinary
    const results = [];
    for (const url of images) {
      const publicId = extractPublicId(url);
      if (publicId) {
        const deleted = await deleteFromCloudinary(publicId);
        results.push({ url, publicId, deleted });
      } else {
        results.push({ url, publicId: null, deleted: false, error: "Could not extract public_id" });
      }
    }

    // Clear images and product_details in the database
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { error: dbError } = await supabase
      .from("tractors")
      .update({ images: [], product_details: {} })
      .eq("id", tractorId);

    if (dbError) {
      console.error("DB update failed:", dbError.message);
    }

    return new Response(
      JSON.stringify({
        message: `Cleanup complete for tractor ${tractorId}`,
        imagesProcessed: results.length,
        results,
        dbCleared: !dbError,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Edge function error:", error);
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
