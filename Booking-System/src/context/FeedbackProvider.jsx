// context/FeedbackProvider.jsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { FeedbackContext } from "./FeedbackContext";
import { RatingSuccessModal } from "../component/modals/RatingSuccessModal";
import { API_URL } from './API_URL';
import axios from 'axios';

const apiCall = async (method, url, data = null) => {
  const token = localStorage.getItem('token');
  const headers = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method,
    url: `${API_URL}${url}`,
    headers,
    data,
  };

  const response = await axios(config);
  return response.data;
};

// ✅ Feedback API functions
const feedbackApi = {
  getAll: () => apiCall('get', '/feedback'),
  create: (data) => apiCall('post', '/feedback', data),
  update: (id, data) => apiCall('put', `/feedback/${id}`, data),
  delete: (id) => apiCall('delete', `/feedback/${id}`),
  getByBooking: (bookingId) => apiCall('get', `/feedback/booking/${bookingId}`),
};

const feedbackKeys = {
  all: ['feedbacks'],
  byBooking: (bookingId) => ['feedbacks', 'booking', bookingId],
};

export const FeedbackProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const [showSuccess, setShowSuccess] = useState(false);
  const [successBookingId, setSuccessBookingId] = useState(null);
  const [isEditable, setIsEditable] = useState(false);


  const { data: feedbacks = [], isLoading: loading } = useQuery({
    queryKey: feedbackKeys.all,
    queryFn: async () => {
      const response = await feedbackApi.getAll();
      return response.data || [];
    },
    staleTime: 60 * 1000,
  });


  const saveFeedbackMutation = useMutation({
    mutationFn: async (feedbackData) => {
      let imageUrls = feedbackData.existingImages || [];

      // Upload new images
      if (feedbackData.newImages && feedbackData.newImages.length > 0) {
        const token = localStorage.getItem('token');
        const formData = new FormData();
        feedbackData.newImages.forEach(file => formData.append('images', file));

        const uploadResponse = await axios.post(
          `${API_URL}/upload/multiple`,
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

      const payload = {
        bookingId: feedbackData.bookingId || feedbackData.bookID,
        userId: feedbackData.userId || null,
        rating: feedbackData.rating,
        comment: feedbackData.comment,
        isAnonymous: feedbackData.isAnonymous || false,
        imageUrls: imageUrls,
      };

      const response = feedbackData.feedback_id
        ? await feedbackApi.update(feedbackData.feedback_id, payload)
        : await feedbackApi.create(payload);

      return response.data; 
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: feedbackKeys.all });
      if (variables.bookingId) {
        queryClient.invalidateQueries({ queryKey: feedbackKeys.byBooking(variables.bookingId) });
      }

      setIsEditable(!!variables.feedback_id);
      setSuccessBookingId(data.booking_id || data.bookID);
      setShowSuccess(true);
    },
    onError: (error) => {
      console.error('Error saving feedback:', error);
      alert('Failed to save feedback. Please try again.');
    },
  });

  const deleteFeedbackMutation = useMutation({
    mutationFn: (id) => feedbackApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: feedbackKeys.all });
    },
    onError: (error) => {
      console.error('Error deleting feedback:', error);
      alert('Failed to delete feedback. Please try again.');
    },
  });

  const saveFeedback = async (feedbackData) => {
    return saveFeedbackMutation.mutateAsync(feedbackData);
  };

  const deleteFeedback = async (bookingId) => {
    const feedback = feedbacks.find(f =>
      f.booking_id === bookingId || f.bookID === bookingId
    );

    if (!feedback) return;
    return deleteFeedbackMutation.mutateAsync(feedback.feedback_id);
  };

  const refreshFeedbacks = () => {
    queryClient.invalidateQueries({ queryKey: feedbackKeys.all });
  };

  const getFeedbackByBooking = async (bookingId) => {
    try {
      const response = await feedbackApi.getByBooking(bookingId);
      if (response.success) {
        const feedback = response.data;
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

  const value = {
    feedbacks,
    loading,
    saveFeedback,
    deleteFeedback,
    refreshFeedbacks,
    getFeedbackByBooking
  };

  return (
    <FeedbackContext.Provider value={value}>
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