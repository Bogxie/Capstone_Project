import { useState } from 'react';
import { UpdateStatus } from './UpdateStatus';
import { colorStatus } from '../assets/utils/colorStatus';
import { formatCurrency } from "../assets/Utils/formatCurrency";
import { AdminViewModal } from './modals/AdmineViewModal';
import { ConfirmModal } from './modals/ConfirmModal';
import { CompleteModal } from './modals/CompleteModal'
import BookingLogo from '../assets/Images/bookings.png';

export const AdminDashboard = ({ bookings, UpdateBooking }) => {

    const [modalType, setModalType] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    const item_per_page = 3;
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
                <div className="text-center text-gray-500 mt-10">
                    <p>No bookings found.</p>
                </div>
            ) : (
                <>
                    <p className="text-cyan-400 text-xs mb-2">
                        Showing {bookings.length} result(s)
                    </p>

                    {paginatedBookings.map((booking) => (
                        <div key={booking.bookID} className="bg-black/75 border border-gray-600 rounded-xl mt-3 p-4">
                            <div className="flex flex-col md:flex-row gap-4 items-center">

                                {/* LEFT — Logo + Book ID */}
                                <div className="flex flex-col items-center text-center md:border-r md:border-cyan-500 md:pr-4 shrink-0">
                                    <img src={BookingLogo} alt="logo" className="w-10 mb-2" />
                                    <div className="text-cyan-400 font-semibold text-xs">
                                        {booking.bookID}
                                    </div>
                                </div>

                                {/* MIDDLE — Details */}
                                <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-2 text-cyan-400 text-xs">
                                    <div>
                                        <div className="font-semibold">📅 Date</div>
                                        <div>{booking.month} {booking.date}, {booking.year}</div>
                                    </div>
                                    <div>
                                        <div className="font-semibold">🕐 Time</div>
                                        <div>{booking.timeStart} {booking.timeStartAmPm} - {booking.timeEnd} {booking.timeEndAmPm}</div>
                                    </div>
                                    <div>
                                        <div className="font-semibold">📍 Venue</div>
                                        <div className="truncate">{booking.venue}</div>
                                    </div>
                                    <div>
                                        <div className="font-semibold">🎉 Event</div>
                                        <div className="truncate">{booking.description}</div>
                                    </div>
                                    <div>
                                        <div className="font-semibold">⚡ Status</div>
                                        <span className={`inline-block text-xs font-bold px-3 py-0.5 rounded-full text-black ${colorStatus(booking.status)}`}>
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
                                <div className="flex flex-col gap-2 w-full md:w-32 shrink-0">
                                    <UpdateStatus
                                        status={booking.status}
                                        handleConfirmation={() => openModal(booking, 'Confirmed')}
                                        handleComplete={() => openModal(booking, 'Completed')}
                                    />
                                    <button
                                        className="w-full px-4 py-1.5 text-sm border border-cyan-400 text-cyan-400 rounded-lg hover:bg-cyan-400 hover:text-black transition-colors"
                                        onClick={() => openModal(booking, 'View')}
                                    >
                                        👁 View
                                    </button>
                                </div>

                            </div>
                        </div>
                    ))}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-4">
                            <button
                                className="px-3 py-1 text-sm border border-cyan-400 text-cyan-400 rounded-lg hover:bg-cyan-400 hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={safePage === 1}
                            >
                                ‹
                            </button>
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    className={`px-3 py-1 text-sm rounded-lg transition-colors ${safePage === i + 1
                                        ? "bg-cyan-400 text-black font-bold"
                                        : "border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black"
                                        }`}
                                    onClick={() => setCurrentPage(i + 1)}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                className="px-3 py-1 text-sm border border-cyan-400 text-cyan-400 rounded-lg hover:bg-cyan-400 hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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