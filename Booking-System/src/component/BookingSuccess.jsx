import { generateReceiptImage } from '../assets/utils/generateReceipt';

export const BookingSuccess = ({ bookingDetails, onClose, isEdit = false }) => {
    if (!bookingDetails) return null;

    const handleReceipt = () => {
        generateReceiptImage(bookingDetails);
    };

    const formatDate = () => {
        if (!bookingDetails) return '';
        const month = bookingDetails.month || '';
        const date = bookingDetails.date || bookingDetails.day || '';
        const year = bookingDetails.year || '';
        return `${month} ${date}, ${year}`.trim();
    };

    const getDisplayId = () => {
        return bookingDetails.display_id || bookingDetails.bookID || 
               `BK-${String(bookingDetails.booking_id || '').padStart(6, '0')}`;
    };

    return (
        // ✅ FIX: z-[260] → z-[1260] para mas mataas kaysa sa EditModal (z-[1050])
        <div className="fixed inset-0 z-[1260] flex items-center justify-center bg-black/20 backdrop-blur-sm p-5">
            <div className="w-full max-w-md bg-white text-gray-900 rounded-xl shadow-2xl border-0 overflow-hidden">
                
                {/* Close Button */}
                <div className="flex justify-end p-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-700 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="flex flex-col items-center px-6 pb-6 gap-3">
                    <h4 className={`text-xl font-bold text-center ${isEdit ? 'text-blue-600' : 'text-green-600'}`}>
                        {isEdit ? '✅ Booking Updated!' : '🎉 Booking Successful!'}
                    </h4>

                    <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        Booking ID: #{getDisplayId()}
                    </div>

                    <p className="text-sm text-center mt-1">
                        {isEdit 
                            ? `Your booking for ${formatDate()} has been updated successfully.`
                            : `Your booking for ${formatDate()} is now being reviewed.`
                        }
                    </p>

                    {bookingDetails.service && (
                        <div className="text-xs text-gray-600 bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
                            🎯 {bookingDetails.service}
                        </div>
                    )}

                    <p className="text-xs text-gray-500 text-center">
                        Please check your Phone Number{" "}
                        <span className="text-green-600 px-1 font-medium">{bookingDetails.phoneNum || bookingDetails.phone_num || 'N/A'}</span>
                        or{" "}
                        <b className="text-gray-900">{bookingDetails.email || 'N/A'}</b>{" "}
                        for the confirmation message.
                    </p>

                    <button
                        className="w-full py-2 text-sm font-semibold rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
                        onClick={onClose}
                    >
                        OK
                    </button>

                    <button
                        className="w-full py-2 text-sm font-semibold rounded-lg border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors flex items-center justify-center gap-2"
                        onClick={handleReceipt}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
                        </svg>
                        Download Receipt
                    </button>
                </div>
            </div>
        </div>
    );
};