export const UpdateStatus = ({
    status,
    handleConfirmation,
    handleComplete,
}) => {
    const configs = {
        Pending: {
            text: "Confirm",
            onClick: handleConfirmation,
            className:
                "border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white",
        },
        Confirmed: {
            text: "Complete",
            onClick: handleComplete,
            className:
                "border-sky-500 text-sky-500 hover:bg-sky-500 hover:text-white",
        },
        Complete: {
            text: "Completed",
            disabled: true,
            className:
                "border-green-500 text-green-500 opacity-70 cursor-not-allowed",
        },
        Cancelled: {
            text: "Cancelled",
            disabled: true,
            className:
                "border-red-500 text-red-500 opacity-70 cursor-not-allowed",
        },
    };

    const config = configs[status];

    if (!config) return null;

    return (
        <button
            onClick={config.onClick}
            disabled={config.disabled}
            className={`w-full rounded-md border px-4 py-2 transition ${config.className}`}
        >
            {config.text}
        </button>
    );
};