
import { NextResponse } from "next/server";
import fs from "fs/promises";
import { readMeta, pdfPath, signedDir, signedPdfPath } from "@/lib/storage";
import { stampSignature } from "@/lib/signPdf";

function dataUrlToBytes(dataUrl: string) {
  const base64 = dataUrl.split(",")[1];
  return Uint8Array.from(Buffer.from(base64, "base64"));
}

export async function POST(req: Request, { params }: { params: { token: string } }) {
  const { dataUrl } = await req.json();
  const meta = await readMeta(params.token);
  const pdfBytes = new Uint8Array(await fs.readFile(pdfPath(params.token)));
  const sigBytes = dataUrlToBytes(dataUrl);

  const stamped = await stampSignature({
    pdfBytes,
    signaturePngBytes: sigBytes,
    signX: meta.signX,
    signY: meta.signY,
    signW: meta.signW,
  });

  await fs.mkdir(signedDir, { recursive: true });
  await fs.writeFile(signedPdfPath(params.token), Buffer.from(stamped));
  return NextResponse.json({ ok: true });
}
