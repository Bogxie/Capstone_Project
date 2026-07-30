const btnBase = "w-[58px] py-1 text-[10px] font-semibold rounded-lg border transition-colors text-center";
const btnCyan = `${btnBase} border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black`;
const btnGreen = `${btnBase} border-green-400 text-green-400 hover:bg-green-400 hover:text-black`;
const btnRed = `${btnBase} border-red-400 text-red-400 hover:bg-red-400 hover:text-black`;
const btnYellow = `${btnBase} border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black`;
const btnDisabled = `${btnBase} border-gray-700 text-gray-600 cursor-not-allowed opacity-40`;

const BtnGroup = ({ children }) => (
    <div className="flex flex-row gap-1 items-center">
        {children}
    </div>
);

export const UserButtons = ({ status, hasRated, handleCancellation, handleEdit, handleView, handleRate }) => {
    switch (status) {
        case 'Pending':
            return (
                <BtnGroup>
                    <button className={btnCyan} onClick={handleEdit}>Edit</button>
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
                    <button className={btnYellow} onClick={handleRate}>
                        {hasRated ? "Rated ⭐" : "Rate Us"}
                    </button>
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