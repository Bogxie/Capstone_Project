import { useState } from "react";
import { useAuth } from "../context/useAuth.js";
import { useBooking } from "../context/useBooking.js";
import { UserDashboard } from "./UserDashboard.jsx";
import { service } from '../assets/utils/services.js';
import { service_config } from '../assets/utils/ServiceConfig.js';


const themeMap = {
    "header-golden": "bg-[#F59E0B] text-black",
    "header-snoop": "bg-[#92400E] text-white",
    "header-projector": "bg-[#1E293B] text-white",
};

const tabs = [
    { key: "User-all", label: "All", color: "text-blue-400", filter: () => true },
    { key: "User-pending", label: "Pending", color: "text-yellow-400", filter: (b) => b.status === 'Pending' },
    { key: "User-confirm", label: "Confirmed", color: "text-cyan-400", filter: (b) => b.status === 'Confirmed' },
    { key: "User-complete", label: "Completed", color: "text-green-400", filter: (b) => b.status === 'Complete' },
    { key: "User-cancel", label: "Cancelled", color: "text-red-400", filter: (b) => b.status === 'Cancelled' },
];

export const UserPage = () => {

    const { currentUser } = useAuth();
    const { bookings = [], updateBooking } = useBooking();
    const [activeTab, setActiveTab] = useState("User-all");
    const [selectedService, setSelectedService] = useState(null);

    const sortedBookings = [...bookings].sort((a, b) => {
        const idA = parseInt(a.bookID.split('-')[1]);
        const idB = parseInt(b.bookID.split('-')[1]);
        return idB - idA;
    });

    const activeFilter = tabs.find(t => t.key === activeTab)?.filter || (() => true);

    const filteredBookings = sortedBookings
        .filter(b => b.service === selectedService)
        .filter(activeFilter);

    return (
        <>
            <title>User Dashboard</title>
            <div className="max-w-4xl mx-auto">

                {/* Service Cards */}
                {!selectedService && (
                    <div className="grid grid-cols-3 gap-3 my-3">
                        {service.map((svc) => (
                            <div
                                key={svc.brand}
                                onClick={() => setSelectedService(svc.brand)}
                                className={`${svc.class} rounded-xl p-3 text-center cursor-pointer shadow hover:scale-105 transition-transform`}
                            >
                                <div className="h-20 flex items-center justify-center">
                                    <img
                                        src={svc.logo}
                                        alt={svc.brand}
                                        className="max-h-full max-w-[140px] object-contain"
                                    />
                                </div>
                                <small className={`font-bold ${svc.brand !== "Golden Hour" ? "text-white" : "text-black"}`}>
                                    {svc.brand}
                                </small>
                                <span className="block bg-[#212529] text-white text-xs font-semibold px-2 py-0.5 rounded mt-2">
                                    {bookings.filter(b => b.service === svc.brand && b.userID === currentUser?.uid).length} bookings
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Selected Service View */}
                {selectedService && (
                    <>
                        {/* Back + Badge */}
                        <div className="flex items-center gap-2 my-3">
                            <button
                                className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-500 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                                onClick={() => {
                                    setSelectedService(null);
                                    setActiveTab("User-all");
                                }}
                            >
                                ← Back
                            </button>
                            <span className={`px-3 py-1 rounded-full text-sm font-bold ${themeMap[service_config[selectedService]?.theme.color] ?? "bg-gray-700 text-white"}`}>
                                {selectedService}
                            </span>
                        </div>

                        {/* Tabs + Booking List */}
                        <div className="bg-black/50 rounded-xl border border-gray-700">

                            {/* Tabs */}
                            <div className="flex border-b border-gray-700">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.key}
                                        type="button"
                                        onClick={() => setActiveTab(tab.key)}
                                        className={`flex-1 py-2 text-xs font-semibold transition-colors ${tab.color} ${activeTab === tab.key
                                            ? "border-b-2 border-current bg-white/5"
                                            : "hover:bg-white/5"
                                            }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* Booking List */}
                            <div
                                className="p-3"
                                style={{
                                    maxHeight: '38rem',
                                    overflowY: 'auto',
                                    scrollbarWidth: 'none',
                                    msOverflowStyle: 'none',
                                }}
                            >
                                <UserDashboard
                                    key={activeTab + selectedService}
                                    bookings={filteredBookings}
                                    updateBooking={updateBooking}
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>

        </>
    );
};