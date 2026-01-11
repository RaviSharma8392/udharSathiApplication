import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export async function generateTransactionPDF(customer, transactions) {
  if (!transactions || transactions.length === 0) return;

  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage([595, 842]); // A4
  const { width, height } = page.getSize();

  const margin = 40;
  let y = height - margin;
  const lineHeight = 16;

  const fontNormal = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  /* ================= UTIL ================= */
  const drawFooter = (page) => {
    page.drawLine({
      start: { x: margin, y: 30 },
      end: { x: width - margin, y: 30 },
      thickness: 0.5,
      color: rgb(0.85, 0.85, 0.85),
    });

    page.drawText("Download App: https://udharsathi.app", {
      x: margin,
      y: 18,
      size: 8,
      font: fontNormal,
      color: rgb(0.4, 0.4, 0.4),
    });

    page.drawText("Help: +91 99999 88888", {
      x: width / 2,
      y: 18,
      size: 8,
      font: fontNormal,
      color: rgb(0.4, 0.4, 0.4),
      align: "center",
    });

    page.drawText(" T&C Apply", {
      x: width - margin,
      y: 18,
      size: 8,
      font: fontNormal,
      color: rgb(0.4, 0.4, 0.4),
      align: "right",
    });
  };

  /* ================= TOP BLUE HEADER ================= */
  page.drawRectangle({
    x: 0,
    y: height - 70,
    width,
    height: 70,
    color: rgb(0.18, 0.35, 0.85),
  });

  page.drawText("UDHAR SATHI", {
    x: margin,
    y: height - 45,
    size: 18,
    font: fontBold,
    color: rgb(1, 1, 1),
  });

  page.drawText("Help: +91 99999 88888", {
    x: width - margin,
    y: height - 45,
    size: 10,
    font: fontNormal,
    color: rgb(1, 1, 1),
    align: "right",
  });

  y = height - 100;

  /* ================= CTA SECTION ================= */
  page.drawRectangle({
    x: margin,
    y: y - 30,
    width: width - margin * 2,
    height: 30,
    borderColor: rgb(0.18, 0.35, 0.85),
    borderWidth: 1,
  });

  page.drawText("Start using UdharSathi now – Install the app", {
    x: margin + 10,
    y: y - 20,
    size: 11,
    font: fontBold,
    color: rgb(0.18, 0.35, 0.85),
  });

  page.drawText("https://udharsathi.app", {
    x: width - margin - 10,
    y: y - 20,
    size: 10,
    font: fontNormal,
    color: rgb(0.18, 0.35, 0.85),
    align: "right",
  });

  y -= 50;

  /* ================= CUSTOMER INFO ================= */
  page.drawText("Customer Details", {
    x: margin,
    y,
    size: 12,
    font: fontBold,
  });

  y -= lineHeight;
  page.drawText(`Name: ${customer.name}`, { x: margin, y, size: 10, font: fontNormal });
  y -= lineHeight;
  page.drawText(`Phone: ${customer.phone}`, { x: margin, y, size: 10, font: fontNormal });
  y -= lineHeight;
  page.drawText(`Statement Date: ${new Date().toLocaleDateString("en-IN")}`, {
    x: margin,
    y,
    size: 10,
    font: fontNormal,
  });

  y -= 25;

  /* ================= SUMMARY ================= */
  let totalDebit = 0,
    totalCredit = 0;

  transactions.forEach((tx) =>
    tx.type === "GIVE" ? (totalDebit += tx.amount) : (totalCredit += tx.amount)
  );

  const finalBalance = transactions[transactions.length - 1]?.balanceAfter || 0;

  page.drawText("Summary", {
    x: margin,
    y,
    size: 12,
    font: fontBold,
  });

  y -= lineHeight;
  page.drawText(`Total Debit: INR ${totalDebit.toLocaleString("en-IN")}`, {
    x: margin,
    y,
    size: 10,
    font: fontNormal,
    color: rgb(0.85, 0.15, 0.15),
  });

  y -= lineHeight;
  page.drawText(`Total Credit: INR ${totalCredit.toLocaleString("en-IN")}`, {
    x: margin,
    y,
    size: 10,
    font: fontNormal,
    color: rgb(0.13, 0.77, 0.36),
  });

  y -= lineHeight;
  page.drawText(`Final Balance: INR ${Math.abs(finalBalance).toLocaleString("en-IN")}`, {
    x: margin,
    y,
    size: 11,
    font: fontBold,
    color: finalBalance < 0 ? rgb(0.85, 0.15, 0.15) : rgb(0.13, 0.77, 0.36),
  });

  y -= 30;

  /* ================= TABLE ================= */
  const headers = ["#", "Date", "Type", "Debit", "Credit", "Balance"];
  const colWidths = [20, 70, 60, 60, 60, 70];

  const drawTableHeader = () => {
    let x = margin;
    headers.forEach((h, i) => {
      page.drawText(h, { x, y, size: 10, font: fontBold });
      x += colWidths[i];
    });
    y -= 14;
  };

  drawTableHeader();

  transactions.forEach((tx, index) => {
    if (y < 60) {
      drawFooter(page);
      page = pdfDoc.addPage([595, 842]);
      y = height - margin;
      drawTableHeader();
    }

    let x = margin;
    const isGive = tx.type === "GIVE";
    const row = [
      index + 1,
      new Date(tx.date).toLocaleDateString("en-IN"),
      isGive ? "Given" : "Received",
      isGive ? `INR ${tx.amount}` : "-",
      !isGive ? `INR ${tx.amount}` : "-",
      `INR ${tx.balanceAfter}`,
    ];

    row.forEach((cell, i) => {
      page.drawText(String(cell), { x, y, size: 9, font: fontNormal });
      x += colWidths[i];
    });

    y -= 14;
  });

  drawFooter(page);

  /* ================= SAVE ================= */
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${customer.name.replace(/\s+/g, "_")}_statement.pdf`;
  link.click();
}
