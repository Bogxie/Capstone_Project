export const PackagesModal = ({ closeModal, selectedService, serviceConfig, themeColors }) => {
    return (
        <>
            <div
                className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    backdropFilter: 'blur(8px)',
                    zIndex: 9999,
                }}
                onClick={closeModal}
            >
                <div
                    className="relative w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                    style={{
                        backgroundColor: 'var(--bg-modal, #ffffff)',
                        color: 'var(--text-primary, #0f172a)',
                        border: '1px solid var(--border, #e2e8f0)',
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Modal Header */}
                    <div className="flex items-center justify-between p-5 border-b shrink-0"
                        style={{
                            borderColor: 'var(--border, #e2e8f0)',
                        }}
                    >
                        <h5 
                            className="text-lg font-bold" 
                            style={{ 
                                color: '#b6ff2e',
                                // Using CSS variables - automatically applies only in light mode
                                WebkitTextStroke: 'var(--text-stroke-width, 0) var(--text-stroke-color, transparent)',
                                WebkitTextStrokeColor: 'var(--text-stroke-color, transparent)',
                                textShadow: 'var(--text-shadow, none)',
                            }}
                        >
                            {selectedService.brand} Packages
                        </h5>
                        <button
                            type="button"
                            className="p-1 rounded-lg hover:bg-bg-hover transition-colors"
                            style={{
                                color: 'var(--text-muted, #94a3b8)',
                            }}
                            onClick={closeModal}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Modal Body */}
                    <div className="p-6 overflow-y-auto flex-1">
                        {serviceConfig?.[selectedService.brand]?.packages?.length > 0 ? (
                            <div className="space-y-4">
                                {serviceConfig[selectedService.brand].packages.map((pkg, i) => {
                                    const serviceColor = themeColors[selectedService.brand]?.tailwind?.badge || 'bg-[#b6ff2e] text-black'
                                    return (
                                        <div key={i} className="border-b pb-4 last:border-0 last:pb-0"
                                            style={{
                                                borderColor: 'var(--border, #e2e8f0)',
                                            }}
                                        >
                                            <div className="flex justify-between items-start gap-4">
                                                <strong className="font-semibold text-sm"
                                                    style={{
                                                        color: 'var(--text-primary, #0f172a)',
                                                    }}
                                                >
                                                    {pkg.name || 'Unnamed Package'}
                                                </strong>
                                                <span className={`px-3 py-1 text-xs font-bold rounded-full shrink-0 ${serviceColor}`}>
                                                    {pkg.price || '₱0'}
                                                </span>
                                            </div>
                                            {pkg.details && (
                                                <p className="text-xs mt-1.5 leading-relaxed"
                                                    style={{
                                                        color: 'var(--text-secondary, #475569)',
                                                    }}
                                                >
                                                    {pkg.details}
                                                </p>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-8"
                                style={{
                                    color: 'var(--text-muted, #94a3b8)',
                                }}
                            >
                                <p className="text-sm">No packages available for this service.</p>
                            </div>
                        )}
                    </div>

                    {/* Modal Footer */}
                    <div className="p-4 border-t shrink-0"
                        style={{
                            borderColor: 'var(--border, #e2e8f0)',
                        }}
                    >
                        <button
                            className="w-full px-4 py-2.5 bg-[#b6ff2e] hover:bg-[#a3e829] text-black font-semibold rounded-lg transition-colors text-sm"
                            onClick={closeModal}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}