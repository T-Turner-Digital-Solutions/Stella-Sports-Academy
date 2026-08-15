import { readFile } from "fs/promises";
import path from "path";
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import { site } from "@/content/site";

const RED = rgb(0.831, 0, 0); // #d40000 — brand red
const INK = rgb(0.11, 0.11, 0.11);
const INK_SOFT = rgb(0.4, 0.4, 0.4);
const PAGE_W = 612; // US Letter, points
const PAGE_H = 792;
const MARGIN = 60;
const CONTENT_W = PAGE_W - MARGIN * 2;

const ORG_LEGAL_NAME = "Stellar Sports Academy, Inc.";
const TAGLINE = "Empowering Young Athletes. Building Champions for Life.";
const GOODS_SERVICES_STATEMENT = "No goods or services were provided in exchange for this contribution.";

export type DonationReceiptData = {
  receiptNumber: string;
  donationDate: string;
  donorName: string;
  amountLabel: string;
  designation: string;
};

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (line && font.widthOfTextAtSize(candidate, size) > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function centeredText(page: PDFPage, text: string, y: number, font: PDFFont, size: number, color = INK) {
  const width = font.widthOfTextAtSize(text, size);
  page.drawText(text, { x: (PAGE_W - width) / 2, y, size, font, color });
}

/**
 * Generates the donor-facing tax receipt as a single-page PDF letter,
 * matching the exact wording supplied by the organization. A faded copy of
 * the brand mark sits behind the text as a watermark.
 */
export async function generateDonationReceiptPdf(data: DonationReceiptData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.setTitle(`${ORG_LEGAL_NAME} Donation Receipt`);
  const page = pdfDoc.addPage([PAGE_W, PAGE_H]);

  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const regular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const italic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  // Watermark — faded brand mark centered behind the letter.
  const logoBytes = await readFile(path.join(process.cwd(), "public/brand/stella-mark-red.png"));
  const logoImage = await pdfDoc.embedPng(logoBytes);
  const watermarkHeight = 420;
  const watermarkWidth = logoImage.width * (watermarkHeight / logoImage.height);
  page.drawImage(logoImage, {
    x: (PAGE_W - watermarkWidth) / 2,
    y: (PAGE_H - watermarkHeight) / 2,
    width: watermarkWidth,
    height: watermarkHeight,
    opacity: 0.06,
  });

  let y = PAGE_H - MARGIN;

  // --- Letterhead ---
  centeredText(page, "STELLAR SPORTS ACADEMY, INC.", y, bold, 19, INK);
  y -= 18;
  centeredText(page, TAGLINE, y, italic, 10, INK_SOFT);
  y -= 22;
  centeredText(page, `EIN: ${site.ein}`, y, bold, 10.5, RED);
  y -= 14;
  centeredText(page, "501(c)(3) Nonprofit Organization", y, regular, 10, INK_SOFT);
  y -= 16;

  page.drawLine({ start: { x: MARGIN, y }, end: { x: PAGE_W - MARGIN, y }, thickness: 1.5, color: RED });
  y -= 30;

  centeredText(page, "THANK YOU FOR YOUR GENEROUS SUPPORT", y, bold, 14, RED);
  y -= 30;

  // --- Receipt fields ---
  const fields: [string, string][] = [
    ["Donation Receipt #", data.receiptNumber],
    ["Donation Date", data.donationDate],
    ["Donor Name", data.donorName],
    ["Donation Amount", data.amountLabel],
    ["Donation Designation", data.designation],
  ];
  for (const [label, value] of fields) {
    page.drawText(`${label}:`, { x: MARGIN, y, size: 10.5, font: bold, color: INK });
    const labelWidth = bold.widthOfTextAtSize(`${label}: `, 10.5);
    page.drawText(value, { x: MARGIN + labelWidth, y, size: 10.5, font: regular, color: INK });
    y -= 17;
  }
  y -= 14;

  page.drawText(`Dear ${data.donorName},`, { x: MARGIN, y, size: 10.5, font: regular, color: INK });
  y -= 20;

  const paragraphs = [
    `On behalf of ${ORG_LEGAL_NAME}, thank you for your generous contribution of ${data.amountLabel}.`,
    "Your support helps us continue our mission of empowering young athletes through athletic development, educational support, mentorship, leadership development, and life-skills programs that prepare young people for success on the field, in the classroom, and in life.",
    `Every contribution helps Stellar Sports Academy create opportunities for young athletes and provide the resources, guidance, and support they need to reach their full potential.`,
  ];
  for (const paragraph of paragraphs) {
    for (const line of wrapText(paragraph, regular, 10.5, CONTENT_W)) {
      page.drawText(line, { x: MARGIN, y, size: 10.5, font: regular, color: INK });
      y -= 15;
    }
    y -= 8;
  }

  y -= 6;
  centeredText(page, "FOR YOUR TAX RECORDS", y, bold, 12, RED);
  y -= 22;

  const taxParagraph =
    `${ORG_LEGAL_NAME} is recognized as a tax-exempt organization under Section 501(c)(3) of the Internal Revenue Code.`;
  for (const line of wrapText(taxParagraph, regular, 10, CONTENT_W)) {
    page.drawText(line, { x: MARGIN, y, size: 10, font: regular, color: INK });
    y -= 14;
  }
  y -= 8;

  const taxFields: [string, string][] = [
    ["Federal EIN", site.ein],
    ["Contribution Amount", data.amountLabel],
    ["Contribution Date", data.donationDate],
  ];
  for (const [label, value] of taxFields) {
    page.drawText(`${label}:`, { x: MARGIN, y, size: 10, font: bold, color: INK });
    const labelWidth = bold.widthOfTextAtSize(`${label}: `, 10);
    page.drawText(value, { x: MARGIN + labelWidth, y, size: 10, font: regular, color: INK });
    y -= 15;
  }
  y -= 6;

  page.drawText(GOODS_SERVICES_STATEMENT, { x: MARGIN, y, size: 10, font: italic, color: INK });
  y -= 24;

  const disclaimer =
    "Please retain this acknowledgment with your tax records. The deductibility of charitable contributions depends on individual circumstances, and donors should consult their tax professional regarding their specific situation.";
  for (const line of wrapText(disclaimer, regular, 9, CONTENT_W)) {
    page.drawText(line, { x: MARGIN, y, size: 9, font: regular, color: INK_SOFT });
    y -= 13;
  }
  y -= 16;

  for (const line of wrapText(
    "Thank you for believing in our athletes, our mission, and the future we are building together.",
    regular,
    10.5,
    CONTENT_W
  )) {
    page.drawText(line, { x: MARGIN, y, size: 10.5, font: regular, color: INK });
    y -= 15;
  }
  y -= 14;

  page.drawText("With sincere appreciation,", { x: MARGIN, y, size: 10.5, font: italic, color: RED });
  y -= 18;
  page.drawText(ORG_LEGAL_NAME, { x: MARGIN, y, size: 11, font: bold, color: INK });
  y -= 14;
  page.drawText(TAGLINE, { x: MARGIN, y, size: 9, font: italic, color: INK_SOFT });

  return pdfDoc.save();
}
