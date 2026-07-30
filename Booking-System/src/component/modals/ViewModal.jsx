import { useState } from "react";
import { formatCurrency } from "../../assets/Utils/formatCurrency";
import { colorStatus } from "../../assets/Utils/colorStatus";
import { AdminMapView } from "../AdminVIewMap";

export const ViewModal = ({ booking, onClose }) => {
    const [showMap, setShowMap] = useState(false);

    if (!booking) return null;

    const displayId = booking.display_id || booking.bookID || `BK-${String(booking.booking_id).padStart(6, '0')}`;
    const fullName = booking.full_name || booking.fullName || 'N/A';
    const phoneNum = booking.phone_num || booking.phoneNum || 'N/A';
    const dateDisplay = booking.date || booking.day || 'N/A';

    const getTimeDisplay = () => {
        if (booking.timeStart && booking.timeStartAmPm && booking.timeEnd && booking.timeEndAmPm) {
            return `${booking.timeStart} ${booking.timeStartAmPm} - ${booking.timeEnd} ${booking.timeEndAmPm}`;
        }
        if (booking.time_start && booking.time_end) {
            return `${booking.time_start} - ${booking.time_end}`;
        }
        return 'N/A';
    };

    const paymentMethod = booking.payment_method || booking.paymentMethod || 'N/A';
    const rentalFee = booking.rental_fee || booking.rentalFee || 0;
    const deliveryFee = booking.delivery_fee || booking.deliveryFee || 0;
    const tax = booking.tax || 0;
    const downpayment = booking.downpayment || 0;
    const total = booking.total || 0;

    const paymentRows = [
        { label: "Rental Fee:", value: rentalFee },
        { label: "Delivery Fee:", value: deliveryFee },
        { label: "Tax:", value: tax },
    ];

    return (
        <div className="fixed inset-0 z-[1050] flex items-center justify-center bg-zinc-950/90 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="flex justify-between items-center px-4 py-3 bg-zinc-800 border-b border-zinc-700">
                    <div className="flex items-center gap-2 font-semibold text-sm text-white">
                        ℹ️
                        <div>
                            <h5 className="mb-0 text-sm font-bold text-white">Booking Reservation</h5>
                            <p className="mb-0 text-lime-400 text-xs">{displayId}</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-zinc-400 hover:text-white transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-3 max-h-[75vh] overflow-y-auto hide-scrollbar">
                    <h6 className="text-center font-bold text-sm text-lime-400 mb-2">GENERAL INFORMATION</h6>

                    {/* User Info */}
                    <div className="flex justify-between items-center bg-zinc-800 rounded-md px-3 py-2 mb-2">
                        <div className="overflow-hidden">
                            <p className="text-white text-sm font-semibold mb-0">{fullName}</p>
                            <p className="text-zinc-400 text-xs mb-0">{booking.email} · {phoneNum}</p>
                        </div>
                        <span className="bg-lime-500 text-black text-xs font-semibold px-2 py-0.5 rounded ml-2 shrink-0">
                            {booking.description || 'N/A'}
                        </span>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-2 mb-2">
                        <div className="bg-zinc-800 rounded-md p-2">
                            <p className="text-white text-xs mb-0.5">📅 Date</p>
                            <p className="text-lime-400 text-xs mb-0">{booking.month} {dateDisplay}, {booking.year}</p>
                        </div>
                        <div className="bg-zinc-800 rounded-md p-2">
                            <p className="text-white text-xs mb-0.5">🕐 Time</p>
                            <p className="text-lime-400 text-xs mb-0">{getTimeDisplay()}</p>
                        </div>

                        {/* Venue */}
                        <div className="col-span-2 bg-zinc-800 rounded-md p-2">
                            <div className="flex justify-between items-center mb-1">
                                <p className="text-white text-xs mb-0">📍 Venue</p>
                                <button
                                    type="button"
                                    onClick={() => setShowMap(!showMap)}
                                    className="text-xs text-lime-400 hover:text-lime-300 transition-colors font-semibold"
                                >
                                    {showMap ? "Hide Map ▲" : "Show Map ▼"}
                                </button>
                            </div>
                            
                            {!showMap ? (
                                <div>
                                    <p className="text-zinc-300 text-xs break-words">{booking.venue || 'No venue provided'}</p>
                                    <p className="text-lime-400 text-xs mt-0.5">📍 {booking.municipality || 'No municipality'}</p>
                                </div>
                            ) : (
                                <div className="mt-1">
                                    <AdminMapView
                                        lat={booking.lat}
                                        lng={booking.lng}
                                        venue={booking.venue}
                                        municipality={booking.municipality}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="bg-zinc-800 rounded-md p-2">
                            <p className="text-white text-xs mb-0.5">⚡ Status</p>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full text-black ${colorStatus(booking.status)}`}>
                                {booking.status || 'Pending'}
                            </span>
                        </div>
                        <div className="bg-zinc-800 rounded-md p-2">
                            <p className="text-white text-xs mb-0.5">💳 Payment</p>
                            <p className="text-lime-400 text-sm font-medium mb-0">{paymentMethod}</p>
                        </div>
                    </div>

                    {/* Payment Details */}
                    <div className="border border-zinc-700 rounded-lg mb-2 overflow-hidden">
                        <div className="bg-zinc-800 text-center py-1.5 border-b border-zinc-700">
                            <h6 className="font-bold text-sm text-lime-400 mb-0">PAYMENT DETAILS</h6>
                        </div>
                        <div className="px-3 py-2 space-y-1 text-sm">
                            {paymentRows.map((item) => (
                                <div key={item.label} className="flex justify-between">
                                    <span className="text-zinc-400">{item.label}</span>
                                    <span className="font-medium text-white">₱{formatCurrency(item.value)}</span>
                                </div>
                            ))}
                            <div className="flex justify-between">
                                <span className="text-zinc-400">Subtotal:</span>
                                <span className="font-medium text-white">₱{formatCurrency(Number(rentalFee) + Number(deliveryFee))}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-zinc-400">Tax (12%):</span>
                                <span className="font-medium text-white">₱{formatCurrency(tax)}</span>
                            </div>
                            <div className="flex justify-between border-t border-zinc-700 pt-1 mt-1">
                                <span className="font-bold text-white">Total:</span>
                                <span className="font-bold text-lime-400">₱{formatCurrency(total)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-zinc-400">Downpayment:</span>
                                <span className="text-red-400 font-medium">- ₱{formatCurrency(downpayment)}</span>
                            </div>
                            <div className="flex justify-between border-t border-zinc-700 pt-1 mt-1">
                                <span className="font-bold text-green-400">Remaining Balance:</span>
                                <span className="font-bold text-green-400">₱{formatCurrency(Number(total) - Number(downpayment))}</span>
                            </div>
                        </div>
                    </div>

                    {/* Close Button */}
                    <button
                        type="button"
                        className="w-full py-2 text-sm font-semibold rounded-lg bg-lime-500 text-black hover:bg-lime-400 transition-colors"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};