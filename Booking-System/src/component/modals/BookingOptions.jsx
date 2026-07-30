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
    currentUser,
    serviceConfig = {},
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

    // ✅ Images and colors for each service
    const serviceImages = {
        "Golden Hour": logo,
        "Snoop Dough": logo2,
        "Rental Projector": logo3,
    };

    const serviceColors = {
        "Golden Hour": { 
            selectedBg: "bg-amber-400", 
            selectedText: "text-black", 
            ring: "ring-amber-400" 
        },
        "Snoop Dough": { 
            selectedBg: "bg-orange-600", 
            selectedText: "text-white", 
            ring: "ring-orange-500" 
        },
        "Rental Projector": { 
            selectedBg: "bg-cyan-500", 
            selectedText: "text-white", 
            ring: "ring-cyan-500" 
        },
    };

    // ✅ DYNAMIC: Build services from serviceConfig (galing sa database)
    const services = Object.keys(serviceConfig).map(brand => ({
        service: brand,
        image: serviceImages[brand] || null,
        ...serviceColors[brand] || { 
            selectedBg: "bg-gray-600", 
            selectedText: "text-white", 
            ring: "ring-gray-500" 
        }
    }));

    // ✅ FALLBACK: Kung walang serviceConfig, gumamit ng default
    const defaultServices = [
        { 
            service: "Golden Hour", 
            image: logo, 
            selectedBg: "bg-amber-400", 
            selectedText: "text-black", 
            ring: "ring-amber-400" 
        },
        { 
            service: "Snoop Dough", 
            image: logo2, 
            selectedBg: "bg-orange-600", 
            selectedText: "text-white", 
            ring: "ring-orange-500" 
        },
        { 
            service: "Rental Projector", 
            image: logo3, 
            selectedBg: "bg-cyan-500", 
            selectedText: "text-white", 
            ring: "ring-cyan-500" 
        },
    ];

    const finalServices = services.length > 0 ? services : defaultServices;

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

    const handleClose = () => {
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
                <div className="fixed inset-0 z-[1050] flex items-center justify-center bg-zinc-950/90 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="w-full max-w-md mx-4"
                    >
                        <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden text-white">

                            <div className="flex justify-between items-center px-5 py-4 border-b border-zinc-800">
                                <div>
                                    <h5 className="text-sm font-bold text-lime-500 tracking-wide uppercase mb-0">
                                        Type of booking
                                    </h5>
                                    <small className="text-xs text-zinc-400">
                                        {selectedDate.month} {selectedDate.date}, {selectedDate.year}
                                    </small>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="text-zinc-400 hover:text-white transition-colors focus:outline-none"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="px-5 py-4">
                                {isChecking && (
                                    <div className="text-center py-4 mb-3 bg-lime-500/10 rounded-lg border border-lime-500/20">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-lime-500 mx-auto"></div>
                                        <p className="text-sm text-lime-400 mt-2">Checking availability...</p>
                                    </div>
                                )}

                                <ul className="space-y-2">
                                    {finalServices.map((svc, i) => {
                                        const isBooked = bookedServices?.has(svc.service);
                                        // ✅ ETO ANG SUSI: Galing sa database ang disableServices
                                        const isDisabled = disableServices.includes(svc.service);
                                        const isAvailable = availableServices.includes(svc.service);
                                        const hasConflict = !isAvailable && !isBooked && !isDisabled;
                                        const isUnselectable = isBooked || isDisabled || !isAvailable || isChecking;
                                        const isCurrentSelected = selected === svc.service;

                                        let badgeText = "";
                                        let badgeColor = "";
                                        
                                        if (isDisabled) {
                                            badgeText = "🚫 Unavailable";
                                            badgeColor = "bg-zinc-700 text-zinc-400";
                                        } else if (isBooked) {
                                            badgeText = "📅 Booked";
                                            badgeColor = "bg-red-500/20 border border-red-500/50 text-red-400";
                                        } else if (hasConflict) {
                                            badgeText = "⏳ Pending";
                                            badgeColor = "bg-amber-500/20 border border-amber-500/50 text-amber-400";
                                        }

                                        return (
                                            <li
                                                key={i}
                                                onClick={() => !isUnselectable && setSelected(svc.service)}
                                                className={`
                                                    p-3 rounded-lg border transition-all duration-200
                                                    ${isCurrentSelected && !isUnselectable
                                                        ? `${svc.selectedBg} ${svc.selectedText} font-bold shadow-lg ring-2 ${svc.ring}`
                                                        : isDisabled
                                                            ? "border-zinc-700 bg-zinc-800/30 opacity-50 cursor-not-allowed"
                                                            : "border-zinc-800 bg-zinc-800/40 hover:bg-zinc-800 hover:border-zinc-700 cursor-pointer"
                                                    }
                                                    ${isUnselectable ? "cursor-not-allowed" : ""}
                                                    ${hasConflict ? "border-amber-500/30 bg-amber-500/5" : ""}
                                                `}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center gap-3">
                                                        {svc.image && (
                                                            <img
                                                                src={svc.image}
                                                                alt={`logo-${i}`}
                                                                className={`w-12 h-12 object-contain rounded-md ${isDisabled ? "opacity-40 grayscale" : ""}`}
                                                            />
                                                        )}
                                                        <div>
                                                            <span className={`text-sm font-semibold ${isDisabled ? 'text-zinc-500 line-through' : 'text-zinc-300'}`}>
                                                                {svc.service}
                                                            </span>
                                                            {badgeText && (
                                                                <span className={`ml-2 ${badgeColor} text-[10px] font-bold px-2 py-0.5 rounded`}>
                                                                    {badgeText}
                                                                </span>
                                                            )}
                                                            {isDisabled && (
                                                                <span className="block text-[9px] text-zinc-500 mt-0.5">
                                                                    Disabled by admin
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
                                                        className="w-4 h-4"
                                                    />
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>

                                <div className="flex gap-2 mt-5">
                                    <button
                                        className="flex-1 py-2.5 text-sm font-semibold rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors focus:outline-none"
                                        onClick={handleClose}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className={`flex-1 py-2.5 text-sm font-bold rounded-lg bg-lime-500 text-black hover:bg-lime-400 transition-colors shadow-md shadow-lime-500/10 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none`}
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
                    onClose={handleClose}
                    showReceipt={showReceipt}
                    serviceName={selected}
                    handleBackOptions={handleBackOptions}
                    serviceConfig={serviceConfig}
                />
            )}
        </>
    );
};