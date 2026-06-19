import { useState, useEffect } from 'react'
import { DeliveryTable } from './DeliveryTable.jsx'
import { service_config } from '../assets/utils/ServiceConfig.js'
import ProjectorImg from '../assets/Images/hero-projector-BLlExwy9.jpg'
import { service } from '../assets/utils/services.js'
import '../assets/css/HeroSection.css'

const whyChoose = [
    {
        id: 0,
        image: ProjectorImg,
        text: "Some quick example text to build on the card title and make up the bulk of the card’s content for reason 1."
    },
    {
        id: 1,
        image: ProjectorImg,
        text: "Some quick example text to build on the card title and make up the bulk of the card’s content for reason 2."
    },
    {
        id: 2,
        image: ProjectorImg,
        text: "Some quick example text to build on the card title and make up the bulk of the card’s content for reason 3."
    },
]

const ServicesColors = {
    "Golden Hour": "#F59E0B",
    "Snoop Dough": "#92400E",
    "Rental Projector": "#1E293B"
};

// Dinagdag ang serviceConfig prop para mag-reflect ang edits
export const HeroSection = ({ deliveryFee, serviceConfig }) => {
    const [selectedService, setSelectedService] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(0);

    const handleNext = () => {
        setCurrentSlide((prev) => (prev === whyChoose.length - 1 ? 0 : prev + 1));
    };

    const handlePrev = () => {
        setCurrentSlide((prev) => (prev === 0 ? whyChoose.length - 1 : prev - 1));
    };

    useEffect(() => {
        const timer = setInterval(() => {
            handleNext();
        }, 5000);
        return () => clearInterval(timer);
    }, [currentSlide]);

    const handlePackage = (svc) => {
        setSelectedService(svc);
    };

    const closeModal = () => {
        setSelectedService(null);
    }

    return (
        <>
            <div className="w-full px-4 pt-20" id="home">
                <div className="max-w-6xl mx-auto text-center mb-8">
                    <h2 className="text-3xl font-bold mb-6">3 Way variant booking</h2>

                    <div className="booking-variant-grid">
                        {/* 1. Ang buong loop ay kailangang magsimula muna rito */}
                        {service.map((svc) => {
                            {/* 2. Dito sa loob ng loop tamang i-compute ang logic kada variant bago mag-return ng JSX */}
                            const currentBg = ServicesColors[svc.brand] || "#e5e7eb";
                            const isDarkText = svc.brand === "Golden Hour";

                            return (
                                <div key={svc.brand} className="variant-card-item">
                                    {/* 3. Inilapat ang style={{ backgroundColor: currentBg }} at inayos ang conditional text color */}
                                    <div 
                                        className="card h-full w-full shadow-md border border-gray-300 rounded-xl overflow-hidden transition-transform duration-300 hover:-translate-y-1"
                                        style={{ backgroundColor: currentBg }}
                                    >
                                        <div className="flex flex-col justify-between items-center p-5 text-center h-full min-h-[280px]">
                                            <h6 className={`text-lg font-bold mb-2 ${isDarkText ? "text-black" : "text-white"}`} >
                                                {svc.brand}
                                            </h6>
                                            
                                            <div className="w-full my-3 flex justify-center items-center">
                                                <img src={svc.logo} alt={`${svc.brand}`} className="max-h-16 object-contain py-2" />
                                            </div>
                                            
                                            <p className={`text-xs tracking-wider mb-4 font-medium uppercase ${isDarkText ? "text-gray-700" : "text-gray-200"}`}>
                                                {svc.description}
                                            </p>
                                            
                                            <button
                                                className={`mt-auto text-xs font-semibold px-4 py-2 rounded-lg border transition-all duration-200 ${
                                                    isDarkText
                                                        ? "border-black text-black hover:bg-black hover:text-white"
                                                        : "border-white text-white hover:bg-white hover:text-black"
                                                }`}
                                                onClick={() => handlePackage(svc)}
                                            >
                                                View Packages
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Why choose 3 Way Booking Section */}
            <div className="max-w-6xl mx-auto px-4 py-4">
                <h3 className="text-2xl font-bold text-center mb-6">Why choose 3 Way Booking</h3>

                <div className="relative w-full h-[320px] rounded-2xl overflow-hidden shadow-xl bg-black">
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                        {whyChoose.map((item, index) => (
                            <button
                                key={item.id}
                                type="button"
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? "bg-white scale-125" : "bg-white/50"}`}
                                onClick={() => setCurrentSlide(index)}
                            ></button>
                        ))}
                    </div>

                    <div className="relative w-full h-full">
                        {whyChoose.map((item, index) => {
                            const isActive = index === currentSlide;
                            return (
                                <div
                                    key={item.id}
                                    className="absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out"
                                    style={{
                                        opacity: isActive ? 1 : 0,
                                        pointerEvents: isActive ? 'auto' : 'none',
                                        zIndex: isActive ? 1 : 0
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
                            );
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

            <DeliveryTable deliveryFee={deliveryFee} />

            {/* Modal */}
            {selectedService && (
                <div className="fixed inset-0 z-[1050] flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={closeModal}>
                    <div className="relative w-full max-w-lg bg-[#1a1a1a] text-white rounded-2xl shadow-2xl border border-gray-800 overflow-hidden transform transition-all" onClick={e => e.stopPropagation()}>
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
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
                            {/* MISMONG PACKAGES LANG ANG BINAGO DITO SA LOOB NG MODAL PARA MAG-REFLECT ANG EDITS */}
                            {((serviceConfig && serviceConfig[selectedService.brand]) ? serviceConfig : service_config)[selectedService.brand]?.packages?.map((pkg, i) => (
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