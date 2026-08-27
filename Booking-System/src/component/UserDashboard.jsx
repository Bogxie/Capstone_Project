import { useState } from 'react';
import { useFeedback } from '../context/useFeedback';
import { useAuth } from '../context/useAuth';
import { UserButtons } from './UserButtons';
import { EditModal } from './modals/EditModal';
import { CancelModal } from './modals/CancelModal';
import { ViewModal } from './modals/ViewModal';
import { RatingModal } from './modals/RatingModal';
import { formatTime } from '../assets/utils/formatTime';
import { formatCurrency } from '../assets/utils/formatCurrency';
import BookingLogo from '../assets/Images/bookings.png';

export const UserDashboard = ({ bookings, updateBooking }) => {
    const { feedbacks } = useFeedback();
    const { currentUser } = useAuth();
    const [modalType, setModalType] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState(null);

    const openModal = (booking, type) => {
        setSelectedBooking(booking);
        setModalType(type);
    };

    const closeModal = () => setModalType(null);

    const resetModal = () => {
        setSelectedBooking(null);
        setModalType(null);
    };

    const handleCancellation = async (id, newStatus) => {
        const statusData = typeof newStatus === 'string'
            ? { status: newStatus }
            : newStatus;
        try {
            await updateBooking(id, statusData);
        } catch (err) {
            console.error('❌ Error cancelling booking:', err);
            alert('Failed to cancel booking. Please try again.');
            return;
        }
        closeModal();
    };

    const handleEdit = async (updatedData) => {
        console.log('📝 EditModal submitted:', updatedData);

        const bookingId = updatedData.booking_id || updatedData.bookID || selectedBooking?.booking_id || selectedBooking?.bookID;

        if (!bookingId) {
            console.error('❌ No booking ID found!');
            alert('Error: Booking ID not found. Please try again.');
            return;
        }

        const dataToUpdate = {
            ...updatedData,
            booking_id: bookingId,
        };
        const result = await updateBooking(bookingId, dataToUpdate);
        return result;
    };

    const findExistingFeedback = (booking) => {
        if (!booking) return null;

        return feedbacks.find(f =>
            f.bookID === booking.bookID ||
            f.booking_id === booking.booking_id ||
            f.bookingId === booking.booking_id
        ) || null;
    };

    return (
        <>
            {modalType === 'Cancel' && (
                <CancelModal
                    booking={selectedBooking}
                    handleCancellation={handleCancellation}
                    onClose={closeModal}
                />
            )}
            {modalType === 'Edit' && (
                <EditModal
                    booking={selectedBooking}
                    handleEdit={handleEdit}
                    onClose={closeModal}
                />
            )}
            {modalType === 'View' && (
                <ViewModal
                    booking={selectedBooking}
                    onClose={closeModal}
                />
            )}
            {modalType === 'Rate' && selectedBooking && (
                <RatingModal
                    key={selectedBooking?.booking_id || selectedBooking?.bookID}
                    booking={{
                        ...selectedBooking,
                        fullName: currentUser?.full_name || currentUser?.username || 'User',
                        full_name: currentUser?.full_name || currentUser?.username || 'User',
                    }}
                    existingFeedback={findExistingFeedback(selectedBooking)}
                    onClose={resetModal}
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

                    {bookings.map((booking) => {
                        const hasRated = feedbacks.some(f =>
                            f.bookID === booking.bookID ||
                            f.booking_id === booking.booking_id ||
                            f.bookingId === booking.booking_id
                        );
                        const displayId = booking.display_id || booking.bookID || `BK-${String(booking.booking_id).padStart(6, '0')}`;
                        const createdDate = booking.created_at || booking.booking_date;
                        const balance = Number(booking.total || 0) - Number(booking.downpayment || 0);

                        return (
                            <div key={booking.booking_id || booking.bookID} className="bg-[#23262f] border border-[#3a3d48] rounded-lg mb-2 p-2.5">

                                {/* ✅ MOBILE CARD */}
                                <div className="block sm:hidden">
                                    {/* Row 1: ID + Status + Balance */}
                                    <div className="flex items-center justify-between mb-1.5">
                                        <div className="flex items-center gap-1.5">
                                            <img src={BookingLogo} alt="logo" className="w-4 h-4" />
                                            <span className="text-[#b6ff2e] font-bold text-[10px] tracking-wide">
                                                {displayId}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[#b6ff2e] text-[10px] font-bold">
                                                ₱{formatCurrency(balance)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Row 2: Date + Time + Venue */}
                                    <div className="grid grid-cols-2 gap-1 text-[9px] mb-1.5">
                                        <div>
                                            <span className="text-zinc-500 text-[8px] block">📅 Date</span>
                                            <span className="text-white text-[10px]">{booking.month} {booking.date || booking.day}</span>
                                        </div>
                                        <div>
                                            <span className="text-zinc-500 text-[8px] block">🕐 Time</span>
                                            <span className="text-white text-[10px]">{formatTime(booking)}</span>
                                        </div>
                                        <div className="col-span-2">
                                            <span className="text-zinc-500 text-[8px] block">📍 Venue</span>
                                            <span className="text-white text-[10px] truncate block">{booking.venue}</span>
                                        </div>
                                    </div>

                                    {/* Row 3: Action Buttons - Nasa baba */}
                                    <div className="mt-1">
                                        <UserButtons
                                            status={booking.status}
                                            hasRated={hasRated}
                                            bookingDate={createdDate}
                                            handleCancellation={() => openModal(booking, "Cancel")}
                                            handleEdit={() => openModal(booking, "Edit")}
                                            handleView={() => openModal(booking, "View")}
                                            handleRate={() => openModal(booking, "Rate")}
                                        />
                                    </div>
                                </div>

                                {/* ✅ DESKTOP - Same layout, nasa baba ang buttons */}
                                <div className="hidden sm:block">
                                    {/* Row 1: ID + Details */}
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2 shrink-0">
                                            <img src={BookingLogo} alt="logo" className="w-5" />
                                            <div className="text-[#b6ff2e] font-semibold text-[10px] whitespace-nowrap">
                                                {displayId}
                                            </div>
                                        </div>

                                        <div className="flex-1 grid grid-cols-4 gap-2 text-[10px]">
                                            <div>
                                                <span className="font-semibold text-[8px] text-zinc-400">📅 Date</span>
                                                <div className="text-white truncate">{booking.month} {booking.date || booking.day}, {booking.year}</div>
                                            </div>
                                            <div>
                                                <span className="font-semibold text-[8px] text-zinc-400">🕐 Time</span>
                                                <div className="text-white truncate">{formatTime(booking)}</div>
                                            </div>
                                            <div>
                                                <span className="font-semibold text-[8px] text-zinc-400">📍 Venue</span>
                                                <div className="text-white truncate">{booking.venue}</div>
                                            </div>
                                            <div className="flex flex-col items-center">
                                                <span className="font-semibold text-[8px] text-zinc-400">💰 Balance</span>
                                                <div className="text-[#b6ff2e] font-bold">₱{formatCurrency(balance)}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Row 2: Buttons - Nasa baba, full width */}
                                    <div className="mt-2 pt-2 border-t border-[#3a3d48]">
                                        <UserButtons
                                            status={booking.status}
                                            hasRated={hasRated}
                                            bookingDate={createdDate}
                                            handleCancellation={() => openModal(booking, "Cancel")}
                                            handleEdit={() => openModal(booking, "Edit")}
                                            handleView={() => openModal(booking, "View")}
                                            handleRate={() => openModal(booking, "Rate")}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </>
            )}
        </>
    );
};