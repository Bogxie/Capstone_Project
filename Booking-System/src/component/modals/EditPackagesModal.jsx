export const EditPackagesModal = ({
    handleSavePackages,
    setShowModal,
    editPackages,
    handlePackageChange
}) => {
    return (
        <>
            <form onSubmit={handleSavePackages} className="p-6">
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-[#3a3d48]">
                    <h3 className="text-lg font-bold text-[#b6ff2e]">📦 Edit Service Packages</h3>
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
                <div className="space-y-6 max-h-[50vh] overflow-y-auto pr-2 hide-scrollbar">
                    {editPackages && Object.keys(editPackages).length > 0 ? (
                        Object.keys(editPackages).map((brand) => (
                            <div key={brand} className="border border-[#3a3d48] rounded-xl p-4 bg-[#23262f]">
                                <h4 className="text-sm font-bold text-[#b6ff2e] mb-3 uppercase border-b border-[#3a3d48] pb-2">{brand}</h4>
                                <div className="space-y-4">
                                    {editPackages[brand]?.packages?.map((pkg, i) => (
                                        <div key={i} className="p-4 rounded-lg space-y-3 border border-[#3a3d48] bg-[#2d303a]">
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="text-[10px] block uppercase font-bold mb-1 text-zinc-400">Package Name</label>
                                                    <input
                                                        type="text"
                                                        value={pkg.name || ''}
                                                        onChange={(e) => handlePackageChange(brand, i, "name", e.target.value)}
                                                        className="w-full px-3 py-2 rounded-lg border border-[#3a3d48] bg-[#23262f] text-white text-sm focus:border-[#b6ff2e] focus:outline-none focus:ring-2 focus:ring-[#b6ff2e]/20"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] block uppercase font-bold mb-1 text-zinc-400">Price</label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        value={pkg.price || 0}
                                                        onChange={(e) => handlePackageChange(brand, i, "price", e.target.value)}
                                                        className="w-full px-3 py-2 rounded-lg border border-[#3a3d48] bg-[#23262f] text-white text-sm focus:border-[#b6ff2e] focus:outline-none focus:ring-2 focus:ring-[#b6ff2e]/20"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-[10px] block uppercase font-bold mb-1 text-zinc-400">Details</label>
                                                <input
                                                    type="text"
                                                    value={pkg.details || ''}
                                                    onChange={(e) => handlePackageChange(brand, i, "details", e.target.value)}
                                                    className="w-full px-3 py-2 rounded-lg border border-[#3a3d48] bg-[#23262f] text-white text-sm focus:border-[#b6ff2e] focus:outline-none focus:ring-2 focus:ring-[#b6ff2e]/20"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-zinc-400">No packages available.</div>
                    )}
                </div>
                <div className="flex gap-2 mt-6 pt-4 border-t border-[#3a3d48]">
                    <button type="submit" className="flex-1 px-4 py-2.5 bg-[#b6ff2e] hover:bg-[#a3e829] text-[#23262f] font-semibold rounded-lg transition text-sm">💾 Save All Packages</button>
                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 bg-[#23262f] border border-[#3a3d48] text-white font-semibold rounded-lg hover:bg-[#2d303a] transition text-sm">Cancel</button>
                </div>
            </form>
        </>
    )
}