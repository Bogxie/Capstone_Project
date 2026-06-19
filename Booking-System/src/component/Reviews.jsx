import { useState } from "react";

export const Reviews = ({ feedbacks }) => {
    const [lightboxImg, setLightboxImg] = useState(null);

    const renderStar = (rating) => {
        return [...Array(5)].map((_, i) => (
            <span key={i} className={`text-sm ${i < rating ? "text-[#EF9F27]" : "text-[#555]"}`}>★</span>
        ));
    };

    const hideName = (name, isAnonymous) => {
        if (isAnonymous) return `${name[0]}*****${name[name.length - 1]}`;
        return name;
    };

    if (!feedbacks || feedbacks.length === 0) {
        return (
            <div className="text-center text-gray-500 py-4">
                <p>No reviews yet.</p>
            </div>
        );
    }

    return (
        <>
            {lightboxImg && (
                <div
                    className="fixed inset-0 z-[1050] bg-black/85 flex items-center justify-center cursor-zoom-out"
                    onClick={() => setLightboxImg(null)}
                >
                    <img
                        src={lightboxImg}
                        alt="expanded"
                        className="max-w-full max-h-[80vh] min-h-[50vh] object-contain rounded"
                    />
                </div>
            )}

            {feedbacks.map((feedback) => (
                <div key={feedback.bookID} className="bg-[#212529] border border-gray-600 rounded-xl h-full mb-1">
                    <div className="p-4">
                        <div className="flex justify-between items-start my-1">
                            <p className="text-[0.8125rem] leading-relaxed text-white mb-0">
                                {hideName(feedback.fullName, feedback.isAnonymous)}
                            </p>
                            <div className="flex">{renderStar(feedback.rating)}</div>
                        </div>

                        {feedback.imageUrls?.length > 0 && (
                            <div className="flex gap-2 overflow-x-auto pb-3 hide-scrollbar">
                                {feedback.imageUrls.map((url, i) => (
                                    <img
                                        key={i}
                                        src={url}
                                        alt={`review-${i}`}
                                        onClick={() => setLightboxImg(url)}
                                        className="w-[3.75rem] h-[3.75rem] object-cover rounded-lg border border-lime-400 cursor-zoom-in"
                                    />
                                ))}
                            </div>
                        )}

                        {feedback.comment && (
                            <p className="text-white text-start text-sm leading-relaxed">
                                {feedback.comment}
                            </p>
                        )}
                    </div>
                </div>
            ))}
        </>
    );
};