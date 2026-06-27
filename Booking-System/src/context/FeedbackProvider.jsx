import { useState } from "react";
import { FeedbackContext } from "./FeedbackContext";
import { RatingSuccessModal } from "../component/modals/RatingSuccessModal";
import { useBooking } from "./useBooking";

export const FeedbackProvider = ({ children }) => {

    const { bookings } = useBooking();
    const [feedbacks, setFeedbacks] = useState([]);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successBookID, setSuccessBookID] = useState(null);
    const [isEditable, setIsEditable] = useState(false);

    const saveFeedback = (feedbackData) => {
        const booking = bookings.find(b => b.bookID === feedbackData.bookID);
        const newImageUrls = feedbackData.newImages.map(file => URL.createObjectURL(file))
        const imageUrls = [...(feedbackData.existingImages || []), ...newImageUrls];

        setFeedbacks(prev => {
            const exists = prev.find(f => f.bookID === feedbackData.bookID);
            const merged = { 
                ...feedbackData, 
                imageUrls, 
                fullName: booking?.fullName, 
                service: booking?.service, 
                imageFiles: feedbackData.newImages 
            };

            setIsEditable(!!exists);
            setSuccessBookID(feedbackData.bookID);
            setShowSuccess(true);

            if (exists) {
                return prev.map(f => f.bookID === feedbackData.bookID ? { ...f, ...merged } : f);
            }
            return [...prev, merged];
        });

    }

    const deleteFeedback = (bookID) => {
        setFeedbacks(prev => prev.filter(f => f.bookID !== bookID));
    }

    return (
        <FeedbackContext.Provider value={{ feedbacks, saveFeedback, deleteFeedback }} >
            {showSuccess && (
                <RatingSuccessModal
                    isEditable={isEditable}
                    bookID={successBookID}
                    onClose={() => {
                        setShowSuccess(false);
                        setSuccessBookID(null);
                    }}
                />
            )}
            {children}
        </FeedbackContext.Provider>
    );
};