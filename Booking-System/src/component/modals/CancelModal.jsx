export const CancelModal = ({
  booking,
  handleCancellation,
  onClose,
}) => {
  if (!booking) return null;

  return (
    <div className="fixed inset-0 z-[1050] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-red-500 bg-zinc-900 text-white shadow-xl">
        {/* Header */}
        <div className="relative p-4">
          <h5 className="border-b border-red-500 pb-2 text-center text-lg font-semibold">
            Cancellation Booking
          </h5>

          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 transition hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col items-center p-4">
          <p className="text-center">
            Are you sure you want to cancel booking{" "}
            <strong>ID: {booking.bookID}</strong>?
          </p>

          <p className="mt-2 text-center text-sm text-red-400">
            Note: Your down payment is non-refundable.
          </p>

          <div className="mt-4 flex w-full gap-2">
            <button
              className="flex-1 rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition hover:bg-red-700"
              onClick={() =>
                handleCancellation(booking.bookID, {
                  status: "Cancelled",
                })
              }
            >
              Yes
            </button>

            <button
              className="flex-1 rounded-lg bg-zinc-700 px-4 py-2 font-medium text-white transition hover:bg-zinc-600"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};