// component/modals/RatingModal.jsx
import { useState, useEffect } from "react";
import { useFeedback } from "../../context/useFeedback.js";
import { useAuth } from "../../context/useAuth.js";
import { StarRating } from "./StarRating";
import { ImageUploader } from "./ImageUploader";

export const RatingModal = ({ booking, existingFeedback, onClose }) => {
    const { saveFeedback, deleteFeedback } = useFeedback();  // ✅ Add deleteFeedback
    const { currentUser } = useAuth();
    const [isDeleting, setIsDeleting] = useState(false);
    
    const [previewUrl, setPreviewUrl] = useState(
        existingFeedback?.imageUrls || 
        existingFeedback?.image_url || 
        []
    );
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [newUrls, setNewUrls] = useState([]);
    const [rating, setRating] = useState(existingFeedback?.rating || 0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState(existingFeedback?.comment || '');
    const [isAnonymous, setIsAnonymous] = useState(
        existingFeedback ? (existingFeedback.isAnonymous || existingFeedback.is_anonymous || false) : false
    );
    const [isEditable] = useState(!!existingFeedback);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        return () => {
            newUrls.forEach(url => URL.revokeObjectURL(url));
        };
    }, [newUrls]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const remainingSlots = 5 - previewUrl.length;
        const allowedFiles = files.slice(0, remainingSlots);
        
        if (files.length > remainingSlots) {
            alert("Maximum 5 images only");
        }
        
        const newImageUrls = allowedFiles.map(file => URL.createObjectURL(file));
        setNewUrls(prev => [...prev, ...newImageUrls]);
        setPreviewUrl(prev => [...prev, ...newImageUrls]);
        setSelectedFiles(prev => [...prev, ...allowedFiles]);
    };

    const removeImage = (indexRemove) => {
        const urlToRemove = previewUrl[indexRemove];

        if (newUrls.includes(urlToRemove)) {
            URL.revokeObjectURL(urlToRemove);
            setNewUrls(prev => prev.filter(url => url !== urlToRemove));
            setSelectedFiles(prev => prev.filter((_, index) => {
                const fileIndex = newUrls.indexOf(urlToRemove);
                return index !== fileIndex;
            }));
        } else {
            setSelectedFiles(prev => prev.filter((_, index) => index !== indexRemove));
        }

        setPreviewUrl(prev => prev.filter((_, index) => index !== indexRemove));
    };

    const handleSubmit = async () => {
        if (rating === 0) {
            alert('Please select a rating');
            return;
        }

        const existingImages = previewUrl.filter(url => !url.startsWith('blob:'));

        const payload = {
            bookingId: booking.booking_id || booking.bookID,
            userId: booking.user_id || booking.userId || currentUser?.user_id,
            rating: rating,
            comment: comment,
            isAnonymous: isAnonymous,
            existingImages: existingImages,
            newImages: selectedFiles,
            feedback_id: existingFeedback?.feedback_id || existingFeedback?.feedbackId,
            bookID: booking.bookID || booking.booking_id,
        };

        console.log('📤 Submitting feedback:', payload);
        
        try {
            await saveFeedback(payload);
            onClose();
        } catch (error) {
            console.error('Error submitting feedback:', error);
            alert('Failed to save feedback. Please try again.');
        }
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteFeedback(booking.booking_id || booking.bookID);
            setShowDeleteConfirm(false);
            onClose();
        } catch (error) {
            console.error('Error deleting feedback:', error);
            alert('Failed to delete feedback. Please try again.');
        } finally {
            setIsDeleting(false);
        }
    };

    const displayName = () => {
        const name = currentUser?.username || 'User';
        
        if (isAnonymous) {
            if (name.length <= 2) return "Anonymous";
            return `${name[0]}${'*'.repeat(Math.min(name.length - 2, 5))}${name[name.length - 1]}`;
        }
        return name;
    };

    if (!booking) return null;

    // ✅ Delete confirmation view
    if (showDeleteConfirm) {
        return (
            <div className="fixed inset-0 z-[1050] flex items-center justify-center bg-[#23262f]/95 p-2 sm:p-4">
                <div className="relative w-full max-w-md rounded-xl border border-red-500/50 bg-[#2d303a] p-5 text-center text-white shadow-2xl">
                    <div className="flex flex-col items-center gap-4">
                        <div className="text-5xl">🗑️</div>
                        <h5 className="text-lg font-bold text-red-400">Delete Feedback?</h5>
                        <p className="text-sm text-zinc-300">
                            Are you sure you want to delete your feedback for booking?
                        </p>
                        <span className="inline-block rounded bg-[#23262f] px-3 py-1 text-xs font-semibold text-white border border-[#3a3d48]">
                            {booking.display_id || booking.bookID}
                        </span>
                        <p className="text-xs text-red-400">This action cannot be undone.</p>
                        <div className="flex gap-2 w-full mt-2">
                            <button
                                className="flex-1 py-2 text-sm font-semibold rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors disabled:opacity-50"
                                onClick={handleDelete}
                                disabled={isDeleting}
                            >
                                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                            </button>
                            <button
                                className="flex-1 py-2 text-sm font-semibold rounded-lg bg-[#23262f] border border-[#3a3d48] text-white hover:bg-[#2d303a] transition-colors"
                                onClick={() => setShowDeleteConfirm(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ✅ Main Rating Modal
    return (
        <div className="fixed inset-0 z-[1050] flex items-center justify-center bg-[#23262f]/95 p-2 sm:p-4">
            <div className="relative w-full max-w-[85%] sm:max-w-sm max-h-[90vh] overflow-y-auto hide-scrollbar rounded-xl border border-[#b6ff2e]/30 bg-[#2d303a] p-4 sm:p-5 text-center text-white shadow-2xl">
                
                {/* Modal Header */}
                <div className="relative mb-2 flex flex-col items-center pb-2 border-b border-[#b6ff2e]/20">
                    <h5 className="text-sm sm:text-lg font-bold text-[#b6ff2e]">
                        {isEditable ? "Edit Your Rating" : "Rate Us"}
                    </h5>
                    <button
                        type="button"
                        className="absolute top-0 right-0 text-zinc-400 hover:text-white transition-colors text-xl font-semibold w-7 h-7 flex items-center justify-center"
                        onClick={onClose}
                    >
                        ✕
                    </button>
                </div>

                {/* Modal Body */}
                <div className="flex flex-col items-center gap-1.5 sm:gap-2">
                    
                    {/* Star Rating */}
                    <div className="mb-0.5 sm:mb-2">
                        <StarRating
                            rating={rating}
                            hover={hover}
                            setRating={setRating}
                            setHover={setHover}
                        />
                    </div>

                    {/* Identity Section */}
                    <div className="w-full flex items-center justify-between mb-0.5 sm:mb-2 px-0.5">
                        <div className="flex items-center text-[#b6ff2e] font-semibold text-[10px] sm:text-xs">
                            <span className="mr-1 text-sm">👤</span>
                            <span className="truncate max-w-[80px] sm:max-w-none">{displayName()}</span>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-1.5">
                            <input
                                className="h-3 w-3 sm:h-3.5 sm:w-3.5 cursor-pointer rounded border-[#3a3d48] bg-[#23262f] text-[#b6ff2e] focus:ring-[#b6ff2e] focus:ring-offset-[#23262f]"
                                type="checkbox"
                                id="anonymousToggle"
                                checked={isAnonymous}
                                onChange={(e) => setIsAnonymous(e.target.checked)}
                            />
                            <label
                                className="cursor-pointer text-[9px] sm:text-[10px] text-zinc-400 hover:text-zinc-300 select-none"
                                htmlFor="anonymousToggle"
                            >
                                Anonymous
                            </label>
                        </div>
                    </div>

                    {/* Image Uploader */}
                    <div className="w-full mb-0.5 sm:mb-2">
                        <ImageUploader
                            previewUrl={previewUrl}
                            removeImage={removeImage}
                            handleImageChange={handleImageChange}
                        />
                    </div>

                    {/* Comment */}
                    <textarea
                        className="w-full min-h-[60px] sm:min-h-[80px] rounded-lg bg-[#23262f] border border-[#3a3d48] p-2 sm:p-2.5 text-white placeholder-zinc-500 focus:border-[#b6ff2e] focus:ring-1 focus:ring-[#b6ff2e] outline-none transition-all mb-0.5 sm:mb-2 text-[10px] sm:text-sm resize-none"
                        rows="2 sm:rows-3"
                        placeholder="Tell us your experience..."
                        maxLength={500}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />

                    {/* Buttons */}
                    <div className="flex gap-2 w-full">
                        <button
                            className="flex-1 rounded-lg bg-[#b6ff2e] py-1.5 sm:py-2 text-[10px] sm:text-sm font-bold text-[#23262f] transition-all hover:bg-[#a3e829] disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={handleSubmit}
                            disabled={rating === 0}
                        >
                            {isEditable ? "Update Rating" : "Submit Feedback"}
                        </button>
                    </div>

                    {/* ✅ Delete button (only for existing feedback) */}
                    {isEditable && (
                        <button
                            type="button"
                            className="w-full text-xs text-red-400 hover:text-red-300 transition-colors mt-1"
                            onClick={() => setShowDeleteConfirm(true)}
                        >
                            🗑️ Delete this review
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};