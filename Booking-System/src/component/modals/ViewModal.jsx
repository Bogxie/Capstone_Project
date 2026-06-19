import { useState } from "react";
import { formatCurrency } from "../../assets/Utils/formatCurrency";
import { colorStatus } from "../../assets/Utils/colorStatus";
import { LocationPickerMap } from "../LocationPickerMap";

export const ViewModal = ({ booking, onClose }) => {
    const [showMap, setShowMap] = useState(false);

    if (!booking) return null;

    // Helper para isalin ang Bootstrap status class (kung mayroon man) papuntang Tailwind colors
    const getStatusStyles = (status) => {
        const bootstrapClass = colorStatus(status);
        if (bootstrapClass.includes("success")) return "bg-green-500/10 text-green-400 border border-green-500/30";
        if (bootstrapClass.includes("warning")) return "bg-amber-500/10 text-amber-400 border border-amber-500/30";
        if (bootstrapClass.includes("danger")) return "bg-red-500/10 text-red-400 border border-red-500/30";
        return "bg-blue-500/10 text-blue-400 border border-blue-500/30";
    };

    return (
        <div className="fixed inset-0 z-[1050] flex items-center justify-center bg-black/80 backdrop-blur-sm">
            {/* Modal Dialog Container */}
            <div className="relative w-full max-w-lg max-h-[90vh] flex flex-col rounded-xl border border-zinc-800 bg-zinc-950 text-white shadow-2xl overflow-hidden">
                
                {/* Modal Header */}
                <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
                            <i className="bi bi-info-circle-fill text-lg"></i>
                        </div>
                        <div>
                            <h5 className="text-base font-semibold tracking-wide text-zinc-100">Booking Reservation</h5>
                            <p className="text-xs text-zinc-500 font-mono">{booking.bookID}</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
                        aria-label="Close"
                    >
                        <i className="bi bi-x-lg text-lg flex"></i>
                    </button>
                </div>

                {/* Modal Body (Scrollable kung mahaba ang content) */}
                <div className="flex-1 overflow-y-auto p-5 space-y-5 hide-scrollbar">
                    
                    {/* User Summary Section */}
                    <div className="flex items-start justify-between gap-4 rounded-lg bg-zinc-900/50 p-3 border border-zinc-900">
                        <div className="min-w-0 flex-1">
                            <h6 className="truncate text-base font-medium text-zinc-200">{booking.fullName}</h6>
                            <p className="truncate text-xs text-zinc-400 mt-0.5">
                                {booking.email} <span className="text-zinc-600">·</span> {booking.phoneNum}
                            </p>
                        </div>
                        <span className="shrink-0 inline-flex items-center rounded-md bg-amber-500/10 px-2 py-1 text-xs font-medium text-amber-400 ring-1 ring-inset ring-amber-500/20">
                            {booking.description}
                        </span>
                    </div>

                    {/* Booking Logistics Grid */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-lg bg-zinc-900/30 border border-zinc-900 p-3">
                            <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">Date</p>
                            <p className="text-sm font-medium text-zinc-300 mt-1">{booking.month} {booking.date}, {booking.year}</p>
                        </div>
                        <div className="rounded-lg bg-zinc-900/30 border border-zinc-900 p-3">
                            <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">Time</p>
                            <p className="text-sm font-medium text-zinc-300 mt-1">
                                {booking.timeStart} {booking.timeStartAmPm} - {booking.timeEnd} {booking.timeEndAmPm}
                            </p>
                        </div>
                        
                        {/* Full Width Venue Section */}
                        <div className="col-span-2 rounded-lg bg-zinc-900/30 border border-zinc-900 p-3">
                            <div className="flex items-center justify-between mb-1">
                                <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">Venue</p>
                                
                                {/* Map Toggle Button */}
                                <button
                                    type="button"
                                    onClick={() => setShowMap(!showMap)}
                                    className="inline-flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-medium transition-colors focus:outline-none"
                                >
                                    {showMap ? "🙈 Hide Map" : "🗺️ View on Map"}
                                </button>
                            </div>
                            <p className="text-sm font-medium text-zinc-300 break-words">{booking.venue}</p>
                            
                            {/* Animated Location Picker Map Container */}
                            {showMap && (
                                <div className="mt-3 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 p-1 animate-slide-down">
                                    <LocationPickerMap
                                        initialVenue={booking.venue}
                                        initialLat={booking.lat || null} 
                                        initialLng={booking.lng || null}
                                        onLocationSelect={(locData) => {
                                            // Optional: Kung gusto mong mapalitan ang details habang pinipindot sa view mode
                                            console.log("Selected coordinates inside modal:", locData);
                                        }}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="rounded-lg bg-zinc-900/30 border border-zinc-900 p-3 flex flex-col justify-between">
                            <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500 mb-1">Status</p>
                            <div>
                                <span className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full uppercase tracking-wider ${getStatusStyles(booking.status)}`}>
                                    {booking.status}
                                </span>
                            </div>
                        </div>
                        <div className="rounded-lg bg-zinc-900/30 border border-zinc-900 p-3">
                            <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">Payment</p>
                            <p className="text-sm font-medium text-zinc-300 mt-1">{booking.paymentMethod}</p>
                        </div>
                    </div>

                    {/* Payment Breakdown Table */}
                    <div className="space-y-2.5">
                        <h6 className="text-xs font-bold uppercase tracking-widest text-zinc-400 border-b border-zinc-800 pb-2">Payment Details</h6>
                        <div className="divide-y divide-zinc-900 text-sm">
                            <div className="flex justify-between py-2 text-zinc-400">
                                <span>Rental Fee</span>
                                <span className="font-medium text-zinc-200">₱{formatCurrency(booking.rentalFee)}</span>
                            </div>
                            <div className="flex justify-between py-2 text-zinc-400">
                                <span>Delivery Fee</span>
                                <span className="font-medium text-zinc-200">₱{formatCurrency(booking.deliveryFee)}</span>
                            </div>
                            <div className="flex justify-between py-2 text-zinc-400">
                                <span>Tax</span>
                                <span className="font-medium text-zinc-200">₱{formatCurrency(booking.tax)}</span>
                            </div>
                            <div className="flex justify-between py-2 text-zinc-400">
                                <span>Downpayment</span>
                                <span className="font-semibold text-red-400 font-mono">-{formatCurrency(booking.downpayment)}</span>
                            </div>
                            {/* Total Remainder Row */}
                            <div className="flex justify-between items-center py-3 bg-zinc-900/30 px-3 rounded-lg border border-zinc-900/50 mt-2">
                                <span className="font-semibold text-zinc-300">Remaining Total:</span>
                                <span className="text-xl font-bold text-amber-400 font-mono">
                                    ₱{formatCurrency(booking.total - booking.downpayment)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Footer Button */}
                <div className="border-t border-zinc-800 p-4">
                    <button
                        type="button"
                        className="w-full rounded-lg bg-zinc-800 py-2.5 text-sm font-semibold text-white transition-all hover:bg-zinc-700 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-zinc-600"
                        onClick={onClose}
                    >
                        Close Details
                    </button>
                </div>
            </div>
        </div>
    );
};