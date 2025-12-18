import fs from "fs/promises";
import path from "path";

export type DocMeta = {
  token: string;
  status: "PENDING" | "SIGNED";
  createdAt: string;
  signedAt?: string;
  signX: number;
  signY: number;
  signW: number;
};

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

export async function writeMeta(meta: DocMeta) {
  await fs.mkdir(uploadsDir, { recursive: true });
  await fs.writeFile(metaPath(meta.token), JSON.stringify(meta, null, 2), "utf8");
}

export async function readMeta(token: string): Promise<DocMeta> {
  const raw = await fs.readFile(metaPath(token), "utf8");
  return JSON.parse(raw) as DocMeta;
}

export async function markSigned(token: string) {
  const meta = await readMeta(token);
  meta.status = "SIGNED";
  meta.signedAt = new Date().toISOString();
  await writeMeta(meta);
}
