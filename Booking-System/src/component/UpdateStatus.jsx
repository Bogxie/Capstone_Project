export const UpdateStatus = ({
    status,
    handleConfirmation,
    handleComplete,
    handleRevert,
}) => {
    
    if (status === 'Pending') {
        return (
            <button
                onClick={handleConfirmation}
                className="w-full rounded-md border border-yellow-500 text-yellow-500 px-3 py-1.5 text-[10px] transition hover:bg-yellow-500 hover:text-white"
            >
                Confirm
            </button>
        );
    }

    // ✅ Confirmed → Complete + Revert (to Pending)
    if (status === 'Confirmed') {
        return (
            <div className="flex gap-1 w-full">
                <button
                    onClick={handleComplete}
                    className="flex-1 rounded-md border border-sky-500 text-sky-500 px-2 py-1.5 text-[10px] transition hover:bg-sky-500 hover:text-white"
                >
                    Complete
                </button>
                <button
                    onClick={handleRevert}
                    className="flex-1 rounded-md border border-gray-500 text-gray-500 px-2 py-1.5 text-[10px] transition hover:bg-gray-500 hover:text-white"
                >
                    Revert
                </button>
            </div>
        );
    }

    if (status === 'Completed') {
        return (
            <button
                onClick={handleRevert}
                className="w-full rounded-md border border-gray-500 text-gray-500 px-3 py-1.5 text-[10px] transition hover:bg-gray-500 hover:text-white"
            >
                Revert
            </button>
        );
    }

    if (status === 'Cancelled') {
        return (
            <button
                onClick={handleRevert}
                className="w-full rounded-md border border-gray-500 text-gray-500 px-3 py-1.5 text-[10px] transition hover:bg-gray-500 hover:text-white"
            >
                Revert to Pending
            </button>
        );
    }

    return null;
};