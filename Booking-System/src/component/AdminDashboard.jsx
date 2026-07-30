import { useState } from 'react';
import { UpdateStatus } from './UpdateStatus';
import { colorStatus } from '../assets/utils/colorStatus';
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

    const handleRevert = (id) => {
        updateBooking(id, { status: 'Pending' });
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
                    <p className="text-lime-400 text-xs mb-3">
                        Showing {bookings.length} result(s)
                    </p>

                    {paginatedBookings.map((booking) => (
                        <div key={booking.bookID || booking.booking_id} className="bg-zinc-900 border border-zinc-800 rounded-xl mb-3 p-2 sm:p-3">

                            {/* Mobile Card View */}
                            <div className="block sm:hidden">
                                <div className="flex items-center justify-between mb-1.5">
                                    <div className="flex items-center gap-1.5">
                                        <img src={BookingLogo} alt="logo" className="w-5" />
                                        <span className="text-lime-400 font-semibold text-[10px]">
                                            {booking.bookID}
                                        </span>
                                    </div>
                                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full text-black ${colorStatus(booking.status)}`}>
                                        {booking.status}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-0.5 text-[10px] text-lime-400 mb-1.5">
                                    <div className="min-w-0">
                                        <span className="text-zinc-500 text-[8px]">📅 Date</span>
                                        <div className="text-white text-[10px] truncate">{booking.month} {booking.date}</div>
                                    </div>
                                    <div className="min-w-0">
                                        <span className="text-zinc-500 text-[8px]">🕐 Time</span>
                                        <div className="text-white text-[10px] truncate">{booking.timeStart}</div>
                                    </div>
                                    <div className="col-span-2 min-w-0">
                                        <span className="text-zinc-500 text-[8px]">📍 Venue</span>
                                        <div className="text-white text-[10px] truncate">{booking.venue}</div>
                                    </div>
                                    <div className="col-span-2">
                                        <span className="text-zinc-500 text-[8px]">💰 Balance</span>
                                        <div className="text-white text-[10px] font-semibold">
                                            ₱{formatCurrency(booking.total - booking.downpayment)}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <UpdateStatus
                                        status={booking.status}
                                        handleConfirmation={() => openModal(booking, 'Confirmed')}
                                        handleComplete={() => openModal(booking, 'Completed')}
                                        handleRevert={() => openModal(booking, 'Revert')}
                                    />
                                    <button
                                        className="w-full px-2 py-1 text-[10px] border border-lime-500 text-lime-400 rounded-lg hover:bg-lime-500 hover:text-black transition-colors"
                                        onClick={() => openModal(booking, 'View')}
                                    >
                                        👁 View
                                    </button>
                                </div>
                            </div>

                            {/* Desktop Table View */}
                            <div className="hidden sm:block">
                                <div className="flex flex-col md:flex-row gap-1.5 items-start md:items-center">

                                    <div className="flex items-center gap-2 md:border-r md:border-lime-500 md:pr-2 shrink-0">
                                        <img src={BookingLogo} alt="logo" className="w-6" />
                                        <div className="text-lime-400 font-semibold text-[10px] whitespace-nowrap">
                                            {booking.bookID}
                                        </div>
                                    </div>

                                    <div className="flex-1 grid grid-cols-4 gap-1 text-lime-400 text-[10px] min-w-0">
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
                                    </div>

                                    <div className="flex flex-row md:flex-col gap-1 w-full md:w-28 shrink-0">
                                        <UpdateStatus
                                            status={booking.status}
                                            handleConfirmation={() => openModal(booking, 'Confirmed')}
                                            handleComplete={() => openModal(booking, 'Completed')}
                                            handleRevert={() => openModal(booking, 'Revert')}
                                        />
                                        <button
                                            className="w-full px-2 py-1 text-[10px] border border-lime-500 text-lime-400 rounded-lg hover:bg-lime-500 hover:text-black transition-colors"
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
                                className="px-2 py-0.5 text-[10px] border border-lime-500 text-lime-400 rounded hover:bg-lime-500 hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={safePage === 1}
                            >
                                ‹
                            </button>

                            <div className="flex gap-0.5">
                                {[...Array(totalPages)].map((_, i) => {
                                    const show = window.innerWidth < 640
                                        ? Math.abs(i + 1 - safePage) <= 1 || i === 0 || i === totalPages - 1
                                        : true;

                                    if (!show) {
                                        if (i === 1 || i === totalPages - 2) {
                                            return <span key={i} className="px-1 text-zinc-500 text-[10px]">…</span>;
                                        }
                                        return null;
                                    }

                                    return (
                                        <button
                                            key={i}
                                            className={`px-2 py-0.5 text-[10px] rounded transition-colors ${safePage === i + 1
                                                ? "bg-lime-500 text-black font-bold"
                                                : "border border-lime-500 text-lime-400 hover:bg-lime-500 hover:text-black"
                                                }`}
                                            onClick={() => setCurrentPage(i + 1)}
                                        >
                                            {i + 1}
                                        </button>
                                    );
                                })}
                            </div>

                            <button
                                className="px-2 py-0.5 text-[10px] border border-lime-500 text-lime-400 rounded hover:bg-lime-500 hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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