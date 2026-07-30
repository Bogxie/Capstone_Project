// component/modals/RatingModal.jsx
import { useState, useEffect } from "react";
import { useFeedback } from "../../context/useFeedback.js";
import { useAuth } from "../../context/useAuth.js";
import { StarRating } from "./StarRating";
import { ImageUploader } from "./ImageUploader";

export const RatingModal = ({ booking, existingFeedback, onClose }) => {
    const { saveFeedback } = useFeedback();
    const { currentUser } = useAuth();
    
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

    const displayName = () => {
        const name = currentUser?.username || 'User';
        
        if (isAnonymous) {
            if (name.length <= 2) return "Anonymous";
            return `${name[0]}${'*'.repeat(Math.min(name.length - 2, 5))}${name[name.length - 1]}`;
        }
        return name;
    };

    if (!booking) return null;

    return (
        <div className="fixed inset-0 z-[1050] flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-4">
            <div className="relative w-full max-w-[90%] hide-scrollbar sm:max-w-md max-h-[95vh] overflow-y-auto rounded-lg border border-amber-500 bg-neutral-900 p-3 sm:p-6 text-center text-white shadow-xl">
                
                {/* Modal Header */}
                <div className="relative mb-2 flex flex-col items-center pb-2 border-b border-amber-500">
                    <h5 className="text-base sm:text-xl font-bold text-amber-500">
                        {isEditable ? "Edit Your Rating" : "Rate Us"}
                    </h5>
                    <button
                        type="button"
                        className="absolute top-0 right-0 text-neutral-400 hover:text-white transition-colors text-2xl font-semibold w-8 h-8 flex items-center justify-center"
                        onClick={onClose}
                    >
                        &times;
                    </button>
                </div>

                {/* Modal Body */}
                <div className="flex flex-col items-center gap-2 sm:gap-3">
                    
                    {/* Star Rating - Mas maliit sa SM */}
                    <div className="mb-1 sm:mb-4">
                        <StarRating
                            rating={rating}
                            hover={hover}
                            setRating={setRating}
                            setHover={setHover}
                        />
                    </div>

                    {/* Identity Section */}
                    <div className="w-full flex items-center justify-between mb-1 sm:mb-4 px-1">
                        <div className="flex items-center text-amber-500 font-semibold text-xs sm:text-sm">
                            <i className="bi bi-person-circle mr-1.5 text-sm sm:text-base"></i>
                            <span className="truncate max-w-[100px] sm:max-w-none">{displayName()}</span>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2">
                            <input
                                className="h-3.5 w-3.5 sm:h-4 sm:w-4 cursor-pointer rounded border-neutral-600 bg-neutral-800 text-amber-500 focus:ring-amber-500 focus:ring-offset-neutral-900"
                                type="checkbox"
                                id="anonymousToggle"
                                checked={isAnonymous}
                                onChange={(e) => setIsAnonymous(e.target.checked)}
                            />
                            <label
                                className="cursor-pointer text-[10px] sm:text-xs text-neutral-400 hover:text-neutral-300 select-none"
                                htmlFor="anonymousToggle"
                            >
                                Anonymous
                            </label>
                        </div>
                    </div>

                    {/* Image Uploader - Mas maliit sa SM */}
                    <div className="w-full mb-1 sm:mb-4">
                        <ImageUploader
                            previewUrl={previewUrl}
                            removeImage={removeImage}
                            handleImageChange={handleImageChange}
                        />
                    </div>

                    {/* Comment - Mas maliit sa SM */}
                    <textarea
                        className="w-full min-h-[70px] sm:min-h-[100px] rounded-md bg-neutral-800 border border-neutral-700 p-2 sm:p-3 text-white placeholder-neutral-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all mb-1 sm:mb-4 text-xs sm:text-sm resize-none"
                        rows="2 sm:rows-3"
                        placeholder="Tell us your experience of our service"
                        maxLength={500}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />

                    {/* Submit Button - Mas maliit sa SM */}
                    <button
                        className="w-full rounded-md bg-amber-500 py-1.5 sm:py-2.5 text-xs sm:text-sm font-bold text-neutral-950 transition-all hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleSubmit}
                        disabled={rating === 0}
                    >
                        {isEditable ? "Update Rating" : "Submit Feedback"}
                    </button>
                </div>
            </div>
        </div>
    );
};