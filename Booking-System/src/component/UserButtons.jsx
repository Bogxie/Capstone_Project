// UserButtons.jsx - Horizontal, center, full width
const btnBase = "flex-1 py-1.5 text-[10px] font-semibold rounded-lg border transition-colors text-center";
const btnCyan = `${btnBase} border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black`;
const btnGreen = `${btnBase} border-green-400 text-green-400 hover:bg-green-400 hover:text-black`;
const btnRed = `${btnBase} border-red-400 text-red-400 hover:bg-red-400 hover:text-black`;
const btnYellow = `${btnBase} border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black`;
const btnDisabled = `${btnBase} border-[#3a3d48] text-zinc-600 cursor-not-allowed opacity-40`;

// ✅ Horizontal, center, full width
const BtnGroup = ({ children }) => (
    <div className="flex flex-row gap-1.5 w-full justify-center">
        {children}
    </div>
);

// ✅ Helper: Check if within 7 days
const isWithin7Days = (bookingDate) => {
    if (!bookingDate) return false;
    const createdDate = new Date(bookingDate);
    const now = new Date();
    const diffTime = now - createdDate;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
};

export const UserButtons = ({ 
    status, 
    hasRated, 
    handleCancellation, 
    handleEdit, 
    handleView, 
    handleRate,
    bookingDate 
}) => {
    const canEdit = status === 'Pending' && isWithin7Days(bookingDate);
    const canRate = status === 'Completed' && isWithin7Days(bookingDate) && !hasRated;

    switch (status) {
        case 'Pending':
            return (
                <BtnGroup>
                    <button className={canEdit ? btnCyan : btnDisabled} onClick={canEdit ? handleEdit : undefined} disabled={!canEdit}>Edit</button>
                    <button className={btnGreen} onClick={handleView}>View</button>
                    <button className={btnRed} onClick={handleCancellation}>Cancel</button>
                </BtnGroup>
            );
        case 'Confirmed':
            return (
                <BtnGroup>
                    <button className={btnDisabled} disabled>Edit</button>
                    <button className={btnGreen} onClick={handleView}>View</button>
                    <button className={btnDisabled} disabled>Cancel</button>
                </BtnGroup>
            );
        case 'Completed':
            return (
                <BtnGroup>
                    <button className={btnDisabled} disabled>Edit</button>
                    <button className={btnGreen} onClick={handleView}>View</button>
                    {hasRated ? (
                        <button className={btnYellow} onClick={handleRate}>Edit Rate</button>
                    ) : canRate ? (
                        <button className={btnYellow} onClick={handleRate}>Rate Us</button>
                    ) : (
                        <button className={btnDisabled} disabled>Rate</button>
                    )}
                </BtnGroup>
            );
        case 'Cancelled':
            return (
                <BtnGroup>
                    <button className={btnDisabled} disabled>Edit</button>
                    <button className={btnGreen} onClick={handleView}>View</button>
                    <button className={btnDisabled} disabled>Cancel</button>
                </BtnGroup>
            );
        default:
            return null;
    }
};