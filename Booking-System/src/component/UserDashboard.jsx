import { useState } from 'react';
import { useFeedback } from '../context/useFeedback';
import { useAuth } from '../context/useAuth';
import { EditModal } from './modals/EditModal';
import { CancelModal } from './modals/CancelModal';
import { ViewModal } from './modals/ViewModal';
import { RatingModal } from './modals/RatingModal';
import { UserButtons } from './UserButtons';
import { colorStatus } from '../assets/Utils/colorStatus';
import { formatTime } from '../assets/utils/formatTime';

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

        console.log('📝 Booking ID to update:', bookingId);

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

            {bookings.length === 0 && (
                <div className="text-center text-zinc-500 mt-10">
                    <p>No bookings found.</p>
                </div>
            )}

            {bookings.map((booking) => {
                const hasRated = feedbacks.some(f =>
                    f.bookID === booking.bookID ||
                    f.booking_id === booking.booking_id ||
                    f.bookingId === booking.booking_id
                );
                const displayId = booking.display_id || booking.bookID || `BK-${String(booking.booking_id).padStart(6, '0')}`;

                return (
                    <div key={booking.booking_id || booking.bookID} className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 mb-1.5 gap-3">
                        <div className="shrink-0 text-center">
                            <div className="text-lime-400 font-bold text-xs">{displayId}</div>
                        </div>

                        <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-x-3 text-xs min-w-0">
                            <div className="min-w-0">
                                <div className="text-lime-400 font-semibold mb-0.5">📅 Date</div>
                                <div className="text-white truncate">{booking.month} {booking.date || booking.day}, {booking.year}</div>
                            </div>

                            <div className="min-w-0">
                                <div className="text-lime-400 font-semibold mb-0.5">🕐 Time</div>
                                <div className="text-white truncate">{formatTime(booking)}</div>
                            </div>

                            <div className="min-w-0 hidden md:block">
                                <div className="text-lime-400 font-semibold mb-0.5">⚡ Status</div>
                                <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full text-black ${colorStatus(booking.status)}`}>
                                    {booking.status}
                                </span>
                            </div>
                        </div>

                        <div className="shrink-0">
                            <UserButtons
                                status={booking.status}
                                hasRated={hasRated}
                                handleCancellation={() => openModal(booking, "Cancel")}
                                handleEdit={() => openModal(booking, "Edit")}
                                handleView={() => openModal(booking, "View")}
                                handleRate={() => openModal(booking, "Rate")}
                            />
                        </div>
                    </div>
                );
            })}
        </>
    );
};