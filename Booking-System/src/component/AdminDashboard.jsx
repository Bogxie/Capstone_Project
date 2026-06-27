import { useState } from 'react';
import { UpdateStatus } from './UpdateStatus';
import { colorStatus } from '../assets/utils/colorStatus';
import { formatCurrency } from "../assets/Utils/formatCurrency";
import { AdminViewModal } from './modals/AdminViewModal';
import { ConfirmModal } from './modals/ConfirmModal';
import { CompleteModal } from './modals/CompleteModal'
import BookingLogo from '../assets/Images/bookings.png';

export const AdminDashboard = ({ bookings, UpdateBooking }) => {

    const [modalType, setModalType] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    const item_per_page = 5;
    const totalPages = Math.max(1, Math.ceil(bookings.length / item_per_page));
    const safePage = Math.min(currentPage, totalPages);
    const paginatedBookings = bookings.slice(
        (safePage - 1) * item_per_page,
        safePage * item_per_page
    );

    const openModal = (booking, type) => {
        setSelectedBooking(booking);
        setModalType(type);
    };

    const closeModal = () => {
        setSelectedBooking(null);
        setModalType(null);
    };

    const handleConfirmation = (id, newStatus) => {
        UpdateBooking(id, newStatus);
        closeModal();
    };

    const handleComplete = (id, newStatus) => {
        UpdateBooking(id, newStatus);
        closeModal();
    };

    return (
        <>
            {modalType === 'Confirmed' && (
                <ConfirmModal
                    booking={selectedBooking}
                    handleConfirmation={handleConfirmation}
                    onClose={closeModal}
                />
            )}

            {modalType === 'Completed' && (
                <CompleteModal
                    booking={selectedBooking}
                    handleComplete={handleComplete}
                    onClose={closeModal}
                />
            )}

            {modalType === 'View' && (
                <AdminViewModal
                    booking={selectedBooking}
                    onClose={closeModal}
                />
            )}

            {bookings.length === 0 ? (
                <div className="text-center text-gray-500 py-10">
                    <p className="text-sm">No bookings found.</p>
                </div>
            ) : (
                <>
                    <p className="text-cyan-400 text-xs mb-3">
                        Showing {bookings.length} result(s)
                    </p>

                    {paginatedBookings.map((booking) => (
                        <div key={booking.bookID} className="bg-black/75 border border-gray-600 rounded-xl mb-3 p-3 sm:p-4">
                            
                            {/* Mobile Card View */}
                            <div className="block sm:hidden">
                                {/* Header: Logo + Book ID + Status */}
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <img src={BookingLogo} alt="logo" className="w-8" />
                                        <span className="text-cyan-400 font-semibold text-xs">
                                            {booking.bookID}
                                        </span>
                                    </div>
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full text-black ${colorStatus(booking.status)}`}>
                                        {booking.status}
                                    </span>
                                </div>

                                {/* Details Grid - 2 columns */}
                                <div className="grid grid-cols-2 gap-1 text-xs text-cyan-400 mb-3">
                                    <div>
                                        <span className="text-gray-500">📅 Date</span>
                                        <div className="text-white text-xs">{booking.month} {booking.date}, {booking.year}</div>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">🕐 Time</span>
                                        <div className="text-white text-xs">{booking.timeStart} {booking.timeStartAmPm}</div>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">📍 Venue</span>
                                        <div className="text-white text-xs truncate">{booking.venue}</div>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">🎉 Event</span>
                                        <div className="text-white text-xs truncate">{booking.description}</div>
                                    </div>
                                    <div className="col-span-2">
                                        <span className="text-gray-500">💰 Balance</span>
                                        <div className="text-white text-xs font-semibold">
                                            ₱{formatCurrency(booking.total - booking.downpayment)}
                                        </div>
                                    </div>
                                </div>

                                {/* Actions - Row of buttons */}
                                <div className="flex gap-2">
                                    <UpdateStatus
                                        status={booking.status}
                                        handleConfirmation={() => openModal(booking, 'Confirmed')}
                                        handleComplete={() => openModal(booking, 'Completed')}
                                    />
                                    <button
                                        className="flex-1 px-3 py-1.5 text-xs border border-cyan-400 text-cyan-400 rounded-lg hover:bg-cyan-400 hover:text-black transition-colors"
                                        onClick={() => openModal(booking, 'View')}
                                    >
                                        👁 View
                                    </button>
                                </div>
                            </div>

                            {/* Desktop Table View */}
                            <div className="hidden sm:block">
                                <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
                                    {/* LEFT — Logo + Book ID */}
                                    <div className="flex items-center gap-3 md:border-r md:border-cyan-500 md:pr-4 shrink-0">
                                        <img src={BookingLogo} alt="logo" className="w-8" />
                                        <div className="text-cyan-400 font-semibold text-xs">
                                            {booking.bookID}
                                        </div>
                                    </div>

                                    {/* MIDDLE — Details */}
                                    <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-2 text-cyan-400 text-xs">
                                        <div>
                                            <div className="font-semibold">📅 Date</div>
                                            <div className="text-white">{booking.month} {booking.date}, {booking.year}</div>
                                        </div>
                                        <div>
                                            <div className="font-semibold">🕐 Time</div>
                                            <div className="text-white">{booking.timeStart} {booking.timeStartAmPm}</div>
                                        </div>
                                        <div>
                                            <div className="font-semibold">📍 Venue</div>
                                            <div className="text-white truncate">{booking.venue}</div>
                                        </div>
                                        <div>
                                            <div className="font-semibold">🎉 Event</div>
                                            <div className="text-white truncate">{booking.description}</div>
                                        </div>
                                        <div>
                                            <div className="font-semibold">⚡ Status</div>
                                            <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full text-black ${colorStatus(booking.status)}`}>
                                                {booking.status}
                                            </span>
                                        </div>
                                        <div>
                                            <div className="font-semibold">💰 Balance</div>
                                            <div className="inline-block bg-black text-white text-xs font-semibold px-2 py-0.5 rounded w-full text-center">
                                                ₱{formatCurrency(booking.total - booking.downpayment)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* RIGHT — Actions */}
                                    <div className="flex flex-col sm:flex-row md:flex-col gap-2 w-full sm:w-auto md:w-32 shrink-0">
                                        <UpdateStatus
                                            status={booking.status}
                                            handleConfirmation={() => openModal(booking, 'Confirmed')}
                                            handleComplete={() => openModal(booking, 'Completed')}
                                        />
                                        <button
                                            className="w-full px-3 py-1.5 text-xs border border-cyan-400 text-cyan-400 rounded-lg hover:bg-cyan-400 hover:text-black transition-colors"
                                            onClick={() => openModal(booking, 'View')}
                                        >
                                            👁 View
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    ))}

                    {/* Pagination - Responsive */}
                    {totalPages > 1 && (
                        <div className="flex flex-wrap justify-center items-center gap-1 sm:gap-2 mt-4">
                            <button
                                className="px-2 sm:px-3 py-1 text-xs sm:text-sm border border-cyan-400 text-cyan-400 rounded-lg hover:bg-cyan-400 hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={safePage === 1}
                            >
                                ‹
                            </button>
                            
                            {/* Show limited page numbers on mobile */}
                            <div className="flex gap-1 sm:gap-2">
                                {[...Array(totalPages)].map((_, i) => {
                                    // Show only current page, first, last, and neighbors on mobile
                                    const show = window.innerWidth < 640 
                                        ? Math.abs(i + 1 - safePage) <= 1 || i === 0 || i === totalPages - 1
                                        : true;
                                    
                                    if (!show) {
                                        if (i === 1 || i === totalPages - 2) {
                                            return <span key={i} className="px-1 text-gray-500">…</span>;
                                        }
                                        return null;
                                    }
                                    
                                    return (
                                        <button
                                            key={i}
                                            className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-lg transition-colors ${
                                                safePage === i + 1
                                                    ? "bg-cyan-400 text-black font-bold"
                                                    : "border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black"
                                            }`}
                                            onClick={() => setCurrentPage(i + 1)}
                                        >
                                            {i + 1}
                                        </button>
                                    );
                                })}
                            </div>

                            <button
                                className="px-2 sm:px-3 py-1 text-xs sm:text-sm border border-cyan-400 text-cyan-400 rounded-lg hover:bg-cyan-400 hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={safePage === totalPages}
                            >
                                ›
                            </button>
                        </div>
                    )}
                </>
            )}
        </>
    );
};