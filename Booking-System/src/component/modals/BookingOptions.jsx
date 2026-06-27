import { useState } from "react";
import { motion } from 'framer-motion'
import { BookingModal } from "./BookingModal";
import logo from "../../assets/images/Golden.png"
import logo2 from "../../assets/images/Snoop.png"
import logo3 from "../../assets/images/logo.jpg"

export const BookingOptions = ({ 
    selectedDate, 
    onClose, 
    showReceipt, 
    bookedServices, 
    disableServices = [],
    availableServices = [],
    socket, 
    currentUser 
}) => {

    const [selected, setSelected] = useState("");
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [isChecking, setIsChecking] = useState(false); 

    const handleBackOptions = () => {
        setIsConfirmed(false);
        if (selected && selectedDate.dateString) {
            socket.emit('booking-cancelled', {
                date: selectedDate.dateString,
                service: selected,
                userId: currentUser.id || currentUser.username
            });
        }
        setSelected("");
    }

    const services = [
        {
            image: logo,
            service: "Golden Hour",
            selectedBg: "bg-[#F59E0B]",
            selectedText: "text-black",
        },
        {
            image: logo2,
            service: "Snoop Dough",
            selectedBg: "bg-[#92400E]",
            selectedText: "text-white",
        },
        {
            image: logo3,
            service: "Rental Projector",
            selectedBg: "bg-[#1E293B]",
            selectedText: "text-white",
        },
    ];

    const handleContinue = () => {
        if (!selected) return;
        
        setIsChecking(true);

        socket.emit('check-availability', 
            { 
                date: selectedDate.dateString, 
                service: selected, 
                userId: currentUser.id || currentUser.username 
            },
            (response) => {
                setIsChecking(false);
                
                if (response.available) {
                    setIsConfirmed(true);
                } else {
                    alert(`❌ ${response.message}`);
                    setSelected("");
                }
            }
        );
    };

    // ✅ NEW: Close handler with cleanup
    const handleClose = () => {
        // Release temp booking if any
        if (selected && selectedDate.dateString) {
            socket.emit('booking-cancelled', {
                date: selectedDate.dateString,
                service: selected,
                userId: currentUser.id || currentUser.username
            });
        }
        setSelected("");
        setIsConfirmed(false);
        onClose();
    };

    return (
        <>
            {!isConfirmed && (
                <div className="fixed inset-0 z-[1050] flex items-center justify-center bg-black/80">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="w-full max-w-md mx-4"
                    >
                        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">

                            {/* Header */}
                            <div className="flex justify-between items-center px-5 py-4 border-b border-gray-200">
                                <div>
                                    <h5 className="text-sm font-semibold text-gray-900 mb-0">
                                        Type of booking
                                    </h5>
                                    <small className="text-xs text-gray-500">
                                        {selectedDate.month} {selectedDate.date}, {selectedDate.year}
                                    </small>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleClose} // ✅ Updated
                                    className="text-gray-400 hover:text-gray-700 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Body */}
                            <div className="px-5 py-4">
                                {/* ✅ NEW: Loading indicator */}
                                {isChecking && (
                                    <div className="text-center py-4 mb-3 bg-blue-50 rounded-lg border border-blue-200">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                                        <p className="text-sm text-blue-600 mt-2">Checking availability...</p>
                                    </div>
                                )}

                                <ul className="space-y-2">
                                    {services.map((svc, i) => {
                                        const isBooked = bookedServices?.has(svc.service);
                                        const isDisabled = disableServices.includes(svc.service);
                                        const isAvailable = availableServices.includes(svc.service);
                                        const hasConflict = !isAvailable && !isBooked && !isDisabled;
                                        const isUnselectable = isBooked || isDisabled || !isAvailable || isChecking;
                                        const isCurrentSelected = selected === svc.service;

                                        let badgeText = "";
                                        let badgeColor = "";
                                        if (isDisabled) {
                                            badgeText = "Unavailable";
                                            badgeColor = "bg-gray-600";
                                        } else if (isBooked) {
                                            badgeText = "Booked";
                                            badgeColor = "bg-red-600";
                                        } else if (hasConflict) {
                                            badgeText = "⏳ Pending";
                                            badgeColor = "bg-yellow-500";
                                        }

                                        return (
                                            <li
                                                key={i}
                                                onClick={() => !isUnselectable && setSelected(svc.service)}
                                                className={`
                                                    p-2 rounded-[10px] border transition-all duration-200
                                                    ${isCurrentSelected && !isUnselectable
                                                        ? `${svc.selectedBg} ${svc.selectedText} font-bold border-[#1e1e1e]`
                                                        : "border-transparent hover:bg-gray-100"
                                                    }
                                                    ${isUnselectable ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                                                    ${hasConflict ? "border-yellow-400 bg-yellow-50" : ""}
                                                `}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center gap-2">
                                                        <img
                                                            src={svc.image}
                                                            alt={`logo-${i}`}
                                                            className={`w-12 ${isUnselectable ? "opacity-40" : ""}`}
                                                        />
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm">{svc.service}</span>
                                                            {badgeText && (
                                                                <span className={`${badgeColor} text-white text-[10px] font-semibold px-1.5 py-0.5 rounded`}>
                                                                    {badgeText}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <input
                                                        type="radio"
                                                        name="service"
                                                        value={svc.service}
                                                        checked={isCurrentSelected}
                                                        onChange={() => !isUnselectable && setSelected(svc.service)}
                                                        disabled={isUnselectable}
                                                        className="accent-[#6184D8]"
                                                    />
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>

                                <div className="flex gap-2 mt-4">
                                    <button
                                        className="flex-1 py-2 text-sm font-medium rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                                        onClick={handleClose} // ✅ Updated
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="flex-1 py-2 text-sm font-medium rounded-lg bg-[#6184D8] text-white hover:bg-[#4f6ec0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={!selected || isChecking}
                                        onClick={handleContinue}
                                    >
                                        {isChecking ? "Checking..." : "Continue"}
                                    </button>
                                </div>
                            </div>

                        </div>
                    </motion.div>
                </div>
            )}

            {isConfirmed && selected && (
                <BookingModal
                    selectedDate={selectedDate}
                    onClose={handleClose} // ✅ Updated
                    showReceipt={showReceipt}
                    serviceName={selected}
                    handleBackOptions={handleBackOptions}
                />
            )}
        </>
    );
};