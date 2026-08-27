export const EditFeesModal = ({
    handleSaveFees,
    setShowModal,
    editFees,
    handleFeeChange,
    isSubmitting
}) => {
    return (
        <>
            <form onSubmit={handleSaveFees} className="p-6">
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-[#3a3d48]">
                    <h3 className="text-lg font-bold text-[#b6ff2e]">💰 Edit Delivery Fees</h3>
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
                <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2 hide-scrollbar">
                    {editFees.map((item, index) => (
                        <div key={item.municipality_id || index} className="flex items-center justify-between gap-3 p-2 rounded-lg bg-[#23262f]">
                            <label className="text-sm flex-1 font-medium text-white">{item.municipality}</label>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-zinc-400">₱</span>
                                <input
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={item.fee || 0}
                                    onChange={(e) => handleFeeChange(index, e.target.value)}
                                    className="w-28 px-3 py-1.5 rounded-lg border border-[#3a3d48] bg-[#23262f] text-white text-sm focus:border-[#b6ff2e] focus:outline-none focus:ring-2 focus:ring-[#b6ff2e]/20"
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex gap-2 mt-6 pt-4 border-t border-[#3a3d48]">
                    <button
                        type="submit"
                        className="flex-1 px-4 py-2.5 bg-[#b6ff2e] hover:bg-[#a3e829] text-[#23262f] font-semibold rounded-lg transition disabled:opacity-50 text-sm"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Saving...' : '💾 Save Fees'}
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowModal(false)}
                        className="flex-1 px-4 py-2.5 bg-[#23262f] border border-[#3a3d48] text-white font-semibold rounded-lg hover:bg-[#2d303a] transition text-sm"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </>
    )
}