import { readFile } from "fs/promises";
import path from "path";
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import { site } from "@/content/site";

const RED = rgb(0.831, 0, 0); // #d40000 — brand red
const INK = rgb(0.11, 0.11, 0.11);
const INK_SOFT = rgb(0.4, 0.4, 0.4);
const WHITE = rgb(1, 1, 1);
const PAGE_W = 612; // US Letter, points
const PAGE_H = 792;
const MARGIN = 44;

/**
 * Contact details as they appear on the organization's own branded receipt
 * template (supplied directly by the client) — not placeholder data.
 */
const ORG = {
  legalName: "Stellar Sports Academy, Inc.",
  addressLines: ["P.O. Box 411", "Alabaster, AL 35007"],
  phone: "(205) 908-1254",
  website: "www.stellarsportsacademy.org",
  email: "info@stellarsportsacademy.org",
};

export type DonationReceiptData = {
  receiptNumber: string;
  donationDate: string;
  donorName: string;
  donorEmail: string;
  amountLabel: string;
  designation: string;
  paymentMethod: string;
  transactionId: string;
  monthly: boolean;
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

function centeredText(
  page: PDFPage,
  text: string,
  y: number,
  font: PDFFont,
  size: number,
  color = INK
) {
  const width = font.widthOfTextAtSize(text, size);
  page.drawText(text, { x: (PAGE_W - width) / 2, y, size, font, color });
}

export async function generateDonationReceiptPdf(data: DonationReceiptData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.setTitle(`${site.name} Donation Receipt`);
  const page = pdfDoc.addPage([PAGE_W, PAGE_H]);

  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const regular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const italic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  const logoBytes = await readFile(path.join(process.cwd(), "public/brand/stella-mark-red.png"));
  const logoImage = await pdfDoc.embedPng(logoBytes);
  const logoHeight = 56;
  const logoWidth = logoImage.width * (logoHeight / logoImage.height);

  let y = PAGE_H - MARGIN;

  // --- Header: logo + org name ---
  page.drawImage(logoImage, { x: MARGIN, y: y - logoHeight, width: logoWidth, height: logoHeight });

  const titleX = MARGIN + logoWidth + 16;
  const titleY = y - 24;
  page.drawText("STELLAR", { x: titleX, y: titleY, size: 24, font: bold, color: INK });
  const stellarWidth = bold.widthOfTextAtSize("STELLAR ", 24);
  page.drawText("SPORTS ACADEMY", { x: titleX + stellarWidth, y: titleY, size: 24, font: bold, color: RED });
  page.drawText("EMPOWERING YOUNG ATHLETES. BUILDING CHAMPIONS FOR LIFE.", {
    x: titleX,
    y: titleY - 16,
    size: 7.5,
    font: bold,
    color: INK_SOFT,
  });

  y -= logoHeight + 16;

  centeredText(page, "501(c)(3) Nonprofit Organization", y, regular, 10);
  y -= 15;
  centeredText(page, `Federal EIN: ${site.ein}`, y, bold, 11, RED);
  y -= 14;

  page.drawLine({ start: { x: MARGIN, y }, end: { x: PAGE_W - MARGIN, y }, thickness: 1.5, color: RED });
  y -= 28;

  // --- Two columns: thank-you letter (left) / receipt box (right) ---
  const colGap = 22;
  const leftColWidth = (PAGE_W - MARGIN * 2 - colGap) * 0.56;
  const rightColWidth = PAGE_W - MARGIN * 2 - colGap - leftColWidth;
  const rightColX = MARGIN + leftColWidth + colGap;
  const colTop = y;

  let leftY = colTop;
  page.drawText("Thank You", { x: MARGIN, y: leftY, size: 22, font: bold, color: RED });
  leftY -= 18;
  page.drawText("FOR YOUR GENEROUS SUPPORT!", { x: MARGIN, y: leftY, size: 10.5, font: bold, color: INK });
  leftY -= 26;

  page.drawText(`Dear ${data.donorName},`, { x: MARGIN, y: leftY, size: 10, font: regular, color: INK });
  leftY -= 20;

  const paragraphs = [
    `On behalf of ${ORG.legalName}, thank you for your generous contribution to support young athletes and our mission.`,
    "Your support helps us provide athletic training, academic support, mentorship, leadership development, and life-skills programs that empower young people to reach their full potential — on the field, in the classroom, and in life.",
    "Together, we are building a stronger future for our athletes and our community.",
  ];
  for (const paragraph of paragraphs) {
    for (const line of wrapText(paragraph, regular, 10, leftColWidth)) {
      page.drawText(line, { x: MARGIN, y: leftY, size: 10, font: regular, color: INK });
      leftY -= 14;
    }
    leftY -= 8;
  }

  leftY -= 8;
  page.drawText("With sincere appreciation,", { x: MARGIN, y: leftY, size: 11, font: italic, color: RED });
  leftY -= 16;
  page.drawText(ORG.legalName, { x: MARGIN, y: leftY, size: 11, font: bold, color: INK });
  const leftColBottom = leftY - 10;

  // Receipt box (right column)
  const headerH = 28;
  const boxPad = 14;
  const rowFields: [string, string][] = [
    ["Receipt Number", data.receiptNumber],
    ["Donation Date", data.donationDate],
  ];
  const rowFields2: [string, string][] = [
    ["Designation / Fund", data.designation],
    ["Payment Method", data.paymentMethod],
    ["Transaction ID", data.transactionId],
  ];

  let fieldY = colTop - headerH - 22;
  for (const [label, value] of rowFields) {
    page.drawText(`${label.toUpperCase()}`, { x: rightColX + boxPad, y: fieldY, size: 8, font: bold, color: INK_SOFT });
    fieldY -= 13;
    page.drawText(value, { x: rightColX + boxPad, y: fieldY, size: 10.5, font: regular, color: INK });
    fieldY -= 20;
  }
  page.drawText("DONOR", { x: rightColX + boxPad, y: fieldY, size: 8, font: bold, color: INK_SOFT });
  fieldY -= 13;
  page.drawText(data.donorName, { x: rightColX + boxPad, y: fieldY, size: 10.5, font: regular, color: INK });
  fieldY -= 13;
  page.drawText(data.donorEmail, { x: rightColX + boxPad, y: fieldY, size: 9, font: regular, color: INK_SOFT });
  fieldY -= 24;

  page.drawText(
    data.monthly ? "DONATION AMOUNT (MONTHLY)" : "DONATION AMOUNT",
    { x: rightColX + boxPad, y: fieldY, size: 9, font: bold, color: RED }
  );
  fieldY -= 24;
  page.drawRectangle({
    x: rightColX + boxPad,
    y: fieldY - 6,
    width: rightColWidth - boxPad * 2,
    height: 28,
    borderColor: RED,
    borderWidth: 1.5,
    color: WHITE,
  });
  page.drawText(data.amountLabel, { x: rightColX + boxPad + 10, y: fieldY + 2, size: 15, font: bold, color: INK });
  fieldY -= 44;

  for (const [label, value] of rowFields2) {
    page.drawText(label.toUpperCase(), { x: rightColX + boxPad, y: fieldY, size: 8, font: bold, color: INK_SOFT });
    fieldY -= 12;
    const lines = wrapText(value, regular, 9.5, rightColWidth - boxPad * 2);
    for (const line of lines) {
      page.drawText(line, { x: rightColX + boxPad, y: fieldY, size: 9.5, font: regular, color: INK });
      fieldY -= 12;
    }
    fieldY -= 8;
  }

  const boxBottom = fieldY - 4;
  const boxHeight = colTop - boxBottom;
  page.drawRectangle({
    x: rightColX,
    y: boxBottom,
    width: rightColWidth,
    height: boxHeight,
    borderColor: RED,
    borderWidth: 1.5,
  });
  page.drawRectangle({
    x: rightColX,
    y: colTop - headerH,
    width: rightColWidth,
    height: headerH,
    color: RED,
  });
  page.drawText("DONATION RECEIPT", {
    x: rightColX + boxPad,
    y: colTop - headerH + 9,
    size: 11.5,
    font: bold,
    color: WHITE,
  });

  y = Math.min(leftColBottom, boxBottom) - 22;

  // --- Bottom boxes: tax records / mission ---
  const bottomColWidth = (PAGE_W - MARGIN * 2 - colGap) / 2;
  const taxLines = [
    `${ORG.legalName} is recognized as a tax-exempt organization under Section 501(c)(3) of the`,
    "Internal Revenue Code.",
    "",
    `Federal EIN: ${site.ein}`,
    "",
    `No goods or services were provided by ${ORG.legalName} in exchange for this contribution.`,
  ];
  let taxY = y;
  page.drawText("FOR YOUR TAX RECORDS", { x: MARGIN, y: taxY, size: 10.5, font: bold, color: RED });
  taxY -= 16;
  for (const line of taxLines) {
    if (line === "") {
      taxY -= 6;
      continue;
    }
    const isEin = line.startsWith("Federal EIN");
    for (const wrapped of wrapText(line, regular, 8.5, bottomColWidth - 8)) {
      page.drawText(wrapped, {
        x: MARGIN,
        y: taxY,
        size: isEin ? 9.5 : 8.5,
        font: isEin ? bold : regular,
        color: isEin ? INK : INK_SOFT,
      });
      taxY -= 11;
    }
  }

  const missionColX = MARGIN + bottomColWidth + colGap;
  let missionY = y;
  page.drawText("OUR MISSION", { x: missionColX, y: missionY, size: 10.5, font: bold, color: RED });
  missionY -= 16;
  for (const line of wrapText(site.description, regular, 8.5, bottomColWidth - 8)) {
    page.drawText(line, { x: missionColX, y: missionY, size: 8.5, font: regular, color: INK_SOFT });
    missionY -= 11;
  }
  missionY -= 6;
  page.drawText("Thank you for making an impact!", { x: missionColX, y: missionY, size: 9.5, font: italic, color: RED });

  const disclaimerLines = [
    "Please retain this acknowledgement for your tax records. The deductibility of charitable",
    "contributions depends on individual circumstances. Please consult your tax professional",
    "regarding your specific situation.",
  ];
  let disclaimerY = Math.min(taxY, missionY) - 24;
  for (const line of disclaimerLines) {
    centeredText(page, line, disclaimerY, regular, 8, INK_SOFT);
    disclaimerY -= 11;
  }

  // --- Footer ---
  const footerH = 54;
  page.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: footerH, color: RED });
  centeredText(page, "THANK YOU FOR BELIEVING IN OUR ATHLETES AND OUR MISSION.", footerH - 16, bold, 9, WHITE);

  const footerCols = [
    [ORG.legalName, ...ORG.addressLines],
    [ORG.website, ORG.email],
    [ORG.phone, "Empowering Young Athletes."],
  ];
  const footerColWidth = (PAGE_W - MARGIN * 2) / 3;
  footerCols.forEach((lines, i) => {
    let fy = footerH - 30;
    for (const line of lines) {
      page.drawText(line, { x: MARGIN + i * footerColWidth, y: fy, size: 8, font: regular, color: WHITE });
      fy -= 10;
    }
  });

  return pdfDoc.save();
}
