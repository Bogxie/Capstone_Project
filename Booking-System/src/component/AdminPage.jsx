// component/AdminPage.jsx
import { useState, useMemo } from "react";
import { AdminDashboard } from "./AdminDashboard";
import { service } from '../assets/utils/services.js'
import { service_config } from '../assets/Utils/ServiceConfig.js';
import { RevenueReport } from "./RevenueReport.jsx";
import { useBooking } from "../context/useBooking.js";

const themeMap = {
    "header-golden": "bg-[#F59E0B] text-black",
    "header-snoop": "bg-[#92400E] text-white",
    "header-projector": "bg-[#06B6D4] text-white",
};

const tabs = [
    { key: "All", label: "All", color: "text-blue-400", filter: () => true },
    { key: "Pending", label: "Pending", color: "text-yellow-400", filter: (b) => b.status === 'Pending' },
    { key: "Confirm", label: "Confirmed", color: "text-cyan-400", filter: (b) => b.status === 'Confirmed' },
    { key: "Complete", label: "Completed", color: "text-green-400", filter: (b) => b.status === 'Completed' },
    { key: "Cancel", label: "Cancelled", color: "text-red-400", filter: (b) => b.status === 'Cancelled' },
];

export const AdminPage = () => {
    const { bookings, updateBooking } = useBooking();
    const [search, setSearch] = useState("");
    const [activeTab, setActiveTab] = useState("All");
    const [selectedService, setSelectedService] = useState(null);
    
    const sortedBookings = useMemo(() => {
        return [...bookings].sort((a, b) => {
            const idA = a.booking_id || parseInt(a.bookID?.split('-')[1] || 0);
            const idB = b.booking_id || parseInt(b.bookID?.split('-')[1] || 0);
            return idB - idA;
        });
    }, [bookings]);

    const activeFilter = tabs.find(t => t.key === activeTab)?.filter || (() => true);
    
    const filteredBookings = sortedBookings
        .filter(b => b.service === selectedService)
        .filter(activeFilter)
        .filter(booking => {
            const searchLower = search.trim().toLowerCase();
            return (
                (booking.display_id || booking.bookID || "").toLowerCase().includes(searchLower) ||
                (booking.venue || "").toLowerCase().includes(searchLower) ||
                (booking.description || "").toLowerCase().includes(searchLower)
            );
        });

    return (
        <>
            <title>Admin Dashboard</title>
            <div className="max-w-4xl mx-auto">

                {!selectedService && <RevenueReport bookings={bookings} />}

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
                                    {bookings.filter(b => b.service === svc.brand).length} bookings
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
                                    setSearch("");
                                    setActiveTab("All");
                                }}
                            >
                                ← Back
                            </button>
                            <span className={`px-3 py-1 rounded-full text-sm font-bold ${themeMap[service_config[selectedService]?.theme.color] ?? "bg-gray-700 text-white"}`}>
                                {selectedService}
                            </span>
                        </div>

                        {/* Search */}
                        <div className="flex items-center gap-2 mb-3 bg-gray-700 border border-gray-600 rounded-lg overflow-hidden">
                            <span className="px-3 text-cyan-400">🔍</span>
                            <input
                                type="text"
                                className="flex-1 bg-transparent text-white text-sm py-2 focus:outline-none placeholder-gray-400"
                                placeholder="Search by Book ID, venue, or event..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            {search && (
                                <button
                                    className="px-3 py-2 text-gray-400 hover:text-white transition-colors"
                                    onClick={() => setSearch("")}
                                >
                                    ✕
                                </button>
                            )}
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
                                    maxHeight: '28rem',
                                    overflowY: 'auto',
                                    scrollbarWidth: 'none',
                                    msOverflowStyle: 'none',
                                }}
                            >
                                <AdminDashboard
                                    key={activeTab + search + selectedService}
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