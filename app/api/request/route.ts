import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { writeMeta, uploadsDir, pdfPath } from "@/lib/storage";

// Coordenadas (última página) para TUS PDFs
const COORDS = {
  AUTHORITY: { signX: 72, signY: 305, signW: 220 },
  OPERATING: { signX: 72, signY: 225, signW: 220 },
} as const;

export async function POST(req: Request) {
  const formData = await req.formData();

  const docType = String(formData.get("docType") || "AUTHORITY").toUpperCase();
  const file = formData.get("pdf") as File | null;

  if (!file) {
    return new NextResponse("Missing pdf file (field name: pdf)", { status: 400 });
  }
  if (file.type !== "application/pdf") {
    return new NextResponse("File must be a PDF", { status: 400 });
  }

  const token = crypto.randomBytes(16).toString("hex"); // 32 chars

  const coords =
    docType === "OPERATING" ? COORDS.OPERATING : COORDS.AUTHORITY;

  await fs.mkdir(uploadsDir, { recursive: true });

  const bytes = new Uint8Array(await file.arrayBuffer());
  await fs.writeFile(pdfPath(token), Buffer.from(bytes));

  await writeMeta({
    token,
    status: "PENDING",
    createdAt: new Date().toISOString(),
    ...coords,
  });

  const appUrl = process.env.APP_URL || "http://localhost:3000";
  const link = `${appUrl.replace(/\/$/, "")}/sign/${token}`;

  return NextResponse.json({ token, link, docType });
}
