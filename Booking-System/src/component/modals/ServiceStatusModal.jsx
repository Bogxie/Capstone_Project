export const ServiceStatusModal = ({
    handleSaveServicesStatus,
    setShowModal,
    editDisabledServices,
    handleToggleServiceStatus,
    isSubmitting
}) => {

    const ALL_SERVICES = ["Golden Hour", "Snoop Dough", "Rental Projector"];

    return (
        <>
            <form onSubmit={handleSaveServicesStatus} className="p-6">
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-[#3a3d48]">
                    <h3 className="text-lg font-bold text-[#b6ff2e]">⚡ Service Availability</h3>
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

                <p className="text-xs mb-4 text-zinc-400">
                    Toggle off a service to disable it.
                    <span className="text-amber-400 ml-1">Disabled services will show as "🚫 Unavailable" to users.</span>
                </p>

                <div className="divide-y border border-[#3a3d48] rounded-xl bg-[#23262f]/30">
                    {ALL_SERVICES.map((serviceName) => {
                        const isDisabled = editDisabledServices.includes(serviceName);
                        const isActive = !isDisabled;

                        return (
                            <div key={serviceName} className="flex justify-between items-center px-4 py-4">
                                <div>
                                    <span className={`text-sm font-bold block ${isDisabled ? 'text-zinc-500 line-through' : 'text-white'}`}>
                                        {serviceName}
                                    </span>
                                    <span className={`text-[11px] font-medium ${isActive ? "text-green-500" : "text-red-500"}`}>
                                        {isActive ? "● Active" : "○ Disabled"}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleToggleServiceStatus(serviceName)}
                                    className={`w-12 h-6 rounded-full relative transition-colors duration-200 focus:outline-none ${isActive ? "bg-[#b6ff2e]" : "bg-zinc-600"}`}
                                >
                                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${isActive ? "translate-x-6" : "translate-x-0"}`} />
                                </button>
                            </div>
                        );
                    })}
                </div>

                <div className="flex gap-2 mt-6 pt-4 border-t border-[#3a3d48]">
                    <button
                        type="submit"
                        className="flex-1 px-4 py-2.5 bg-[#b6ff2e] hover:bg-[#a3e829] text-[#23262f] font-semibold rounded-lg transition text-sm"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Saving...' : '💾 Save'}
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