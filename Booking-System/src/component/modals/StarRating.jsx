export const StartRating = ({ rating, hover, setRating, setHover }) => {
    return (
        <div className="flex justify-center gap-1 pb-1 select-none">
            {[...Array(5)].map((_, i) => {
                const val = i + 1;
                const isActive = val <= (hover || rating);
                
                return (
                    <span
                        key={i}
                        onClick={() => setRating(val)}
                        onMouseEnter={() => setHover(val)}
                        onMouseLeave={() => setHover(0)}
                        className={`text-3xl cursor-pointer transition-all duration-150 transform hover:scale-110 ${
                            isActive 
                                ? 'text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]' 
                                : 'text-neutral-600 hover:text-neutral-400'
                        }`}
                    >
                        ★
                    </span>
                );
            })}
        </div>
    );
};