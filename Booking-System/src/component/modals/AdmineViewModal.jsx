import { formatCurrency } from "../../assets/Utils/formatCurrency";
import { colorStatus } from "../../assets/utils/colorStatus";
import { AdminMapView } from "../AdminVIewMap";

export const AdminViewModal = ({ booking, onClose }) => {
    if (!booking) return null;

    const paymentRows = [
        { label: "Rental Fee:", value: booking.rentalFee },
        { label: "Delivery Fee:", value: booking.deliveryFee },
        { label: "Tax:", value: booking.tax },
    ];

    return (
        <div className="fixed inset-0 z-[1050] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="flex justify-between items-center px-4 py-3 bg-white border-b border-gray-200">
                    <div className="flex items-center gap-2 font-semibold text-sm text-[#1e1e1e]">
                        ℹ️
                        <div>
                            <h5 className="mb-0 text-sm font-bold">Booking Reservation</h5>
                            <p className="mb-0 text-[#6184D8] text-xs">{booking.bookID}</p>
                        </div>
                    </div>
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

                <div className="p-3 max-h-[75vh] overflow-y-auto hide-scrollbar">
                    <h6 className="text-center font-bold text-sm mb-2">GENERAL INFORMATION</h6>

                    {/* User Info */}
                    <div className="flex justify-between items-center bg-[#1e1e1e] rounded-md px-3 py-2 mb-2">
                        <div className="overflow-hidden">
                            <p className="text-white text-sm font-semibold mb-0">{booking.fullName}</p>
                            <p className="text-[#6184D8] text-xs mb-0">{booking.email} · {booking.phoneNum}</p>
                        </div>
                        <span className="bg-blue-600 text-white text-xs font-semibold px-2 py-0.5 rounded ml-2 shrink-0">
                            {booking.description}
                        </span>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-2 mb-2">
                        <div className="bg-[#1e1e1e] rounded-md p-2">
                            <p className="text-white text-xs mb-0.5">Date</p>
                            <p className="text-[#6184D8] text-xs mb-0">{booking.month} {booking.date}, {booking.year}</p>
                        </div>
                        <div className="bg-[#1e1e1e] rounded-md p-2">
                            <p className="text-white text-xs mb-0.5">Time</p>
                            <p className="text-[#6184D8] text-xs mb-0">{booking.timeStart} {booking.timeStartAmPm} - {booking.timeEnd} {booking.timeEndAmPm}</p>
                        </div>

                        {/* Venue — full width */}
                        <div className="col-span-2 bg-[#1e1e1e] rounded-md p-2">
                            <p className="text-white text-xs mb-1">Venue</p>
                            <AdminMapView
                                lat={booking.lat}
                                lng={booking.lng}
                                venue={booking.venue}
                                municipality={booking.municipality}
                            />
                        </div>

                        <div className="bg-[#1e1e1e] rounded-md p-2">
                            <p className="text-white text-xs mb-0.5">Status</p>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full text-black ${colorStatus(booking.status)}`}>
                                {booking.status}
                            </span>
                        </div>
                        <div className="bg-[#1e1e1e] rounded-md p-2">
                            <p className="text-white text-xs mb-0.5">Payment</p>
                            <p className="text-[#6184D8] text-sm font-medium mb-0">{booking.paymentMethod}</p>
                        </div>
                    </div>

                    {/* Payment Details */}
                    <div className="border border-gray-300 rounded-lg mb-2 overflow-hidden">
                        <div className="bg-gray-100 text-center py-1.5 border-b border-gray-300">
                            <h6 className="font-bold text-sm text-black mb-0">PAYMENT DETAILS</h6>
                        </div>
                        <div className="px-3 py-2 space-y-1 text-sm">
                            {paymentRows.map((item) => (
                                <div key={item.label} className="flex justify-between">
                                    <span className="text-gray-600">{item.label}</span>
                                    <span className="font-medium">₱ {formatCurrency(item.value)}</span>
                                </div>
                            ))}
                            <div className="flex justify-between">
                                <span className="text-gray-600">Downpayment:</span>
                                <span className="text-red-500 font-medium">₱ - {formatCurrency(booking.downpayment)}</span>
                            </div>
                            <div className="flex justify-between border-t border-gray-200 pt-1 mt-1">
                                <span className="font-bold">Total:</span>
                                <span className="font-bold">₱ {formatCurrency(booking.total)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Close Button */}
                    <button
                        type="button"
                        className="w-full py-2 text-sm font-semibold rounded-lg bg-[#6184D8] text-white hover:bg-[#4f6ec0] transition-colors"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};