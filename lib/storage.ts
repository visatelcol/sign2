
import fs from "fs/promises";
import path from "path";

export const uploadsDir = path.join(process.cwd(), "uploads");
export const signedDir = path.join(process.cwd(), "signed");

export function metaPath(token: string) {
  return path.join(uploadsDir, `${token}.json`);
}
export function pdfPath(token: string) {
  return path.join(uploadsDir, `${token}.pdf`);
}
export function signedPdfPath(token: string) {
  return path.join(signedDir, `${token}-signed.pdf`);
}

export async function readMeta(token: string) {
  const raw = await fs.readFile(metaPath(token), "utf8");
  return JSON.parse(raw);
}
export async function writeMeta(token: string, meta: any) {
  await fs.mkdir(uploadsDir, { recursive: true });
  await fs.writeFile(metaPath(token), JSON.stringify(meta, null, 2));
}
