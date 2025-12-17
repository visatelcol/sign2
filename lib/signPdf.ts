
import { PDFDocument } from "pdf-lib";

export async function stampSignature({
  pdfBytes,
  signaturePngBytes,
  signX,
  signY,
  signW,
}: any) {
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const lastPage = pdfDoc.getPages().at(-1)!;
  const img = await pdfDoc.embedPng(signaturePngBytes);
  const h = (img.height / img.width) * signW;
  lastPage.drawImage(img, { x: signX, y: signY, width: signW, height: h });
  return await pdfDoc.save();
}
