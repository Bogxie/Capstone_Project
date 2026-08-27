export const CompleteModal = ({ booking, handleComplete, onClose }) => {
    if (!booking) return null;
    const bookingId = booking.booking_id || booking.bookID;

    return (
        <div className="fixed inset-0 z-[1050] flex items-center justify-center bg-[#23262f]/95 p-2 sm:p-4">
            <div className="w-full max-w-md mx-4 bg-[#2d303a] text-white border border-[#06b6d4] rounded-xl shadow-2xl overflow-hidden">

                <div className="relative flex items-center p-4 border-b border-[#06b6d4]">
                    <h5 className="text-base font-bold w-full text-center">Booking Completion</h5>
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

                <div className="flex flex-col items-center gap-4 p-5">
                    <p className="text-center text-sm">
                        Are you sure <strong>ID: {booking.display_id || booking.bookID}</strong> is ready to be marked as <strong>Complete</strong>?
                    </p>
                    <div className="flex gap-2 w-full">
                        <button
                            className="flex-1 py-2 text-sm font-semibold rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
                            onClick={() => { 
                                handleComplete(bookingId, { status: 'Completed' }); 
                                onClose(); 
                            }}
                        >
                            Yes
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