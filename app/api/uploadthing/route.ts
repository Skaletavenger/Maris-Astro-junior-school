export const dynamic = "force-dynamic";
import { createRouteHandler } from "uploadthing/next";
import { uploadRouter } from "@/lib/uploadthing";

const handler = createRouteHandler({
  router: uploadRouter,
});

export const GET = handler.GET;
export const POST = handler.POST;