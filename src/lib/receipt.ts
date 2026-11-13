import { readFile } from "fs/promises";
import path from "path";
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";

const INK = rgb(0.08, 0.08, 0.08);

// The organization's own branded receipt template, used as the exact page
// background — donor-specific values are overlaid on top of it at the
// coordinates of each blank line, rather than redrawn from scratch, so the
// output matches the uploaded design exactly.
const TEMPLATE_PATH = "public/brand/donation-receipt-template.png";
const TEMPLATE_PX_W = 1024;
const TEMPLATE_PX_H = 1536;
const PAGE_W = 612; // pt — Letter width; height follows the template's aspect ratio
const SCALE = PAGE_W / TEMPLATE_PX_W;
const PAGE_H = TEMPLATE_PX_H * SCALE;

export type DonationReceiptData = {
  receiptNumber: string;
  donationDate: string;
  donorName: string;
  donorEmail: string;
  amountLabel: string;
  designation: string;
  paymentMethod: string;
  transactionId: string;
};

/** Converts a coordinate measured on the template image (top-left origin,
 * pixels) into PDF point space (bottom-left origin). */
function toPdf(px: number, py: number): [number, number] {
  return [px * SCALE, PAGE_H - py * SCALE];
}

function drawValue(
  page: PDFPage,
  font: PDFFont,
  text: string,
  px: number,
  py: number,
  opts: { size?: number; minSize?: number; maxWidthPx?: number } = {}
) {
  const baseSize = opts.size ?? 13;
  const minSize = opts.minSize ?? 7;
  let size = baseSize;
  let displayText = text;

  if (opts.maxWidthPx) {
    const maxWidthPt = opts.maxWidthPx * SCALE;
    // Shrink the font first so real data isn't cut short — only truncate
    // with an ellipsis if it still doesn't fit at the smallest readable size.
    while (size > minSize && font.widthOfTextAtSize(displayText, size) > maxWidthPt) {
      size -= 0.5;
    }
    while (displayText.length > 3 && font.widthOfTextAtSize(displayText, size) > maxWidthPt) {
      displayText = displayText.slice(0, -1);
    }
    if (displayText !== text) displayText = `${displayText.slice(0, -1)}…`;
  }

  const [x, y] = toPdf(px, py);
  page.drawText(displayText, { x, y, size, font, color: INK });
}

/**
 * Generates the donor-facing tax receipt as a PDF, using the organization's
 * own branded template image as the page background with donor-specific
 * values overlaid into each blank field.
 */
export async function generateDonationReceiptPdf(data: DonationReceiptData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.setTitle("Stellar Sports Academy Donation Receipt");
  const page = pdfDoc.addPage([PAGE_W, PAGE_H]);

  const templateBytes = await readFile(path.join(process.cwd(), TEMPLATE_PATH));
  const templateImage = await pdfDoc.embedPng(templateBytes);
  page.drawImage(templateImage, { x: 0, y: 0, width: PAGE_W, height: PAGE_H });

  const regular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // "Dear ______," on the thank-you letter
  drawValue(page, regular, data.donorName, 95, 512, { size: 13, maxWidthPx: 235 });

  // Donation Receipt box (right column)
  drawValue(page, regular, data.receiptNumber, 795, 448, { size: 12, maxWidthPx: 165 });
  drawValue(page, regular, data.donationDate, 815, 512, { size: 12, maxWidthPx: 150 });
  drawValue(page, regular, data.donorName, 795, 572, { size: 12, maxWidthPx: 170 });
  drawValue(page, regular, data.donorEmail, 782, 632, { size: 11, minSize: 7, maxWidthPx: 195 });
  drawValue(page, bold, data.amountLabel.replace(/^\$/, ""), 715, 785, { size: 20, maxWidthPx: 240 });
  drawValue(page, regular, data.designation, 875, 867, { size: 10, minSize: 7, maxWidthPx: 100 });
  drawValue(page, regular, data.paymentMethod, 850, 927, { size: 10, maxWidthPx: 115 });
  drawValue(page, regular, data.transactionId, 830, 987, { size: 9, minSize: 6, maxWidthPx: 148 });

  return pdfDoc.save();
}
