// component/modals/DeleteFeedbackModal.jsx
export const DeleteFeedbackModal = ({ booking, onClose, onConfirm }) => {
    if (!booking) return null;

    const displayId = booking.display_id || booking.bookID || `BK-${String(booking.booking_id).padStart(6, '0')}`;

    return (
        <div className="fixed inset-0 z-[1050] flex items-center justify-center bg-[#23262f]/95 p-2 sm:p-4">
            <div className="w-full max-w-md mx-4 bg-[#2d303a] border border-red-500/50 rounded-xl shadow-2xl overflow-hidden">
                
                {/* Header */}
                <div className="relative flex items-center p-4 border-b border-red-500/50">
                    <h5 className="text-base font-bold w-full text-center text-red-400">
                        Delete Feedback
                    </h5>
                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute right-4 text-zinc-400 hover:text-white transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="flex flex-col items-center gap-4 p-5">
                    <div className="text-5xl">🗑️</div>
                    
                    <p className="text-center text-sm text-zinc-300">
                        Are you sure you want to delete your feedback for booking?
                    </p>

                    <span className="inline-block rounded bg-[#23262f] px-3 py-1 text-xs font-semibold text-white border border-[#3a3d48]">
                        {displayId}
                    </span>

                    <p className="text-center text-xs text-red-400">
                        This action cannot be undone.
                    </p>

                    {/* Buttons */}
                    <div className="flex gap-2 w-full mt-2">
                        <button
                            className="flex-1 py-2 text-sm font-semibold rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
                            onClick={onConfirm}
                        >
                            Yes, Delete
                        </button>
                        <button
                            className="flex-1 py-2 text-sm font-semibold rounded-lg bg-[#23262f] border border-[#3a3d48] text-white hover:bg-[#2d303a] transition-colors"
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