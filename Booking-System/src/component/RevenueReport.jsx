import { useState, useMemo } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { months } from "../assets/utils/months.js";
import { formatCurrency } from "../assets/utils/formatCurrency.js";
import Prclogo from '../assets/images/lime_rbg2.png';

const ALL_SERVICES = ["Golden Hour", "Snoop Dough", "Rental Projector"];

export const RevenueReport = ({ bookings }) => {
    const [scope, setScope] = useState("month"); // "month" | "year"
    const [selectedMonth, setSelectedMonth] = useState(months[new Date().getMonth()]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const availableYears = useMemo(() => {
        const years = new Set(bookings.map((b) => b.year));
        years.add(selectedYear);
        return [...years].sort((a, b) => b - a);
    }, [bookings, selectedYear]);

    const completedBookings = useMemo(() => {
        return bookings.filter((b) =>
            b.status === "Complete" &&
            b.year === selectedYear &&
            (scope === "year" || b.month === selectedMonth)
        );
    }, [bookings, selectedYear, selectedMonth, scope]);

    const totalRevenue = completedBookings.reduce(
        (sum, b) => sum + Number(b.total || 0), 0
    );

    const generatePDF = () => {
        const doc = new jsPDF();
        const title = scope === "month"
            ? `Revenue Report - ${selectedMonth} ${selectedYear}`
            : `Revenue Report - ${selectedYear} (Whole Year)`;

        // --- 🏢 BRANDING HEADER SECTION ---
        try {
            doc.addImage(Prclogo, "PNG", 14, 12, 15, 15);
        } catch (error) {
            console.error("Logo failed to load in PDF:", error);
        }

        doc.setFont("Helvetica", "bold");
        doc.setFontSize(18);
        doc.setTextColor(101, 163, 13); // Lime Green brand color
        doc.text("Lime Serenity", 34, 19);

        doc.setFont("Helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text("Events & Services Management", 34, 24);

        // --- 📊 REPORT METADATA SECTION ---
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text(title, 14, 38);

        doc.setFont("Helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(80, 80, 80);
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 44);

        // Decorative horizontal divider line
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.5);
        doc.line(14, 48, 196, 48);

        let cursorY = 56;
        let grandTotal = 0;

        ALL_SERVICES.forEach((service) => {
            const serviceBookings = completedBookings.filter((b) => b.service === service);
            if (serviceBookings.length === 0) return;

            const subtotal = serviceBookings.reduce((sum, b) => sum + Number(b.total || 0), 0);
            grandTotal += subtotal;

            // Page sync logic to prevent overlap on new pages
            if (doc.lastAutoTable && doc.lastAutoTable.pageNumber) {
                doc.setPage(doc.lastAutoTable.pageNumber);
            }

            doc.setFont("Helvetica", "bold");
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.text(service, 14, cursorY);
            cursorY += 4;

            autoTable(doc, {
                startY: cursorY,
                margin: { left: 14, right: 14 },
                head: [["Book ID", "Date", "Venue", "Event", "Total"]],
                body: serviceBookings.map((b) => [
                    b.bookID,
                    `${b.month} ${b.date}, ${b.year}`,
                    b.venue,
                    b.description,
                    `PHP ${formatCurrency(b.total)}`,
                ]),

                // 1. IPWESTO ANG SUBTOTAL SA KALIWANG COLUMN (Index 0 at 1)
                foot: [["Subtotal", `PHP ${formatCurrency(subtotal)}`, "", "", ""]],

                theme: "grid",
                styles: { fontSize: 9, font: "Helvetica", overflow: 'linebreak' },
                headStyles: { fillColor: [101, 163, 13] },
                footStyles: { fillColor: [240, 240, 240], textColor: 0, fontStyle: "bold" },

                columnStyles: {
                    0: { cellWidth: 25 },  // Inadjust ng konti para magkasya ang salitang "Subtotal" sa footer
                    1: { cellWidth: 35 },  // Inadjust para magkasya ang halaga ng subtotal sa footer
                    2: { cellWidth: 40 },
                    3: { cellWidth: 'auto' },
                    4: { cellWidth: 35, halign: 'right' } // Ang mga indibidwal na presyo sa table body ay nananatiling nasa kanan para pormal
                }
            });
            cursorY = doc.lastAutoTable.finalY + 12;
        });

        // Ensure Grand Total prints safely on the final page
        if (doc.lastAutoTable && doc.lastAutoTable.pageNumber) {
            doc.setPage(doc.lastAutoTable.pageNumber);
            doc.setFont("Helvetica", "bold");
            doc.setFontSize(14);
            doc.setTextColor(0, 0, 0);
            doc.text(`Grand Total: PHP ${formatCurrency(grandTotal)}`, 14, doc.lastAutoTable.finalY + 12);
        }

        const filename = scope === "month"
            ? `revenue-report-${selectedMonth}-${selectedYear}.pdf`
            : `revenue-report-${selectedYear}.pdf`;

        doc.save(filename);
    };

    return (
        <div className="bg-black/50 border border-gray-700 rounded-xl p-4 mb-4">
            <h3 className="text-cyan-400 font-bold text-sm mb-3">📊 Revenue Report</h3>

            <div className="flex flex-wrap items-center gap-2 mb-2">
                <select
                    value={scope}
                    onChange={(e) => setScope(e.target.value)}
                    className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg px-3 py-1.5"
                >
                    <option value="month">Monthly</option>
                    <option value="year">Whole Year</option>
                </select>

                {scope === "month" && (
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg px-3 py-1.5"
                    >
                        {months.map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                )}

                <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg px-3 py-1.5"
                >
                    {availableYears.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>

                <button
                    onClick={generatePDF}
                    disabled={completedBookings.length === 0}
                    className="ml-auto px-4 py-1.5 text-sm font-bold rounded-lg bg-cyan-400 text-black hover:bg-cyan-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    🖨️ Print Report
                </button>
            </div>

            <p className="text-gray-400 text-xs">
                {completedBookings.length} completed booking(s)
                {scope === "month" ? ` for ${selectedMonth} ${selectedYear}` : ` for ${selectedYear}`}
                {completedBookings.length > 0 && ` — Total: ₱${formatCurrency(totalRevenue)}`}
            </p>
        </div>
    );
};