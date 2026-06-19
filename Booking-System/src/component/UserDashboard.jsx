import { useState } from 'react';
import { useFeedback } from '../context/useFeedback';
import { EditModal } from './modals/EditModal';
import { CancelModal } from './modals/CancelModal';
import { ViewModal } from './Modals/ViewModal';
import { RatingModal } from './Modals/RatingModal';
import { UserButtons } from './UserButtons';
import { colorStatus } from '../assets/Utils/colorStatus';

export const UserDashboard = ({ bookings, updateBooking }) => {

    const { feedbacks, saveFeedback } = useFeedback();
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

    const handleCancellation = (id, newStatus) => {
        updateBooking(id, newStatus);
        closeModal();
    };

    const handleEdit = (updatedData) => {
        updateBooking(updatedData.bookID, updatedData);
        closeModal();
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
                    key={selectedBooking?.bookID}
                    booking={selectedBooking}
                    existingFeedback={feedbacks.find(f => f.bookID === selectedBooking?.bookID) || null}
                    saveFeedback={saveFeedback}
                    onClose={resetModal}
                />
            )}

            {bookings.length === 0 && (
                <div className="text-center text-gray-500 mt-10">
                    <p>No bookings found.</p>
                </div>
            )}

            {bookings.map((booking) => {
                const hasRated = feedbacks.some(f => f.bookID === booking.bookID);
                return (
                    <div key={booking.bookID} className="flex items-center justify-between bg-[#111] border border-gray-800 rounded-lg px-3 py-2 mb-1.5 gap-3">

                        {/* Book ID */}
                        <div className="shrink-0 text-center">
                            <div className="text-green-400 font-bold text-xs">{booking.bookID}</div>
                        </div>

                        <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-x-3 text-xs min-w-0">

                            <div className="min-w-0">
                                <div className="text-green-400 font-semibold mb-0.5">📅 Date</div>
                                <div className="text-white truncate">{booking.month} {booking.date}, {booking.year}</div>
                            </div>

                            <div className="min-w-0">
                                <div className="text-green-400 font-semibold mb-0.5">🕐 Time</div>
                                <div className="text-white truncate">{booking.timeStart}{booking.timeStartAmPm} - {booking.timeEnd}{booking.timeEndAmPm}</div>
                            </div>

                            {/* Binago: Nilagyan ng 'hidden md:block' para maitago sa small screen */}
                            <div className="min-w-0 hidden md:block">
                                <div className="text-green-400 font-semibold mb-0.5">⚡ Status</div>
                                <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full text-black ${colorStatus(booking.status)}`}>
                                    {booking.status}
                                </span>
                            </div>

                        </div>

                        {/* Buttons */}
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