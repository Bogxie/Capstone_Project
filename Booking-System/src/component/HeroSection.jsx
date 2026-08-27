import { useState, useEffect } from 'react'
import { useAuth } from '../context/useAuth.js'
import { useService } from '../context/useService.js'
import { DeliveryTable } from './DeliveryTable.jsx'
import { PackagesModal } from './modals/PackagesModal.jsx'
import { themeColors } from '../assets/utils/themeColors.js'
import { service } from '../assets/utils/services.js'
import GoldenHourImg from '../assets/Images/Ai.jpg'
import GoldenHourImg2 from '../assets/images/Ai2.png'
import SnoopDoughImg from '../assets/images/Ai3.jpg'
import SnoopDoughImg2 from '../assets/images/Ai4.jpg'
import ProjectorImg from '../assets/images/Ai5.jpg'
import ProjectorImg2 from '../assets/images/Ai6.jpg'
import '../assets/css/HeroSection.css'

const whyChoose = [
    {
        id: 0,
        image: GoldenHourImg,
        title: "Golden Hour",
        subtitle: "Video & Photography",
        text: "Capture your most important moments with professional video and photography services, specially made for weddings, prenup shoots, and special events."
    },
    {
        id: 1,
        image: GoldenHourImg2,
        title: "Wedding Memories That Last",
        subtitle: "Golden Hour",
        text: "From the ceremony to the reception, Golden Hour helps preserve the emotions, details, and unforgettable moments of your special day."
    },
    {
        id: 2,
        image: SnoopDoughImg,
        title: "Snoop Dough",
        subtitle: "Pandesal Catering",
        text: "Make your event extra special with freshly prepared pandesal catering, perfect for weddings, birthdays, gatherings, and other special occasions."
    },
    {
        id: 3,
        image: SnoopDoughImg2,
        title: "Freshly Baked for Your Event",
        subtitle: "Snoop Dough",
        text: "Give your guests something delicious to enjoy with freshly baked pandesal prepared to complement your event and make every gathering memorable."
    },
    {
        id: 4,
        image: ProjectorImg,
        title: "Projector Rental",
        subtitle: "For Every Event",
        text: "Bring your presentations, wedding videos, photo slideshows, meetings, and special events to life with our reliable projector rental service."
    },
    {
        id: 5,
        image: ProjectorImg2,
        title: "Complete Event Experience",
        subtitle: "E-vent Flow",
        text: "From capturing memories and serving delicious food to providing essential event equipment, E-vent Flow brings practical event services together in one place."
    },
]

export const HeroSection = () => {

    const { currentUser, setShowSignIn } = useAuth();
    const { serviceConfig, municipalities } = useService();
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
        if (!currentUser) {
            setShowSignIn(true);
            return;
        }
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

            {/* ✅ Why Choose Section - MAS MALIIT ANG LAPAD */}
            <div className="max-w-4xl mx-auto px-4 py-4">
                <h3 className="text-2xl font-bold text-center mb-6 text-text-primary">
                    Why choose E-vent <span className="text-[#b6ff2e]">Flow</span>
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
                                        className="w-full h-full object-contain brightness-[45%]"
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

            {/* Delivery Table */}
            <DeliveryTable municipalities={municipalities} />

            {/* Package Modal */}
            {selectedService && (
                <PackagesModal
                    closeModal={closeModal}
                    selectedService={selectedService}
                    serviceConfig={serviceConfig}
                    themeColors={themeColors}
                />
            )}
        </>
    )
}