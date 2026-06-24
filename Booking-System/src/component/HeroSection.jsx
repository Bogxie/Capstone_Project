import { useState, useEffect } from 'react'
import axios from 'axios'
import { DeliveryTable } from './DeliveryTable.jsx'
import { service_config } from '../assets/utils/ServiceConfig.js'
import { service } from '../assets/utils/services.js'
import { themeColors } from '../assets/utils/themeColors.js'
import ProjectorImg from '../assets/Images/hero-projector-BLlExwy9.jpg'
import '../assets/css/HeroSection.css'

const whyChoose = [
    {
        id: 0,
        image: ProjectorImg,
        text: "Some quick example text to build on the card title and make up the bulk of the card's content for reason 1."
    },
    {
        id: 1,
        image: ProjectorImg,
        text: "Some quick example text to build on the card title and make up the bulk of the card's content for reason 2."
    },
    {
        id: 2,
        image: ProjectorImg,
        text: "Some quick example text to build on the card title and make up the bulk of the card's content for reason 3."
    },
]

export const HeroSection = ({ deliveryFee }) => {
    const [selectedService, setSelectedService] = useState(null)
    const [currentSlide, setCurrentSlide] = useState(0)
    const [dbConfig, setDbConfig] = useState(null)
    const [dbServicesList, setDbServicesList] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Fetch services from backend
    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/services')
                const data = response.data

                console.log('✅ Data from DB:', data)
                setDbConfig(data)

                // Combine DB data with service.js (for logo, description, class)
                const servicesArray = Object.keys(data).map((brand) => {
                    const hardcoded = service.find((s) => s.brand === brand)
                    return {
                        brand: brand,
                        ...data[brand],
                        logo: hardcoded?.logo || null,
                        description: hardcoded?.description || 'Default description',
                        class: hardcoded?.class || '',
                    }
                })

                console.log('✅ Services Array:', servicesArray)
                setDbServicesList(servicesArray)
                setLoading(false)
            } catch (err) {
                console.error('❌ Error fetching services:', err)
                setError(err.message)
                setLoading(false)

                // Fallback: use hardcoded service.js
                console.log('⚠️ Using fallback hardcoded data')
                setDbServicesList(service)
                setDbConfig(service_config)
            }
        }

        fetchServices()
    }, [])

    // Carousel handlers
    const handleNext = () => {
        setCurrentSlide((prev) => (prev === whyChoose.length - 1 ? 0 : prev + 1))
    }

    const handlePrev = () => {
        setCurrentSlide((prev) => (prev === 0 ? whyChoose.length - 1 : prev - 1))
    }

    // Auto-slide
    useEffect(() => {
        const timer = setInterval(() => {
            handleNext()
        }, 5000)
        return () => clearInterval(timer)
    }, [currentSlide])

    const handlePackage = (svc) => {
        setSelectedService(svc)
    }

    const closeModal = () => {
        setSelectedService(null)
    }

    // ✅ Get theme for a service (from themeColors or fallback)
    const getTheme = (svc) => {
        // Try from themeColors first
        const theme = themeColors[svc.brand]
        if (theme) {
            return {
                bg: theme.bg || '#e5e7eb',
                text: theme.text || 'dark',
                logo: svc.logo || theme.logo || '/images/default-logo.png',
                description: svc.description || theme.description || 'Default description',
            }
        }

        // Fallback: use svc.class and svc.logo/description from service.js
        return {
            bg: svc.class || '#e5e7eb',
            text: svc.brand === 'Golden Hour' ? 'dark' : 'light',
            logo: svc.logo || '/images/default-logo.png',
            description: svc.description || 'Default description',
        }
    }

    // Loading state
    if (loading) {
        return <div className="text-center py-20 text-white">Loading services from database...</div>
    }

    // Error state — no data to show
    if (error && !dbServicesList.length) {
        return (
            <div className="text-center py-20">
                <div className="text-red-400 text-xl font-bold mb-4">❌ No data from backend</div>
                <div className="text-gray-400">Backend is offline or no services found in database</div>
                {error && <div className="text-gray-500 text-sm mt-2">Error: {error}</div>}
            </div>
        )
    }

    const displayServices = dbServicesList.length > 0 ? dbServicesList : service
    const displayConfig = dbConfig || service_config

    return (
        <>
            {/* Hero Section */}
            <div className="w-full px-4 pt-20" id="home">
                <div className="max-w-6xl mx-auto text-center mb-8">
                    <h2 className="text-3xl font-bold mb-6 text-white">3 Way variant booking</h2>

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
                                        className="card h-full w-full shadow-md border border-gray-300 rounded-xl overflow-hidden transition-transform duration-300 hover:-translate-y-1"
                                        style={{ backgroundColor: currentBg }}
                                    >
                                        <div className="flex flex-col justify-between items-center p-5 text-center h-full min-h-[280px]">
                                            <h6
                                                className={`text-lg font-bold mb-2 ${
                                                    isDarkText ? 'text-black' : 'text-white'
                                                }`}
                                            >
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
                                                    <div className="text-xs text-gray-400">No logo</div>
                                                )}
                                            </div>

                                            <p
                                                className={`text-xs tracking-wider mb-4 font-medium uppercase ${
                                                    isDarkText ? 'text-gray-700' : 'text-gray-200'
                                                }`}
                                            >
                                                {description}
                                            </p>

                                            <button
                                                className={`mt-auto text-xs font-semibold px-4 py-2 rounded-lg border transition-all duration-200 ${
                                                    isDarkText
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
                </div>
            </div>

            {/* Why Choose Section */}
            <div className="max-w-6xl mx-auto px-4 py-4">
                <h3 className="text-2xl font-bold text-center mb-6 text-white">Why choose 3 Way Booking</h3>

                <div className="relative w-full h-[320px] rounded-2xl overflow-hidden shadow-xl bg-black">
                    {/* Dots indicator */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                        {whyChoose.map((item, index) => (
                            <button
                                key={item.id}
                                type="button"
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                    index === currentSlide ? 'bg-white scale-125' : 'bg-white/50'
                                }`}
                                onClick={() => setCurrentSlide(index)}
                            />
                        ))}
                    </div>

                    {/* Slides */}
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

                    {/* Navigation buttons */}
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
            <DeliveryTable deliveryFee={deliveryFee} />

            {/* Modal */}
            {selectedService && (
                <div
                    className="fixed inset-0 z-[1050] flex items-center justify-center bg-black/80 backdrop-blur-sm"
                    onClick={closeModal}
                >
                    <div
                        className="relative w-full max-w-lg bg-[#1a1a1a] text-white rounded-2xl shadow-2xl border border-gray-800 overflow-hidden transform transition-all"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between p-5 border-b border-gray-800">
                            <h5 className="text-lg font-bold text-cyan-400 border-b-2 border-cyan-400 pb-1">
                                {selectedService.brand} Packages
                            </h5>
                            <button
                                type="button"
                                className="text-gray-400 hover:text-white transition-colors"
                                onClick={closeModal}
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
                            {(displayConfig[selectedService.brand]?.packages || []).map((pkg, i) => (
                                <div key={i} className="border-b border-gray-800 pb-3 last:border-0 last:pb-0">
                                    <div className="flex justify-between items-start gap-4">
                                        <strong className="text-gray-100 font-semibold">{pkg.name}</strong>
                                        <span className="px-2 py-0.5 text-xs font-bold bg-cyan-400 text-black rounded">
                                            {pkg.price}
                                        </span>
                                    </div>
                                    <p className="text-gray-400 text-xs mt-1 leading-relaxed">{pkg.details}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}