// component/Reviews.jsx
import { useState } from "react";

export const Reviews = ({ feedbacks }) => {
    const [lightboxImg, setLightboxImg] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [currentFeedbackId, setCurrentFeedbackId] = useState(null);

    const getAllImages = () => {
        const images = [];
        feedbacks.forEach((feedback) => {
            const urls = feedback.imageUrls || feedback.image_url || [];
            urls.forEach((url) => {
                let fullUrl = url;
                if (url && !url.startsWith('http')) {
                    fullUrl = url.startsWith('/') 
                        ? `http://localhost:3001${url}` 
                        : `http://localhost:3001/${url}`;
                }
                images.push({
                    url: fullUrl,
                    feedbackId: feedback.feedback_id || feedback.bookID,
                });
            });
        });
        return images;
    };

    const allImages = getAllImages();

    const renderStar = (rating) => {
        return [...Array(5)].map((_, i) => (
            <span key={i} className={`text-sm ${i < rating ? "text-amber-400" : "text-zinc-600"}`}>★</span>
        ));
    };

    const displayName = (feedback) => {
        const isAnonymous = feedback.isAnonymous || feedback.is_anonymous || false;
        const username = feedback.username || 'User';
        
        if (isAnonymous) {
            const first = username[0] || 'A';
            const last = username[username.length - 1] || 's';
            const stars = '*'.repeat(5);
            return `${first}${stars}${last}`;
        }
        return username;
    };

    const handleWheel = (e) => {
        const target = e.currentTarget;
        const isHorizontalScroll = Math.abs(e.deltaX) > Math.abs(e.deltaY);
        
        if (isHorizontalScroll) {
            e.preventDefault();
            target.scrollLeft += e.deltaX;
        }
    };

    const openLightbox = (url, feedbackId, index) => {
        setLightboxImg(url);
        setCurrentFeedbackId(feedbackId);
        setCurrentImageIndex(index);
    };

    const nextImage = (e) => {
        e.stopPropagation();
        if (allImages.length === 0) return;
        const nextIndex = (currentImageIndex + 1) % allImages.length;
        setCurrentImageIndex(nextIndex);
        setLightboxImg(allImages[nextIndex].url);
        setCurrentFeedbackId(allImages[nextIndex].feedbackId);
    };

    const prevImage = (e) => {
        e.stopPropagation();
        if (allImages.length === 0) return;
        const prevIndex = (currentImageIndex - 1 + allImages.length) % allImages.length;
        setCurrentImageIndex(prevIndex);
        setLightboxImg(allImages[prevIndex].url);
        setCurrentFeedbackId(allImages[prevIndex].feedbackId);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            nextImage(e);
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prevImage(e);
        } else if (e.key === 'Escape') {
            setLightboxImg(null);
        }
    };

    if (!feedbacks || feedbacks.length === 0) {
        return (
            <div className="text-center text-zinc-500 py-4">
                <p>No reviews yet.</p>
            </div>
        );
    }

    return (
        <>
            {lightboxImg && (
                <div
                    className="fixed inset-0 z-[1050] bg-zinc-950/95 flex items-center justify-center"
                    onClick={() => setLightboxImg(null)}
                    onKeyDown={handleKeyDown}
                    tabIndex={0}
                >
                    <button
                        className="absolute top-4 right-4 text-white text-4xl hover:text-zinc-400 transition-colors z-20"
                        onClick={() => setLightboxImg(null)}
                    >
                        &times;
                    </button>

                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-2 rounded-full z-20">
                        {currentImageIndex + 1} / {allImages.length}
                    </div>

                    {allImages.length > 1 && (
                        <button
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-5xl hover:text-amber-400 transition-colors z-20 bg-black/50 hover:bg-black/70 w-14 h-14 rounded-full flex items-center justify-center"
                            onClick={prevImage}
                        >
                            ‹
                        </button>
                    )}

                    <img
                        src={lightboxImg}
                        alt="expanded"
                        className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg cursor-zoom-out"
                        onClick={(e) => e.stopPropagation()}
                    />

                    {allImages.length > 1 && (
                        <button
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-5xl hover:text-amber-400 transition-colors z-20 bg-black/50 hover:bg-black/70 w-14 h-14 rounded-full flex items-center justify-center"
                            onClick={nextImage}
                        >
                            ›
                        </button>
                    )}

                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/50 text-xs bg-black/50 px-3 py-1 rounded-full z-20">
                        Feedback #{currentFeedbackId || 'N/A'}
                    </div>
                </div>
            )}

            {feedbacks.map((feedback) => {
                const imageUrls = feedback.imageUrls || feedback.image_url || [];
                const rating = parseInt(feedback.rating) || 0;
                const comment = feedback.comment || '';
                const bookID = feedback.bookID || feedback.bookId || `BK-${String(feedback.booking_id || feedback.bookingId || feedback.bookingID).padStart(6, '0')}`;
                const name = displayName(feedback);

                let startIndex = 0;
                for (const f of feedbacks) {
                    if (f.feedback_id === feedback.feedback_id || f.bookID === feedback.bookID) break;
                    const urls = f.imageUrls || f.image_url || [];
                    startIndex += urls.length;
                }

                return (
                    <div key={bookID || feedback.feedback_id} className="bg-zinc-800 border border-zinc-700 rounded-xl h-full mb-1">
                        <div className="p-4">
                            {/* ✅ Fixed: Flex-wrap para hindi mag-overlap sa small screens */}
                            <div className="flex flex-wrap justify-between items-start gap-2 my-1">
                                {/* ✅ Name - may max width at truncate para hindi mag-overlap */}
                                <p className="text-sm leading-relaxed text-white mb-0 truncate max-w-[60%] sm:max-w-[70%]" title={name}>
                                    {name}
                                </p>
                                {/* ✅ Stars - naka-flex shrink para hindi ma-compress */}
                                <div className="flex-shrink-0 flex">
                                    {renderStar(rating)}
                                </div>
                            </div>

                            {imageUrls && imageUrls.length > 0 && (
                                <div 
                                    className="flex gap-2 overflow-x-auto overflow-y-hidden pb-3 hide-scrollbar mt-2"
                                    style={{
                                        scrollbarWidth: 'none',
                                        msOverflowStyle: 'none',
                                        WebkitOverflowScrolling: 'touch',
                                        cursor: 'grab'
                                    }}
                                    onWheel={handleWheel}
                                    onMouseDown={(e) => {
                                        const container = e.currentTarget;
                                        container.style.cursor = 'grabbing';
                                        container.dataset.startX = e.pageX;
                                        container.dataset.scrollLeft = container.scrollLeft;
                                    }}
                                    onMouseUp={(e) => {
                                        e.currentTarget.style.cursor = 'grab';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.cursor = 'grab';
                                    }}
                                    onMouseMove={(e) => {
                                        const container = e.currentTarget;
                                        if (container.style.cursor === 'grabbing') {
                                            const x = e.pageX - parseInt(container.dataset.startX);
                                            container.scrollLeft = parseInt(container.dataset.scrollLeft) - x;
                                        }
                                    }}
                                >
                                    {imageUrls.map((url, i) => {
                                        let fullUrl = url;
                                        if (url && !url.startsWith('http')) {
                                            fullUrl = url.startsWith('/') 
                                                ? `http://localhost:3001${url}` 
                                                : `http://localhost:3001/${url}`;
                                        }
                                        const globalIndex = startIndex + i;
                                        return (
                                            <img
                                                key={i}
                                                src={fullUrl}
                                                alt={`review-${i}`}
                                                onClick={() => openLightbox(fullUrl, feedback.feedback_id || feedback.bookID, globalIndex)}
                                                className="w-[3.75rem] h-[3.75rem] object-cover rounded-lg border border-lime-500 cursor-zoom-in flex-shrink-0 hover:scale-105 transition-transform"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                }}
                                            />
                                        );
                                    })}
                                </div>
                            )}

                            {comment && (
                                <p className="text-white text-start text-sm leading-relaxed mt-2 break-words">
                                    {comment}
                                </p>
                            )}
                        </div>
                    </div>
                );
            })}
        </>
    );
};