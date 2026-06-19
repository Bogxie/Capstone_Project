export const RatingSuccessModal = ({ isEditable, bookID, onClose }) => {
    return (
        <>
            {/* Backdrop / Overlay */}
            <div 
                className="fixed inset-0 z-[260] bg-black/75 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />
            
            {/* Modal Wrapper Container */}
            <div className="fixed inset-0 z-[260] flex items-center justify-center p-4 overflow-x-hidden overflow-y-auto outline-none">
                <div className="relative w-full max-w-md transform overflow-hidden rounded-xl border border-amber-500 bg-neutral-900 p-6 text-center shadow-2xl transition-all">
                    
                    {/* Success Icon & Header */}
                    <div className="mb-4 flex flex-col items-center">
                        <i className="bi bi-check-circle-fill text-emerald-500 text-5xl mb-3 animate-bounce"></i>
                        <h3 className="text-2xl font-bold tracking-wide text-amber-500">
                            Success!
                        </h3>
                    </div>
                    
                    {/* Modal Content Body */}
                    <p className="text-base text-neutral-300 mb-6 leading-relaxed">
                        {isEditable 
                            ? "Your rating has been successfully updated!" 
                            : "Thank you! Your rating has been submitted!"
                        }
                        <br />
                        <span className="inline-block mt-2 rounded bg-neutral-800 px-2.5 py-1 text-sm font-semibold text-white border border-neutral-700">
                            Booking #{bookID}
                        </span>
                    </p>
                    
                    {/* Action Button */}
                    <button 
                        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-bold text-neutral-950 shadow-md hover:bg-amber-400 active:scale-98 transition-all duration-150 focus:outline-none" 
                        onClick={onClose}
                    >
                        <i className="bi bi-arrow-left font-bold"></i>
                        Back to Dashboard
                    </button>
                </div>
            </div>
        </>
    );
};