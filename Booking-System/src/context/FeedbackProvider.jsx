// context/FeedbackProvider.jsx
import { useState, useEffect } from "react";
import { FeedbackContext } from "./FeedbackContext";
import { RatingSuccessModal } from "../component/modals/RatingSuccessModal";
import { useBooking } from "./useBooking";
import axios from "axios";

export const FeedbackProvider = ({ children }) => {
    const { bookings } = useBooking();
    const [feedbacks, setFeedbacks] = useState([]);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successBookingId, setSuccessBookingId] = useState(null);
    const [isEditable, setIsEditable] = useState(false);
    const [loading, setLoading] = useState(true);

    // Fetch feedbacks
    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3001/api/feedback', {
                    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
                });

                if (response.data.success) {
                    const processedFeedbacks = response.data.data.map(f => ({
                        ...f,
                        imageUrls: f.image_url || f.imageUrls || [],
                        image_url: f.image_url || f.imageUrls || [],
                        bookID: f.bookID || `BK-${String(f.booking_id || f.bookingId || f.bookingID).padStart(6, '0')}`,
                        username: f.username || 'User',
                        isAnonymous: f.is_anonymous || f.isAnonymous || false,
                        is_anonymous: f.is_anonymous || f.isAnonymous || false,
                        rating: parseInt(f.rating) || 0,
                        comment: f.comment || '',
                        booking_id: f.booking_id || f.bookingId || f.bookingID,
                        user_id: f.user_id || f.userId || f.userID,
                        feedback_id: f.feedback_id || f.feedbackId,
                        service: f.service || null,
                    }));
                    
                    setFeedbacks(processedFeedbacks);
                    console.log('📦 Feedbacks loaded:', processedFeedbacks.length);
                }
            } catch (err) {
                console.error('Error fetching feedbacks:', err);
                setFeedbacks([]);
            } finally {
                setLoading(false);
            }
        };

        fetchFeedbacks();
    }, []);

    // Get feedback by booking ID
    const getFeedbackByBooking = async (bookingId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `http://localhost:3001/api/feedback/booking/${bookingId}`,
                {
                    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
                }
            );

            if (response.data.success) {
                const feedback = response.data.data;
                return {
                    ...feedback,
                    bookID: feedback.bookID || `BK-${String(feedback.booking_id || feedback.bookingId || feedback.bookingID).padStart(6, '0')}`,
                    imageUrls: feedback.image_url || feedback.imageUrls || [],
                    username: feedback.username || 'User',
                    isAnonymous: feedback.is_anonymous || feedback.isAnonymous || false,
                    rating: parseInt(feedback.rating) || 0,
                    comment: feedback.comment || '',
                    feedback_id: feedback.feedback_id || feedback.feedbackId,
                };
            }
            return null;
        } catch (err) {
            console.error('Error fetching feedback by booking:', err);
            return null;
        }
    };

    const saveFeedback = async (feedbackData) => {
        try {
            const token = localStorage.getItem('token');
            let imageUrls = feedbackData.existingImages || [];

            // Upload new images
            if (feedbackData.newImages && feedbackData.newImages.length > 0) {
                const formData = new FormData();
                feedbackData.newImages.forEach(file => formData.append('images', file));

                const uploadResponse = await axios.post(
                    'http://localhost:3001/api/upload/multiple',
                    formData,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );

                if (uploadResponse.data.success) {
                    imageUrls = [...imageUrls, ...uploadResponse.data.urls];
                }
            }

            const booking = bookings.find(b => 
                b.booking_id === feedbackData.bookingId || 
                b.bookID === feedbackData.bookID
            );

            const payload = {
                bookingId: feedbackData.bookingId || feedbackData.bookID,
                userId: feedbackData.userId || null,
                rating: feedbackData.rating,
                comment: feedbackData.comment,
                isAnonymous: feedbackData.isAnonymous || false,
                imageUrls: imageUrls,
            };

            let response;
            if (feedbackData.feedback_id) {
                response = await axios.put(
                    `http://localhost:3001/api/feedback/${feedbackData.feedback_id}`,
                    payload,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
            } else {
                response = await axios.post(
                    'http://localhost:3001/api/feedback',
                    payload,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
            }

            if (response.data.success) {
                const newFeedback = {
                    ...response.data.data,
                    imageUrls: imageUrls,
                    image_url: imageUrls,
                    service: booking?.service,
                    bookID: booking?.bookID || `BK-${String(booking?.booking_id || feedbackData.bookingId).padStart(6, '0')}`,
                    username: response.data.data.username || 'User',
                    isAnonymous: feedbackData.isAnonymous || false,
                    is_anonymous: feedbackData.isAnonymous || false,
                    rating: parseInt(feedbackData.rating) || 0,
                };

                setFeedbacks(prev => {
                    const exists = prev.find(f => 
                        f.booking_id === newFeedback.booking_id || 
                        f.bookID === newFeedback.bookID
                    );

                    setIsEditable(!!exists);
                    setSuccessBookingId(newFeedback.booking_id || newFeedback.bookID);
                    setShowSuccess(true);

                    if (exists) {
                        return prev.map(f =>
                            f.booking_id === newFeedback.booking_id || 
                            f.bookID === newFeedback.bookID
                                ? { ...f, ...newFeedback }
                                : f
                        );
                    }
                    return [...prev, newFeedback];
                });

                await refreshFeedbacks();
                return response.data;
            }
        } catch (err) {
            console.error('Error saving feedback:', err);
            alert('Failed to save feedback. Please try again.');
            throw err;
        }
    };

    const deleteFeedback = async (bookingId) => {
        try {
            const token = localStorage.getItem('token');
            const feedback = feedbacks.find(f =>
                f.booking_id === bookingId || f.bookID === bookingId
            );

            if (!feedback) return;

            const response = await axios.delete(
                `http://localhost:3001/api/feedback/${feedback.feedback_id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.data.success) {
                setFeedbacks(prev => prev.filter(f =>
                    f.booking_id !== bookingId && f.bookID !== bookingId
                ));
            }
        } catch (err) {
            console.error('Error deleting feedback:', err);
            alert('Failed to delete feedback. Please try again.');
        }
    };

    const refreshFeedbacks = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3001/api/feedback', {
                headers: token ? { 'Authorization': `Bearer ${token}` } : {}
            });

            if (response.data.success) {
                const processedFeedbacks = response.data.data.map(f => ({
                    ...f,
                    imageUrls: f.image_url || f.imageUrls || [],
                    image_url: f.image_url || f.imageUrls || [],
                    bookID: f.bookID || `BK-${String(f.booking_id || f.bookingId || f.bookingID).padStart(6, '0')}`,
                    username: f.username || 'User',
                    isAnonymous: f.is_anonymous || f.isAnonymous || false,
                    is_anonymous: f.is_anonymous || f.isAnonymous || false,
                    rating: parseInt(f.rating) || 0,
                    comment: f.comment || '',
                    booking_id: f.booking_id || f.bookingId || f.bookingID,
                    user_id: f.user_id || f.userId || f.userID,
                    feedback_id: f.feedback_id || f.feedbackId,
                    service: f.service || null,
                }));
                setFeedbacks(processedFeedbacks);
                console.log('📦 Feedbacks refreshed:', processedFeedbacks.length);
            }
        } catch (err) {
            console.error('Error refreshing feedbacks:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <FeedbackContext.Provider value={{
            feedbacks,
            loading,
            saveFeedback,
            deleteFeedback,
            refreshFeedbacks,
            getFeedbackByBooking
        }}>
            {showSuccess && (
                <RatingSuccessModal
                    isEditable={isEditable}
                    bookID={successBookingId}
                    onClose={() => {
                        setShowSuccess(false);
                        setSuccessBookingId(null);
                    }}
                />
            )}
            {children}
        </FeedbackContext.Provider>
    );
};