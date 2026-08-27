import { useState } from "react";
import { formatCurrency } from "../../assets/utils/formatCurrency";
import { colorStatus } from "../../assets/Utils/colorStatus";
import { AdminMapView } from "../AdminVIewMap";

export const AdminViewModal = ({ booking, onClose }) => {
    const [showMap, setShowMap] = useState(false);

    if (!booking) return null;

    const rentalFee = Number(booking.rental_fee || booking.rentalFee || 0);
    const deliveryFee = Number(booking.delivery_fee || booking.deliveryFee || 0);
    const tax = Number(booking.tax || 0);
    const downpayment = Number(booking.downpayment || 0);
    const total = Number(booking.total || 0);
    const displayId = booking.display_id || booking.bookID || `BK-${String(booking.booking_id).padStart(6, '0')}`;
    const fullName = booking.full_name || booking.fullName;
    const email = booking.email;
    const phoneNum = booking.phone_num || booking.phoneNum;
    const description = booking.description;
    const month = booking.month;
    const date = booking.date || booking.day;
    const year = booking.year;
    const timeStart = booking.timeStart || (booking.time_start ? booking.time_start.split(' ')[0] : '');
    const timeStartAmPm = booking.timeStartAmPm || (booking.time_start ? booking.time_start.split(' ')[1] : '');
    const timeEnd = booking.timeEnd || (booking.time_end ? booking.time_end.split(' ')[0] : '');
    const timeEndAmPm = booking.timeEndAmPm || (booking.time_end ? booking.time_end.split(' ')[1] : '');
    const status = booking.status;
    const paymentMethod = booking.payment_method || booking.paymentMethod;
    const venue = booking.venue;
    const municipality = booking.municipality;
    const lat = booking.lat;
    const lng = booking.lng;

    return (
        <div className="fixed inset-0 z-[1050] flex items-center justify-center bg-[#23262f]/95 p-4">
            <div className="w-full max-w-sm bg-[#2d303a] border border-[#3a3d48] rounded-xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center px-4 py-3 bg-[#23262f] border-b border-[#3a3d48]">
                    <div className="flex items-center gap-2 font-semibold text-sm text-white">
                        ℹ️
                        <div>
                            <h5 className="mb-0 text-sm font-bold text-white">Booking Reservation</h5>
                            <p className="mb-0 text-[#b6ff2e] text-xs">{displayId}</p>
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
                    <h6 className="text-center font-bold text-sm text-[#b6ff2e] mb-2">GENERAL INFORMATION</h6>

                    {/* User Info */}
                    <div className="flex justify-between items-center bg-[#23262f] rounded-md px-3 py-2 mb-2">
                        <div className="overflow-hidden">
                            <p className="text-white text-sm font-semibold mb-0">{fullName}</p>
                            <p className="text-zinc-400 text-xs mb-0">{email} · {phoneNum}</p>
                        </div>
                        <span className="bg-[#b6ff2e] text-[#23262f] text-xs font-semibold px-2 py-0.5 rounded ml-2 shrink-0">
                            {description}
                        </span>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-2 mb-2">
                        <div className="bg-[#23262f] rounded-md p-2">
                            <p className="text-white text-xs mb-0.5">📅 Date</p>
                            <p className="text-[#b6ff2e] text-xs mb-0">{month} {date}, {year}</p>
                        </div>
                        <div className="bg-[#23262f] rounded-md p-2">
                            <p className="text-white text-xs mb-0.5">🕐 Time</p>
                            <p className="text-[#b6ff2e] text-xs mb-0">{timeStart} {timeStartAmPm} - {timeEnd} {timeEndAmPm}</p>
                        </div>

                        {/* Venue */}
                        <div className="col-span-2 bg-[#23262f] rounded-md p-2">
                            <div className="flex justify-between items-center mb-1">
                                <p className="text-white text-xs mb-0">📍 Venue</p>
                                <button
                                    type="button"
                                    onClick={() => setShowMap(!showMap)}
                                    className="text-xs text-[#b6ff2e] hover:text-[#a3e829] transition-colors font-semibold"
                                >
                                    {showMap ? "Hide Map ▲" : "Show Map ▼"}
                                </button>
                            </div>
                            
                            {!showMap ? (
                                <div>
                                    <p className="text-zinc-300 text-xs break-words">{venue || "No venue provided"}</p>
                                    <p className="text-[#b6ff2e] text-xs mt-0.5">📍 {municipality || "No municipality"}</p>
                                </div>
                            ) : (
                                <div className="mt-1">
                                    <AdminMapView
                                        lat={lat}
                                        lng={lng}
                                        venue={venue}
                                        municipality={municipality}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="bg-[#23262f] rounded-md p-2">
                            <p className="text-white text-xs mb-0.5">⚡ Status</p>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full text-black ${colorStatus(status)}`}>
                                {status}
                            </span>
                        </div>
                        <div className="bg-[#23262f] rounded-md p-2">
                            <p className="text-white text-xs mb-0.5">💳 Payment</p>
                            <p className="text-[#b6ff2e] text-sm font-medium mb-0">{paymentMethod}</p>
                        </div>
                    </div>

                    {/* Payment Details */}
                    <div className="border border-[#3a3d48] rounded-lg mb-2 overflow-hidden">
                        <div className="bg-[#23262f] text-center py-1.5 border-b border-[#3a3d48]">
                            <h6 className="font-bold text-sm text-[#b6ff2e] mb-0">PAYMENT DETAILS</h6>
                        </div>
                        <div className="px-3 py-2 space-y-1 text-sm">
                            <div className="flex justify-between">
                                <span className="text-zinc-400">Rental Fee:</span>
                                <span className="font-medium text-white">₱{formatCurrency(rentalFee)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-zinc-400">Delivery Fee:</span>
                                <span className="font-medium text-white">₱{formatCurrency(deliveryFee)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-zinc-400">Tax:</span>
                                <span className="font-medium text-white">₱{formatCurrency(tax)}</span>
                            </div>
                            <div className="flex justify-between border-t border-[#3a3d48] pt-1 mt-1">
                                <span className="text-zinc-400">Subtotal:</span>
                                <span className="font-medium text-white">₱{formatCurrency(rentalFee + deliveryFee)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-zinc-400">Tax (12%):</span>
                                <span className="font-medium text-white">₱{formatCurrency(tax)}</span>
                            </div>
                            <div className="flex justify-between border-t border-[#3a3d48] pt-1 mt-1">
                                <span className="font-bold text-white">Total:</span>
                                <span className="font-bold text-[#b6ff2e]">₱{formatCurrency(total)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-zinc-400">Downpayment:</span>
                                <span className="text-red-400 font-medium">- ₱{formatCurrency(downpayment)}</span>
                            </div>
                            <div className="flex justify-between border-t border-[#3a3d48] pt-1 mt-1">
                                <span className="font-bold text-green-400">Remaining Balance:</span>
                                <span className="font-bold text-green-400">₱{formatCurrency(total - downpayment)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Close Button */}
                    <button
                        type="button"
                        className="w-full py-2 text-sm font-semibold rounded-lg bg-[#b6ff2e] text-[#23262f] hover:bg-[#a3e829] transition-colors"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};