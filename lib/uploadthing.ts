import { createUploadthing } from "uploadthing/next";
import { prisma } from "@/lib/prisma";

const f = createUploadthing();

export const uploadRouter = {
  galleryImage: f({ image: { maxFileSize: "4MB" } }).onUploadComplete(
    async ({ file }) => {
      const newImage = await prisma.galleryImage.create({
        data: {
          url: file.url,
          name: file.name,
        },
      });
      console.log("Gallery image uploaded:", newImage);
      return { uploadedBy: "admin", url: file.url };
    }
  ),
  schoolDocument: f({
    pdf: { maxFileSize: "16MB" },
    "application/msword": { maxFileSize: "16MB" },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": { maxFileSize: "16MB" },
    "application/vnd.ms-excel": { maxFileSize: "16MB" },
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": { maxFileSize: "16MB" },
  }).onUploadComplete(async ({ file }) => {
    const newDocument = await prisma.schoolDocument.create({
      data: {
        url: file.url,
        name: file.name,
      },
    });
    console.log("School document uploaded:", newDocument);
    return { uploadedBy: "admin", url: file.url };
  }),
};

export type FileRouter = typeof uploadRouter;
