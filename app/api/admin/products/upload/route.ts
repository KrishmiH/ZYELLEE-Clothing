import { NextResponse } from "next/server";
import { Buffer } from "node:buffer";
import cloudinary from "@/lib/cloudinary";
import { isAdminAuthenticated } from "@/lib/admin-session";


const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_FILES = 5;

export async function POST(request: Request) {
  try {
    const authenticated = await isAdminAuthenticated();

    if (!authenticated) {
      return NextResponse.json(
        { message: "Unauthorized." },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const files = formData.getAll("images");

    if (files.length === 0) {
      return NextResponse.json(
        { message: "Please select at least one image." },
        { status: 400 }
      );
    }

    if (files.length > MAX_FILES) {
      return NextResponse.json(
        { message: "You can upload a maximum of 5 images at once." },
        { status: 400 }
      );
    }

    const uploadedImages = [];

    for (const file of files) {
      if (!(file instanceof File)) {
        return NextResponse.json(
          { message: "Invalid image file." },
          { status: 400 }
        );
      }

      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { message: "Only JPG, PNG, WEBP and AVIF images are allowed." },
          { status: 400 }
        );
      }

      if (file.size === 0 || file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { message: "Each image must be smaller than 5 MB." },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());

      const result = await new Promise<{
        secure_url: string;
        public_id: string;
      }>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: "zyellee/products",
            resource_type: "image",
          },
          (error, result) => {
            if (error || !result) {
              reject(error || new Error("Image upload failed."));
              return;
            }

            resolve({
              secure_url: result.secure_url,
              public_id: result.public_id,
            });
          }
        ).end(buffer);
      });

      uploadedImages.push({
        url: result.secure_url,
        publicId: result.public_id,
      });
    }

    return NextResponse.json(
      {
        message: "Images uploaded successfully!",
        images: uploadedImages,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Image upload error:", error);

    return NextResponse.json(
      { message: "Unable to upload images. Please try again." },
      { status: 500 }
    );
  }
}
