export const BlackoutModal = ({
    handleSaveBlackoutDates,
    setShowModal,
    newBlackoutDate,
    setNewBlackoutDate,
    handleAddBlackoutDate,
    editBlackoutDates,
    handleRemoveBlackoutDate,
    isSubmitting
}) => {
    return (
        <>
            <form onSubmit={handleSaveBlackoutDates} className="p-6">
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-[#3a3d48]">
                    <h3 className="text-lg font-bold text-[#b6ff2e]">🚫 Blackout Dates</h3>
                    <button
                        type="button"
                        onClick={() => setShowModal(false)}
                        className="p-1 rounded-lg hover:bg-[#23262f] text-zinc-400 hover:text-white transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="flex gap-2 mb-4">
                    <input
                        type="date"
                        value={newBlackoutDate}
                        onChange={(e) => setNewBlackoutDate(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg border border-[#3a3d48] bg-[#23262f] text-white text-sm focus:border-[#b6ff2e] focus:outline-none focus:ring-2 focus:ring-[#b6ff2e]/20"
                    />
                    <button
                        type="button"
                        onClick={handleAddBlackoutDate}
                        className="px-4 py-2 bg-[#b6ff2e] hover:bg-[#a3e829] text-[#23262f] text-sm font-bold rounded-lg transition"
                    >
                        ➕ Block Date
                    </button>
                </div>
                <div className="border border-[#3a3d48] rounded-xl p-3 max-h-[35vh] overflow-y-auto space-y-2 bg-[#23262f]">
                    {editBlackoutDates.length > 0 ? (
                        editBlackoutDates.map((date) => (
                            <div key={date} className="flex justify-between items-center px-3 py-2 rounded-lg border border-[#3a3d48] bg-[#2d303a]">
                                <span className="text-sm font-mono font-bold text-white">🗓️ {date}</span>
                                <button type="button" onClick={() => handleRemoveBlackoutDate(date)} className="text-red-500 text-xs font-semibold px-2 py-1 rounded hover:bg-red-500/10 transition">🗑️ Remove</button>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-4 text-zinc-400">No blackout dates set.</div>
                    )}
                </div>
                <div className="flex gap-2 mt-6 pt-4 border-t border-[#3a3d48]">
                    <button
                        type="submit"
                        className="flex-1 px-4 py-2.5 bg-[#b6ff2e] hover:bg-[#a3e829] text-[#23262f] font-semibold rounded-lg transition text-sm disabled:opacity-50"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Saving...' : '💾 Save Blackout Dates'}
                    </button>
                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 bg-[#23262f] border border-[#3a3d48] text-white font-semibold rounded-lg hover:bg-[#2d303a] transition text-sm">Cancel</button>
                </div>
            </form>
        </>
    )
}