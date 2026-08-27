import { useState } from 'react';
import { UpdateStatus } from './UpdateStatus';
import { formatCurrency } from "../assets/Utils/formatCurrency";
import { formatTime } from '../assets/utils/formatTime';
import { AdminViewModal } from './modals/AdminViewModal';
import { ConfirmModal } from './modals/ConfirmModal';
import { CompleteModal } from './modals/CompleteModal';
import { RevertModal } from './modals/RevertModal';
import BookingLogo from '../assets/Images/bookings.png';

export const AdminDashboard = ({ bookings, updateBooking }) => {

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
        updateBooking(id, newStatus);
        closeModal();
    };

    const handleComplete = (id, newStatus) => {
        updateBooking(id, newStatus);
        closeModal();
    };

    const handleRevert = (id, currentStatus) => {
        let newStatus = 'Pending';

        if (currentStatus === 'Completed') {
            newStatus = 'Confirmed';
        } else if (currentStatus === 'Confirmed' || currentStatus === 'Cancelled') {
            newStatus = 'Pending';
        }

        updateBooking(id, { status: newStatus });
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

            {modalType === 'Revert' && (
                <RevertModal
                    booking={selectedBooking}
                    handleRevert={handleRevert}
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
                <div className="text-center text-zinc-500 py-10">
                    <p className="text-sm">No bookings found.</p>
                </div>
            ) : (
                <>
                    <p className="text-[#b6ff2e] text-[10px] mb-2 opacity-70">
                        {bookings.length} bookings
                    </p>

                    {paginatedBookings.map((booking) => (
                        <div key={booking.bookID || booking.booking_id} className="bg-[#23262f] border border-[#3a3d48] rounded-lg mb-2 p-2.5">

                            {/* ✅ MOBILE CARD */}
                            <div className="block sm:hidden">
                                {/* Row 1: ID + Status (naka-center) + Balance */}
                                <div className="flex items-center justify-between mb-1.5">
                                    <div className="flex items-center gap-1.5">
                                        <img src={BookingLogo} alt="logo" className="w-4 h-4" />
                                        <span className="text-[#b6ff2e] font-bold text-[10px] tracking-wide">
                                            {booking.bookID}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[#b6ff2e] text-[10px] font-bold">
                                            ₱{formatCurrency(booking.total - booking.downpayment)}
                                        </span>
                                    </div>
                                </div>

                                {/* Row 2: Date + Time + Venue (inline) */}
                                <div className="flex items-center gap-1.5 text-[9px] text-zinc-400 mb-1.5 flex-wrap">
                                    <span>📅 {booking.month} {booking.date}, {booking.year}</span>
                                    <span className="text-zinc-600">•</span>
                                    <span>🕐{formatTime(booking)}</span>
                                    <span className="text-zinc-600">•</span>
                                    <span className="text-zinc-300 truncate max-w-[120px]">{booking.venue}</span>
                                </div>

                                {/* Row 3: Action Buttons */}
                                <div className="flex items-center gap-1.5">
                                    <div className="flex-1">
                                        <UpdateStatus
                                            status={booking.status}
                                            handleConfirmation={() => openModal(booking, 'Confirmed')}
                                            handleComplete={() => openModal(booking, 'Completed')}
                                            handleRevert={() => openModal(booking, 'Revert')}
                                        />
                                    </div>
                                    <button
                                        className="flex-1 px-2 py-1 text-[9px] border border-[#b6ff2e]/50 text-[#b6ff2e] rounded hover:bg-[#b6ff2e] hover:text-[#23262f] transition-colors font-medium text-center"
                                        onClick={() => openModal(booking, 'View')}
                                    >
                                        View
                                    </button>
                                </div>
                            </div>

                            {/* ✅ DESKTOP TABLE VIEW */}
                            <div className="hidden sm:block">
                                <div className="flex flex-col md:flex-row gap-1.5 items-start md:items-center">

                                    <div className="flex items-center gap-2 md:border-r md:border-[#3a3d48] md:pr-3 shrink-0">
                                        <img src={BookingLogo} alt="logo" className="w-5" />
                                        <div className="text-[#b6ff2e] font-semibold text-[10px] whitespace-nowrap">
                                            {booking.bookID}
                                        </div>
                                    </div>

                                    <div className="flex-1 grid grid-cols-4 gap-1 text-[#b6ff2e] text-[10px] min-w-0">
                                        <div className="min-w-0">
                                            <div className="font-semibold text-[8px] text-zinc-400">📅 Date</div>
                                            <div className="text-white text-[10px] truncate">{booking.month} {booking.date}, {booking.year}</div>
                                        </div>
                                        <div className="min-w-0">
                                            <div className="font-semibold text-[8px] text-zinc-400">🕐 Time</div>
                                            <div className="text-white text-[10px] truncate">{formatTime(booking)}</div>
                                        </div>
                                        <div className="min-w-0">
                                            <div className="font-semibold text-[8px] text-zinc-400">📍 Venue</div>
                                            <div className="text-white text-[10px] truncate">{booking.venue}</div>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <div className="font-semibold text-[8px] text-zinc-400">💰 Balance</div>
                                            <div className="text-[#b6ff2e] text-[10px] font-bold">
                                                ₱{formatCurrency(booking.total - booking.downpayment)}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-row md:flex-col gap-1 w-full md:w-28 shrink-0">
                                        <UpdateStatus
                                            status={booking.status}
                                            handleConfirmation={() => openModal(booking, 'Confirmed')}
                                            handleComplete={() => openModal(booking, 'Completed')}
                                            handleRevert={() => openModal(booking, 'Revert')}
                                        />
                                        <button
                                            className="w-full px-2 py-1 text-[10px] border border-[#b6ff2e] text-[#b6ff2e] rounded-lg hover:bg-[#b6ff2e] hover:text-[#23262f] transition-colors"
                                            onClick={() => openModal(booking, 'View')}
                                        >
                                            👁 View
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    ))}

                    {totalPages > 1 && (
                        <div className="flex flex-wrap justify-center items-center gap-1 mt-3">
                            <button
                                className="px-2 py-0.5 text-[9px] border border-[#b6ff2e]/50 text-[#b6ff2e] rounded hover:bg-[#b6ff2e] hover:text-[#23262f] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={safePage === 1}
                            >
                                ‹
                            </button>

                            {[...Array(totalPages)].map((_, i) => {
                                const isActive = safePage === i + 1;
                                const show = window.innerWidth < 640
                                    ? Math.abs(i + 1 - safePage) <= 1 || i === 0 || i === totalPages - 1
                                    : true;

                                if (!show) {
                                    if (i === 1 || i === totalPages - 2) {
                                        return <span key={i} className="px-1 text-zinc-600 text-[9px]">…</span>;
                                    }
                                    return null;
                                }

                                return (
                                    <button
                                        key={i}
                                        className={`px-2 py-0.5 text-[9px] rounded transition-all ${
                                            isActive
                                                ? "bg-[#b6ff2e] text-[#23262f] font-bold shadow-sm shadow-[#b6ff2e]/20"
                                                : "border border-[#b6ff2e]/30 text-[#b6ff2e]/70 hover:border-[#b6ff2e] hover:text-[#b6ff2e] hover:bg-[#b6ff2e]/10"
                                        }`}
                                        onClick={() => setCurrentPage(i + 1)}
                                    >
                                        {i + 1}
                                    </button>
                                );
                            })}

                            <button
                                className="px-2 py-0.5 text-[9px] border border-[#b6ff2e]/50 text-[#b6ff2e] rounded hover:bg-[#b6ff2e] hover:text-[#23262f] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
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