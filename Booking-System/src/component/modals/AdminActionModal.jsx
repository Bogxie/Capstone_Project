export const AdminActionModal = ({ booking, type, onClose, onConfirm }) => {
    // 1. Guard clause para siguradong hindi mag-error kung walang booking data
    if (!booking) return null;

    const isConfirmType = type === "Confirmed";

    const adminConfig = {
        title: isConfirmType ? 'Booking Confirmation' : 'Booking Completion',
        borderColor: isConfirmType ? 'border-yellow-400' : 'border-cyan-400',
        buttonColor: isConfirmType 
            ? 'bg-cyan-500 hover:bg-cyan-400 text-black'
            : 'bg-green-600 hover:bg-green-700 text-white',
        targetStatus: isConfirmType ? 'Confirmed' : 'Complete',
        message: isConfirmType ? (
            <>
                <p className="text-center text-sm">Would you like to confirm this booking?</p>
                <strong className="text-yellow-400">ID: {booking.bookID}</strong>
            </>
        ) : (
            <p className="text-center text-sm">
                Are you sure <strong>ID: {booking.bookID}</strong> is ready to be marked as <strong>Complete</strong>?
            </p>
        )
    };

    const handleAction = () => {
        onConfirm(booking.bookID, { status: adminConfig.targetStatus });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[1050] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            {/* TAMA: Dynamic na rin ang kulay ng border ng main box */}
            <div className={`w-full max-w-sm bg-[#212529] text-white border ${adminConfig.borderColor} rounded-xl shadow-2xl overflow-hidden`}>

                {/* Header */}
                <div className={`relative flex items-center p-4 border-b ${adminConfig.borderColor}`}>
                    <h5 className="text-base font-bold w-full text-center">{adminConfig.title}</h5>
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

                {/* Body (Ito yung nawala kanina!) */}
                <div className="flex flex-col items-center gap-4 p-5">
                    {adminConfig.message}
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2 w-full mt-2">
                        <button
                            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${adminConfig.buttonColor}`}
                            onClick={handleAction}
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