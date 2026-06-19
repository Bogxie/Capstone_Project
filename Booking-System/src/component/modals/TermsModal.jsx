export const TermsModal = ({ setShowTerms }) => {
    return (
        <div className="fixed inset-0 z-[1100] bg-black/90 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-black border border-yellow-400 rounded-xl shadow-2xl flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-yellow-400">
                    <h5 className="text-yellow-400 font-bold text-base">📄 Terms and Conditions</h5>
                    <button
                        onClick={() => setShowTerms(false)}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="overflow-y-auto px-5 py-4 text-white text-sm text-left space-y-3">
                    <h6 className="text-cyan-400 font-semibold">1. Booking and Payment</h6>
                    <ul className="list-disc list-inside space-y-1 text-gray-300">
                        <li>A 50% down payment is required to secure your booking.</li>
                        <li>The remaining balance must be paid on or before the event date.</li>
                    </ul>

                    <h6 className="text-cyan-400 font-semibold">2. Cancellation Policy</h6>
                    <ul className="list-disc list-inside space-y-1 text-gray-300">
                        <li>Cancellations 7 days before the event: Down payment forfeited.</li>
                    </ul>

                    <h6 className="text-cyan-400 font-semibold">3. Equipment Responsibility</h6>
                    <ul className="list-disc list-inside space-y-1 text-gray-300">
                        <li>The client is responsible for damage or loss during the rental.</li>
                    </ul>
                </div>

                {/* Footer */}
                <div className="px-5 py-3 border-t border-yellow-400 flex justify-end">
                    <button
                        onClick={() => setShowTerms(false)}
                        className="bg-yellow-400 text-black font-bold px-5 py-2 rounded-lg hover:bg-yellow-500 transition-colors"
                    >
                        I Understand
                    </button>
                </div>
            </div>
        </div>
    );
};