export const CompleteModal = ({ booking, handleComplete, onClose }) => {
    if (!booking) return null;

    return (
        <div className="fixed inset-0 z-[1050] flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-sm mx-4 bg-[#212529] text-white border border-cyan-400 rounded-xl shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="relative flex items-center p-4 border-b border-cyan-400">
                    <h5 className="text-base font-bold w-full text-center">Booking Completion</h5>
                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute right-4 text-gray-400 hover:text-white transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="flex flex-col items-center gap-4 p-5">
                    <p className="text-center text-sm">
                        Are you sure <strong>ID: {booking.bookID}</strong> is ready to be marked as <strong>Complete</strong>?
                    </p>
                    <div className="flex gap-2 w-full">
                        <button
                            className="flex-1 py-2 text-sm font-semibold rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
                            onClick={() => { handleComplete(booking.bookID, { status: 'Complete' }); onClose(); }}
                        >
                            Yes
                        </button>
                        <button
                            className="flex-1 py-2 text-sm font-semibold rounded-lg bg-gray-600 text-white hover:bg-gray-700 transition-colors"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};