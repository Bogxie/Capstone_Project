import { useState, useEffect } from "react";
import { useFeedback } from "../../context/useFeedback.js"
import { StartRating } from "../Modals/StarRating";
import { ImageUploader } from "./ImageUploader"

export const RatingModal = ({ booking, existingFeedback, onClose }) => {
    const { saveFeedback } = useFeedback();
    const [previewUrl, setPreviewUrl] = useState(existingFeedback?.imageUrls || []);
    const [selectedFiles, setSelectedFiles] = useState(existingFeedback?.imageFiles || []);
    const [newUrls, setNewUrls] = useState([]);
    const [rating, setRating] = useState(existingFeedback?.rating || 0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState(existingFeedback?.comment || '');
    const [isAnonymous, setIsAnonymous] = useState(existingFeedback?.isAnonymous || false);
    const [isEditable] = useState(!!existingFeedback);

    useEffect(() => {
        return () => newUrls.forEach(url => URL.revokeObjectURL(url));
    }, [newUrls]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const remainingSlots = 5 - previewUrl.length;
        const allowedFiles = files.slice(0, remainingSlots);
        if (files.length > remainingSlots) {
            alert("Only some images were added (max 5)");
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
            const fileIndex = newUrls.indexOf(urlToRemove);
            prevNewUrls => prevNewUrls.filter(url => url !== urlToRemove);
            setSelectedFiles(prev => prev.filter((_, index) => index !== fileIndex));
        } else {
            setSelectedFiles(prev => prev.filter((_, index) => index !== indexRemove));
        }

        setPreviewUrl(prev => prev.filter((_, index) => index !== indexRemove));
    };

    const handleSubmit = () => {
        console.log("handleSubmit called!");
        const feedbackData = {
            bookID: booking.bookID,
            fullName: booking.fullName,
            rating: rating,
            comment: comment,
            isAnonymous: isAnonymous,
            existingImages: previewUrl.filter(url => !url.startsWith('blob:')),
            newImages: selectedFiles
        };
        console.log("2. Saving feedback...");
        saveFeedback(feedbackData);
        onClose();
    };

    const hideName = () => {
        if (!booking?.fullName) return "Anonymous";
        if (isAnonymous) {
            const name = booking.fullName;
            return `${name[0]}*****${name[name.length - 1]}`;
        }
        return booking.fullName;
    };

    if (!booking) return null;

    return (
        <>
            {/* Backdrop / Overlay */}
            <div className="fixed inset-0 z-[1050] flex items-center justify-center bg-black/80 backdrop-blur-sm">
                <div className="relative w-full max-w-md rounded-lg border border-amber-500 bg-neutral-900 p-6 text-center text-white shadow-xl">
                    
                    {/* Modal Header */}
                    <div className="relative mb-2 flex flex-col items-center pb-2 border-b border-amber-500">
                        <h5 className="text-xl font-bold text-amber-500">
                            {isEditable ? "Edit Your Rating" : "Rate Us"}
                        </h5>
                        <button
                            type="button"
                            className="absolute top-0 right-0 text-neutral-400 hover:text-white transition-colors text-2xl font-semibold"
                            onClick={onClose}
                        >
                            &times;
                        </button>
                    </div>

                    {/* Modal Body */}
                    <div className="flex flex-col items-center">
                        
                        {/* Star Rating Component Wrapper */}
                        <div className="mb-4">
                            <StartRating
                                rating={rating}
                                hover={hover}
                                setRating={setRating}
                                setHover={setHover}
                            />
                        </div>

                        {/* Identity Section (Name & Anonymous Toggle) */}
                        <div className="w-full flex items-center justify-between mb-4 px-1">
                            <div className="flex items-center text-amber-500 font-semibold text-sm">
                                <i className="bi bi-person-circle mr-1.5"></i>
                                {hideName()}
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    className="h-4 w-4 cursor-pointer rounded border-neutral-600 bg-neutral-800 text-amber-500 focus:ring-amber-500 focus:ring-offset-neutral-900"
                                    type="checkbox"
                                    id="anonymousToggle"
                                    checked={isAnonymous}
                                    onChange={(e) => setIsAnonymous(e.target.checked)}
                                />
                                <label
                                    className="cursor-pointer text-xs text-neutral-400 hover:text-neutral-300 select-none"
                                    htmlFor="anonymousToggle"
                                >
                                    Anonymous
                                </label>
                            </div>
                        </div>

                        {/* Image Uploader Wrapper */}
                        <div className="w-full mb-4">
                            <ImageUploader
                                previewUrl={previewUrl}
                                removeImage={removeImage}
                                handleImageChange={handleImageChange}
                            />
                        </div>

                        {/* Comment Textarea */}
                        <textarea
                            className="w-full min-h-[100px] rounded-md bg-neutral-800 border border-neutral-700 p-3 text-white placeholder-neutral-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all mb-4 text-sm resize-none"
                            rows="3"
                            placeholder="Tell us your experience of our service"
                            maxLength={100}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        ></textarea>

                        {/* Submit Button */}
                        <button
                            className="w-full rounded-md bg-amber-500 py-2.5 text-sm font-bold text-neutral-950 transition-all hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={handleSubmit}
                            disabled={rating === 0}
                        >
                            {isEditable ? "Update Rating" : "Submit Feedback"}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};