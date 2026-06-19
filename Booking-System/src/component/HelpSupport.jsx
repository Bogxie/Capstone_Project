import { useState } from "react";
import { useAuth } from "../context/useAuth";

const adminFaqItems = [
    {
        question: "How do I confirm or complete a booking?",
        answer: "Go to AdminPage, select a service, find the booking in the list, and use the status buttons on the right (Confirm / Complete) to update its status.",
    },
    {
        question: "What does each status mean?",
        answer: "Pending — a new booking that hasn't been actioned yet. Confirmed — the date is secured. Complete — the event has finished. Cancelled — the booking was cancelled.",
    },
    {
        question: "How do I get the revenue report?",
        answer: "On AdminPage, above the service cards, there's a Revenue Report section — choose Monthly or Whole Year, pick the period, then click Print Report to download a PDF.",
    },
    {
        question: "How do I see a customer's remaining balance?",
        answer: "This is shown on each booking card under 'Balance' — automatically calculated as total minus downpayment.",
    },
    {
        question: "How do I update my admin profile?",
        answer: "Go to AdminProfile (in the Sidebar), and use the 'Edit Profile' or 'Change Password' buttons in Settings.",
    },
];

const userFaqItems = [
    {
        question: "How do I make a booking?",
        answer: "Go to the calendar on the home page, pick an available date, choose a service, and fill in the booking details.",
    },
    {
        question: "How do I check the status of my booking?",
        answer: "Go to your User Page to see all your bookings along with their current status (Pending, Confirmed, Complete, or Cancelled).",
    },
    {
        question: "What payment methods are accepted?",
        answer: "A downpayment is required to secure your date, payable via GCash. The remaining balance can be paid in cash or GCash upon setup.",
    },
    {
        question: "Can I cancel or reschedule my booking?",
        answer: "Please contact support directly using the details below so we can assist you with cancellations or rescheduling.",
    },
    {
        question: "How do I update my account details?",
        answer: "Go to Settings to edit your profile information or change your password.",
    },
];

export const HelpSupport = () => {
    const { currentUser } = useAuth();
    const faqItems = currentUser?.role === "Admin" ? adminFaqItems : userFaqItems;

    const [openIndex, setOpenIndex] = useState(null);
    const [bugReport, setBugReport] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const toggleFaq = (i) => {
        setOpenIndex(prev => (prev === i ? null : i));
    };

    const handleSubmitBug = (e) => {
        e.preventDefault();
        if (!bugReport.trim()) return;
        setSubmitted(true);
        setBugReport("");
        setTimeout(() => setSubmitted(false), 3000);
    };

    return (
        <>
            <title>Help & Support</title>

            <h2 className="text-2xl font-bold text-yellow-400 mb-4">Help & Support</h2>

            {/* FAQ */}
            <div className="bg-gray-900 border border-yellow-500 rounded-lg overflow-hidden mb-6">
                <div className="bg-black text-yellow-400 px-4 py-3 font-semibold">
                    Frequently Asked Questions
                </div>
                <div className="divide-y divide-gray-700">
                    {faqItems.map((item, i) => (
                        <div key={i}>
                            <button
                                onClick={() => toggleFaq(i)}
                                className="w-full flex justify-between items-center px-4 py-3 text-left text-sm font-semibold text-white hover:bg-white/5 transition-colors"
                            >
                                {item.question}
                                <span className="text-yellow-400 ml-2">{openIndex === i ? "−" : "+"}</span>
                            </button>
                            {openIndex === i && (
                                <div className="px-4 pb-3 text-sm text-gray-400">
                                    {item.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Contact Support */}
            <div className="bg-gray-900 border border-yellow-500 rounded-lg overflow-hidden mb-6">
                <div className="bg-black text-yellow-400 px-4 py-3 font-semibold">
                    Contact Support
                </div>
                <div className="p-4 flex flex-col sm:flex-row gap-3">
                    <a
                        href="mailto:support@limeserenity.com"
                        className="flex-1 flex items-center gap-2 bg-black border border-gray-700 rounded-lg px-4 py-3 text-sm text-white hover:border-yellow-500 transition-colors"
                    >
                        📧 <span>support@limeserenity.com</span>
                    </a>
                    <a
                        href="tel:09123456789"
                        className="flex-1 flex items-center gap-2 bg-black border border-gray-700 rounded-lg px-4 py-3 text-sm text-white hover:border-yellow-500 transition-colors"
                    >
                        📞 <span>0912-345-6789</span>
                    </a>
                </div>
            </div>

            {/* Report a Bug */}
            <div className="bg-gray-900 border border-yellow-500 rounded-lg overflow-hidden">
                <div className="bg-black text-yellow-400 px-4 py-3 font-semibold">
                    Report a Bug or Issue
                </div>
                <form onSubmit={handleSubmitBug} className="p-4">
                    <textarea
                        value={bugReport}
                        onChange={(e) => setBugReport(e.target.value)}
                        placeholder="Describe the issue or suggestion..."
                        rows={4}
                        className="w-full bg-black border border-gray-700 rounded-lg p-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 resize-none"
                    />
                    <button
                        type="submit"
                        disabled={!bugReport.trim()}
                        className="mt-3 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold text-sm rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Submit Report
                    </button>
                    {submitted && (
                        <p className="text-green-400 text-xs mt-2">✅ Thanks! Your report has been submitted.</p>
                    )}
                </form>
            </div>
        </>
    );
};