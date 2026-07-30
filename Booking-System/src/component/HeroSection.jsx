import { useState, useEffect } from 'react'
import { DeliveryTable } from './DeliveryTable.jsx'
import { themeColors } from '../assets/utils/themeColors.js'
import { service } from '../assets/utils/services.js'
import ProjectorImg from '../assets/Images/hero-projector-BLlExwy9.jpg'
import '../assets/css/HeroSection.css'

const whyChoose = [
    {
        id: 0,
        image: ProjectorImg,
        title: "Premium Quality",
        text: "Some quick example text to build on the card title and make up the bulk of the card's content for reason 1."
    },
    {
        id: 1,
        image: ProjectorImg,
        title: "Affordable Rates",
        text: "Some quick example text to build on the card title and make up the bulk of the card's content for reason 2."
    },
    {
        id: 2,
        image: ProjectorImg,
        title: "Excellent Service",
        text: "Some quick example text to build on the card title and make up the bulk of the card's content for reason 3."
    },
]

export const HeroSection = ({
    serviceConfig,
    municipalities = []
}) => {
    const [selectedService, setSelectedService] = useState(null)
    const [currentSlide, setCurrentSlide] = useState(0)

    const handleNext = () => {
        setCurrentSlide((prev) => (prev === whyChoose.length - 1 ? 0 : prev + 1))
    }

    const handlePrev = () => {
        setCurrentSlide((prev) => (prev === 0 ? whyChoose.length - 1 : prev - 1))
    }

    useEffect(() => {
        const timer = setInterval(() => {
            handleNext()
        }, 5000)
        return () => clearInterval(timer)
    }, [currentSlide])

    const handlePackage = (svc) => {
        console.log('📦 View Packages clicked:', svc.brand);
        console.log('📦 Packages data:', serviceConfig?.[svc.brand]?.packages);
        setSelectedService(svc)
    }

    const closeModal = () => {
        console.log('🔒 Closing modal...');
        setSelectedService(null)
    }

    const getTheme = (svc) => {
        const theme = themeColors[svc.brand]
        if (theme) {
            return {
                bg: theme.bg || '#e5e7eb',
                text: theme.text || 'dark',
                logo: svc.logo || theme.logo || '/images/default-logo.png',
                description: svc.description || theme.description || 'Default description',
            }
        }

        return {
            bg: svc.class || '#e5e7eb',
            text: svc.brand === 'Golden Hour' ? 'dark' : 'light',
            logo: svc.logo || '/images/default-logo.png',
            description: svc.description || 'Default description',
        }
    }

    const displayServices = serviceConfig ? Object.keys(serviceConfig).map((brand) => {
        const hardcoded = service.find((s) => s.brand === brand)
        return {
            brand: brand,
            ...serviceConfig[brand],
            logo: hardcoded?.logo || null,
            description: hardcoded?.description || 'Default description',
            class: hardcoded?.class || '',
        }
    }) : []

    const hasData = serviceConfig && Object.keys(serviceConfig).length > 0

    return (
        <>
            {/* Hero Section */}
            <div className="w-full px-4 pt-20" id="home">
                <div className="max-w-6xl mx-auto text-center mb-8">
                    <h2 className="text-3xl font-bold mb-6 text-text-primary">3 Way variant booking</h2>

                    {!hasData ? (
                        <div className="text-center py-20 text-text-secondary font-medium animate-pulse">
                            No services available
                        </div>
                    ) : (
                        <div className="booking-variant-grid">
                            {displayServices.map((svc) => {
                                const theme = getTheme(svc)
                                const currentBg = theme.bg
                                const isDarkText = theme.text === 'dark'
                                const logo = theme.logo
                                const description = theme.description

                                return (
                                    <div key={svc.brand} className="variant-card-item">
                                        <div
                                            className="card h-full w-full shadow-md border border-border rounded-xl overflow-hidden transition-transform duration-300 hover:-translate-y-1"
                                            style={{ backgroundColor: currentBg }}
                                        >
                                            <div className="flex flex-col justify-between items-center p-5 text-center h-full min-h-[280px]">
                                                <h6 className={`text-lg font-bold mb-2 ${isDarkText ? 'text-black' : 'text-white'}`}>
                                                    {svc.brand}
                                                </h6>

                                                <div className="w-full my-3 flex justify-center items-center">
                                                    {logo ? (
                                                        <img
                                                            src={logo}
                                                            alt={svc.brand}
                                                            className="max-h-16 object-contain py-2"
                                                        />
                                                    ) : (
                                                        <div className="text-xs text-text-muted">No logo</div>
                                                    )}
                                                </div>

                                                <p className={`text-xs tracking-wider mb-4 font-medium uppercase ${isDarkText ? 'text-gray-700' : 'text-gray-200'}`}>
                                                    {description}
                                                </p>

                                                <button
                                                    className={`mt-auto text-xs font-semibold px-4 py-2 rounded-lg border transition-all duration-200 ${isDarkText
                                                        ? 'border-black text-black hover:bg-black hover:text-white'
                                                        : 'border-white text-white hover:bg-white hover:text-black'
                                                        }`}
                                                    onClick={() => handlePackage(svc)}
                                                >
                                                    View Packages
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Why Choose Section */}
            <div className="max-w-6xl mx-auto px-4 py-4">
                <h3 className="text-2xl font-bold text-center mb-6 text-text-primary">
                    Why choose E-vent <span className="text-lime-400">Flow</span>
                </h3>
                <div className="relative w-full h-[320px] rounded-2xl overflow-hidden shadow-xl bg-black">
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                        {whyChoose.map((item, index) => (
                            <button
                                key={item.id}
                                type="button"
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-white scale-125' : 'bg-white/50'
                                    }`}
                                onClick={() => setCurrentSlide(index)}
                            />
                        ))}
                    </div>

                    <div className="relative w-full h-full">
                        {whyChoose.map((item, index) => {
                            const isActive = index === currentSlide
                            return (
                                <div
                                    key={item.id}
                                    className="absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out"
                                    style={{
                                        opacity: isActive ? 1 : 0,
                                        pointerEvents: isActive ? 'auto' : 'none',
                                        zIndex: isActive ? 1 : 0,
                                    }}
                                >
                                    <img
                                        src={item.image}
                                        className="w-full h-full object-cover brightness-[45%]"
                                        alt={item.title}
                                    />
                                    <div className="absolute inset-x-0 bottom-12 max-w-xl mx-auto text-center px-6 py-4 bg-black/40 backdrop-blur-sm rounded-xl border border-white/10">
                                        <h5 className="text-xl font-bold text-white mb-2">{item.title}</h5>
                                        <p className="text-gray-200 text-sm leading-relaxed">{item.text}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <button
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-sm transition-colors z-10"
                        onClick={handlePrev}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-sm transition-colors z-10"
                        onClick={handleNext}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Delivery Table - Use municipalities from props */}
            <DeliveryTable municipalities={municipalities} />

            {/* ✅ FIXED MODAL - With proper light/dark text */}
            {selectedService && (
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
                            <h5 className="text-lg font-bold text-lime-500 dark:text-lime-400">
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

                        {/* Modal Body - Packages List */}
                        <div className="p-6 overflow-y-auto flex-1">
                            {serviceConfig?.[selectedService.brand]?.packages?.length > 0 ? (
                                <div className="space-y-4">
                                    {serviceConfig[selectedService.brand].packages.map((pkg, i) => {
                                        const serviceColor = themeColors[selectedService.brand]?.tailwind?.badge || 'bg-lime-500 text-black'
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
                                className="w-full px-4 py-2.5 bg-lime-500 hover:bg-lime-600 text-black font-semibold rounded-lg transition-colors text-sm"
                                onClick={closeModal}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}