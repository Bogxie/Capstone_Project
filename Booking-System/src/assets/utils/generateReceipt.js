// assets/utils/generateReceipt.js
import jsPDF from "jspdf";
import { formatCurrency } from "./formatCurrency";

export const generateReceiptImage = (bookingDetails, isEdit = false) => {
    if (!bookingDetails) {
        console.error('❌ No booking details provided');
        return;
    }

    console.log('📝 Generating receipt with:', bookingDetails);

    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [80, 240],
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
        const wrapped = doc.splitTextToSize(value || 'N/A', pageW - 30);
        doc.text(wrapped, 30, y);
        y += lineH * wrapped.length;
    };

    // ✅ GET VALUES WITH FALLBACKS
    const bookID = bookingDetails.bookID || bookingDetails.display_id || 
                   `BK-${String(bookingDetails.booking_id || '').padStart(6, '0')}`;
    const fullName = bookingDetails.fullName || bookingDetails.full_name || 'N/A';
    const month = bookingDetails.month || 'N/A';
    const date = bookingDetails.date || bookingDetails.day || 'N/A';
    const year = bookingDetails.year || 'N/A';
    const timeStart = bookingDetails.timeStart || 'N/A';
    const timeStartAmPm = bookingDetails.timeStartAmPm || '';
    const timeEnd = bookingDetails.timeEnd || 'N/A';
    const timeEndAmPm = bookingDetails.timeEndAmPm || '';
    const venue = bookingDetails.venue || 'N/A';
    const description = bookingDetails.description || 'N/A';
    const service = bookingDetails.service || 'N/A';
    const municipality = bookingDetails.municipality || 'N/A';
    
    const rentalFee = Number(bookingDetails.rentalFee || bookingDetails.rental_fee || 0);
    const deliveryFee = Number(bookingDetails.deliveryFee || bookingDetails.delivery_fee || 0);
    const tax = Number(bookingDetails.tax || 0);
    const total = Number(bookingDetails.total || 0);
    const downpayment = Number(bookingDetails.downpayment || 1000);
    const paymentMethod = bookingDetails.paymentMethod || bookingDetails.payment_method || 'N/A';
    const remainingBalance = total - downpayment;

    // HEADER
    doc.setFont("courier", "bold");
    center("PROJECTOR RENTAL CAVITE", 11);
    doc.setFont("courier", "normal");
    
    if (isEdit) {
        center("📝 EDITED BOOKING", 8);
    } else {
        center("Official E-Receipt", 8);
    }
    
    line(true);

    // BOOKING DETAILS
    label("Booking ID", `#${bookID}`);
    label("Client", fullName);
    label("Service", service);
    label("Event Date", `${month} ${date}, ${year}`);
    label("Time", `${timeStart}${timeStartAmPm} - ${timeEnd}${timeEndAmPm}`);
    label("Venue", venue);
    label("Municipality", municipality);
    label("Event", description);
    line(true);

    // CHARGES SUMMARY
    doc.setFont("courier", "bold");
    doc.setFontSize(8);
    doc.text("CHARGES SUMMARY", leftX, y);
    y += lineH;

    row("Base Rental Fee:", `P${formatCurrency(rentalFee)}`);
    row("Delivery Fee:", `P${formatCurrency(deliveryFee)}`);
    row("Tax (12%):", `P${formatCurrency(tax)}`);
    line(false);
    row("GROSS TOTAL:", `P${formatCurrency(total)}`, true);
    line(true);

    doc.setTextColor(40, 167, 69);
    row("DOWNPAYMENT (PAID):", `- P${formatCurrency(downpayment)}`, true);

    doc.setTextColor(220, 53, 69);
    row("REMAINING BALANCE:", `P${formatCurrency(remainingBalance)}`, true);

    doc.setTextColor(0);
    line(true);

    // PAYMENT INFO
    label("Payment Status", downpayment > 0 ? "DOWNPAYMENT VERIFIED" : "PENDING");
    label("Payment Method", paymentMethod);
    label("Date Issued", issuedDate);

    if (isEdit) {
        line(true);
        doc.setTextColor(0, 102, 204);
        doc.setFont("courier", "bold");
        doc.setFontSize(7);
        doc.text("📝 This booking has been edited", pageW / 2, y, { align: "center" });
        y += lineH;
        doc.setTextColor(0);
    }

    line(true);

    // FOOTER
    doc.setFont("courier", "italic");
    doc.setFontSize(7);
    const footer = "This serves as your official reservation proof.\nPlease present this to the personnel on the event date.";
    const footerLines = doc.splitTextToSize(footer, pageW - 10);
    doc.text(footerLines, pageW / 2, y, { align: "center" });
    y += lineH * footerLines.length;

    doc.internal.pageSize.height = y + 10;

    // ✅ FIXED: Safe filename generation
    const safeFullName = (fullName || 'N/A').replace(/\s+/g, "_");
    const fileName = isEdit 
        ? `Receipt_${bookID}_${safeFullName}_EDITED.pdf`
        : `Receipt_${bookID}_${safeFullName}.pdf`;
    
    console.log('💾 Saving receipt:', fileName);
    doc.save(fileName);
};