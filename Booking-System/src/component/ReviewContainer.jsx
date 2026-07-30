// component/ReviewContainer.jsx
import { useState } from "react";
import { useFeedback } from "../context/useFeedback.js";
import { Reviews } from "./Reviews.jsx";
import { service } from "../assets/utils/services.js";

export const ReviewContainer = () => {
    const { feedbacks } = useFeedback();
    const [filter, setFilter] = useState(0);
    const [selectedService, setSelectedService] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const item_per_page = 3;

    const normalizedFeedbacks = feedbacks.map(f => ({
        ...f,
        imageUrls: f.imageUrls || f.image_url || [],
        image_url: f.image_url || f.imageUrls || [],
        isAnonymous: f.isAnonymous || f.is_anonymous || false,
        is_anonymous: f.is_anonymous || f.isAnonymous || false,
        rating: parseInt(f.rating) || 0,
    }));

    const serviceFiltered = selectedService
        ? normalizedFeedbacks.filter(f => f.service === selectedService)
        : normalizedFeedbacks;

    const filtered = filter === 0
        ? serviceFiltered
        : serviceFiltered.filter(f => f.rating === filter);

    const totalPages = Math.ceil(filtered.length / item_per_page);
    const paginated = filtered.slice(
        (currentPage - 1) * item_per_page,
        currentPage * item_per_page
    );

    const handleServiceClick = (brand) => {
        setSelectedService(prev => prev === brand ? null : brand);
        setFilter(0);
        setCurrentPage(1);
    };

    const handleStarFilter = (star) => {
        setFilter(star);
        setCurrentPage(1);
    };

    return (
        <section className="py-1 mx-4 bg-zinc-900/50 m-0 rounded-xl border border-zinc-800" id="reviews">
            <div className="text-center mb-4">
                <h3 className="text-white pt-3 font-bold text-xl">Customer Reviews</h3>
                <p className="text-zinc-400 mb-2">See what our customers say about us</p>

                {/* Service Filter Cards - may kulay! */}
                <div className="flex flex-wrap justify-center gap-2 my-3 px-3">
                    {service.map((svc) => {
                        const isSelected = selectedService === svc.brand;
                        const isDarkText = svc.brand === "Golden Hour";
                        
                        return (
                            <div key={svc.brand} className="w-[30%] md:w-[13%]">
                                <div
                                    onClick={() => handleServiceClick(svc.brand)}
                                    className={`
                                        ${svc.class} rounded-xl text-center p-2 h-full cursor-pointer
                                        transition-all duration-200 border-[3px]
                                        ${isSelected
                                            ? "border-white shadow-lg scale-105"
                                            : "border-transparent opacity-80 hover:opacity-100"
                                        }
                                    `}
                                >
                                    <div className="h-[60px] flex items-center justify-center">
                                        <img
                                            src={svc.logo}
                                            alt={svc.brand}
                                            className="max-h-full max-w-[60px] object-contain"
                                        />
                                    </div>
                                    <small className={`font-bold text-[10px] ${isDarkText ? 'text-black' : 'text-white'}`}>
                                        {svc.brand}
                                    </small>
                                    <span className="block bg-black/30 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded mt-1">
                                        {normalizedFeedbacks.filter(f => f.service === svc.brand).length} reviews
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Clear Filter */}
                {selectedService && (
                    <div className="text-center mb-2">
                        <button
                            className="text-lime-400 text-sm underline hover:text-lime-300 transition-colors"
                            onClick={() => { setSelectedService(null); setFilter(0); setCurrentPage(1); }}
                        >
                            ✕ Clear filter
                        </button>
                    </div>
                )}

                {/* Star Filter - Yellow/Gold */}
                <div className="flex justify-center gap-2 mb-4 flex-wrap">
                    {[0, 5, 4, 3, 2, 1].map(star => (
                        <button
                            key={star}
                            onClick={() => handleStarFilter(star)}
                            className={`
                                text-sm px-3 py-1 rounded border transition-colors duration-200
                                ${filter === star
                                    ? "bg-amber-400 text-black border-amber-400"
                                    : "bg-transparent text-amber-400 border-amber-400 hover:bg-amber-400 hover:text-black"
                                }
                            `}
                        >
                            {star === 0 ? "All" : "★".repeat(star)}
                        </button>
                    ))}
                </div>

                {/* Reviews Grid */}
                <div className="container mx-auto px-4 max-h-[70vh] overflow-y-auto">
                    {filtered.length === 0 ? (
                        <p className="text-center text-zinc-500 py-4">No reviews yet.</p>
                    ) : (
                        <>
                            <div className="grid grid-cols-3 gap-2 overflow-x-auto">
                                {paginated.map(feedback => (
                                    <div key={feedback.bookID || feedback.feedback_id} className="w-full">
                                        <Reviews feedbacks={[feedback]} />
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-center items-center gap-2 mt-3">
                                    <button
                                        className="text-sm px-3 py-1 rounded border border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        onClick={() => setCurrentPage(p => p - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        ‹
                                    </button>
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentPage(i + 1)}
                                            className={`
                                                text-sm px-3 py-1 rounded border transition-colors
                                                ${currentPage === i + 1
                                                    ? "bg-lime-500 text-black border-lime-500"
                                                    : "bg-transparent text-zinc-400 border-zinc-700 hover:bg-zinc-800 hover:text-white"
                                                }
                                            `}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                    <button
                                        className="text-sm px-3 py-1 rounded border border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        onClick={() => setCurrentPage(p => p + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        ›
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </section>
    );
};