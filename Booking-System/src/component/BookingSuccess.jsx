import { generateReceiptImage } from '../assets/utils/generateReceipt';

export const BookingSuccess = ({ bookingDetails, onClose }) => {
    if (!bookingDetails) return null;

    const handleReceipt = () => {
        generateReceiptImage(bookingDetails);
    };

    return (
        <div className="fixed inset-0 z-[260] flex items-center justify-center bg-black/20 backdrop-blur-sm p-5">
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
                <div className="flex flex-col items-center px-6 pb-6 gap-3 z-[260]">
                    <h4 className="text-xl font-bold text-green-600 text-center">
                        Booking Successful!
                    </h4>

                    <p className="text-sm text-center mt-1">
                        Your booking for{" "}
                        <b>{bookingDetails.month} {bookingDetails.date}, {bookingDetails.year}</b>{" "}
                        is now being reviewed.
                    </p>

                    <p className="text-xs text-gray-500 text-center">
                        Please check your Phone Number{" "}
                        <span className="text-green-600 px-1 font-medium">{bookingDetails.phoneNum}</span>
                        or{" "}
                        <b className="text-gray-900">{bookingDetails.email}</b>{" "}
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