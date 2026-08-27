export const RatingSuccessModal = ({ isEditable, bookID, onClose }) => {
    return (
        <div className="fixed inset-0 z-[1050] flex items-center justify-center bg-[#23262f]/95 p-2 sm:p-4">
            <div className="w-full max-w-md mx-4 bg-[#2d303a] border border-[#b6ff2e] rounded-xl shadow-2xl overflow-hidden">
                
                {/* Header */}
                <div className="relative flex items-center p-4 border-b border-[#b6ff2e]">
                    <h5 className="text-base font-bold w-full text-center text-[#b6ff2e]">
                        {isEditable ? "Rating Updated!" : "Rating Submitted!"}
                    </h5>
                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute right-4 text-zinc-400 hover:text-white transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="flex flex-col items-center gap-4 p-5">
                    {/* Success Icon */}
                    <div className="text-emerald-500 text-5xl">✅</div>
                    
                    <p className="text-center text-sm text-zinc-300">
                        {isEditable 
                            ? "Your rating has been successfully updated!" 
                            : "Thank you! Your rating has been submitted!"
                        }
                    </p>

                    <span className="inline-block rounded bg-[#23262f] px-3 py-1 text-xs font-semibold text-white border border-[#3a3d48]">
                        Booking #{bookID}
                    </span>

                    {/* Buttons */}
                    <div className="flex gap-2 w-full mt-2">
                        <button
                            className="flex-1 py-2 text-sm font-semibold rounded-lg bg-[#b6ff2e] text-[#23262f] hover:bg-[#a3e829] transition-colors"
                            onClick={onClose}
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};