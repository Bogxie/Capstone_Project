import jsPDF from "jspdf";
import { formatCurrency } from "./formatCurrency";

export const generateReceiptImage = (bookingDetails) => {
    if (!bookingDetails) return;

    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [80, 200], // thermal receipt width
    });

    const pageW = doc.internal.pageSize.getWidth();
    const issuedDate = new Date().toLocaleString("en-PH", {
        dateStyle: "medium",
        timeStyle: "short",
    });

    let y = 10;
    const lineH = 5;
    const leftX = 5;
    const rightX = pageW - 5;

    const center = (text, fontSize = 9) => {
        doc.setFontSize(fontSize);
        doc.text(text, pageW / 2, y, { align: "center" });
        y += lineH;
    };

    const row = (label, value, bold = false) => {
        doc.setFontSize(8);
        doc.setFont("courier", bold ? "bold" : "normal");
        doc.text(label, leftX, y);
        doc.text(value, rightX, y, { align: "right" });
        y += lineH;
    };

    const line = (dashed = false) => {
        y += 1;
        if (dashed) {
            doc.setLineDashPattern([1, 1], 0);
        } else {
            doc.setLineDashPattern([], 0);
        }
        doc.setDrawColor(0);
        doc.line(leftX, y, rightX, y);
        y += 3;
    };

    const label = (key, value) => {
        doc.setFontSize(8);
        doc.setFont("courier", "bold");
        doc.text(`${key}:`, leftX, y);
        doc.setFont("courier", "normal");
        // wrap long values like venue
        const wrapped = doc.splitTextToSize(value, pageW - 30);
        doc.text(wrapped, 30, y);
        y += lineH * wrapped.length;
    };

    doc.setFont("courier", "bold");
    center("PROJECTOR RENTAL CAVITE", 11);
    doc.setFont("courier", "normal");
    center("Official E-Receipt", 8);
    line(true);

    label("Booking ID", `#${bookingDetails.bookID}`);
    label("Client", bookingDetails.fullName);
    label("Event Date", `${bookingDetails.month} ${bookingDetails.date}, ${bookingDetails.year}`);
    label("Time", `${bookingDetails.timeStart}${bookingDetails.timeStartAmPm} - ${bookingDetails.timeEnd}${bookingDetails.timeEndAmPm}`);
    label("Venue", bookingDetails.venue);
    label("Event", bookingDetails.description);
    line(true);

    doc.setFont("courier", "bold");
    doc.setFontSize(8);
    doc.text("CHARGES SUMMARY", leftX, y);
    y += lineH;

    row("Base Rental Fee:", `P${formatCurrency(bookingDetails.rentalFee)}`);
    row("Delivery Fee:", `P${formatCurrency(bookingDetails.deliveryFee)}`);
    row("Tax/Service Fee:", `P${formatCurrency(bookingDetails.tax)}`);
    line(false);
    row("GROSS TOTAL:", `P${formatCurrency(bookingDetails.total)}`, true);
    line(true);

    doc.setTextColor(40, 167, 69); // green
    row("DOWNPAYMENT (PAID):", `- P${formatCurrency(bookingDetails.downpayment || 1000)}`, true);

    doc.setTextColor(220, 53, 69); // red
    row("REMAINING BALANCE:", `P${formatCurrency(bookingDetails.remainingBalance)}`, true);

    doc.setTextColor(0); 
    line(true);

    label("Payment Status", "DOWNPAYMENT VERIFIED");
    label("Balance Via", bookingDetails.paymentMethod);
    label("Date Issued", issuedDate);
    line(true);

    doc.setFont("courier", "italic");
    doc.setFontSize(7);
    const footer = "This serves as your official reservation proof.\nPlease present this to the personnel on the event date.";
    const footerLines = doc.splitTextToSize(footer, pageW - 10);
    doc.text(footerLines, pageW / 2, y, { align: "center" });
    y += lineH * footerLines.length;

    doc.internal.pageSize.height = y + 10;

    const fileName = `Receipt_${bookingDetails.bookID}_${bookingDetails.fullName.replace(/\s+/g, "_")}.pdf`;
    doc.save(fileName);
}