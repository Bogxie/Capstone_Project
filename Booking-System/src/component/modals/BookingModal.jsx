import { useState, useEffect, useRef } from "react";
import { motion } from 'framer-motion';
import { InputsModal } from "./InputsModal.jsx";
import { BookingSummaryModal } from "./BookingSummary.jsx";
import { PaymentModal } from './PaymentModal.jsx';
import { getDeliveryFee } from '../../assets/utils/deliveryOptions.js';
import { timeFormat } from "../../assets/Utils/tImeOptions.jsx";
import { timeRestriction } from "../../assets/Utils/TimeRestriction.js";
import { calculatingTotal } from "../../assets/Utils/calculatingTotal.js";
import { TermsModal } from "./TermsModal.jsx";
import { service_config } from "../../assets/Utils/ServiceConfig.js";
import '../../assets/css/BookingModal.css';
import { useBooking } from "../../context/useBooking.js";

const Downpayment = 1000;

const headerTheme = {
    "Golden Hour": { bg: "bg-[#F59E0B]", closeBtn: "text-black" },
    "Snoop Dough": { bg: "bg-[#92400E]", closeBtn: "text-white" },
    "Rental Projector": { bg: "bg-[#1E293B]", closeBtn: "text-white" },
};

export const BookingModal = ({
    selectedDate, onClose, showReceipt, serviceName, handleBackOptions
}) => {

    const config = service_config[serviceName];
    const theme = headerTheme[serviceName] ?? { bg: "bg-gray-700", closeBtn: "text-white" };

    const { addBooking } = useBooking();
    const [step, setStep] = useState(1);
    const [showTerms, setShowTerms] = useState(false);
    const [isTermsAccepted, setIsTermsAccepted] = useState(false);
    const [timeError, setTimeError] = useState('');
    const scrollContainerRef = useRef(null);

    // OPTIMIZED INITIALIZATION: Direkta nang binabasa ang config price dito
    // para maiwasan ang cascading/extra render cycles ng useEffect
    const [bookingDetails, setBookingDetails] = useState(() => {
        const packagePrice = config ? Number(config.price || config.rate) || 0 : 0;
        return {
            fullName: "",
            email: "",
            phoneNum: "",
            rentalFee: packagePrice, 
            municipality: "",
            deliveryFee: 0,
            venue: "",
            lat: null,
            lng: null,
            description: "",
            status: "Pending",
            tax: 0,
            type: "",
            total: 0,
            downpayment: Downpayment,
            timeStart: "",
            timeStartAmPm: "AM",
            paymentMethod: "",
            timeEnd: "",
            timeEndAmPm: "PM",
            service: serviceName,
            month: selectedDate.month,
            date: selectedDate.date,
            year: selectedDate.year
        };
    });

    // Reset scroll container kapag nagbago ang step
    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = 0;
        }
    }, [step]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "phoneNum") {
            const cleaned = value.replace(/[^0-9]/g, "");
            setBookingDetails(prev => ({ ...prev, [name]: cleaned }));
            return;
        }
        if (name === "fullName") {
            const cleaned = value.replace(/[^A-Za-z\s]/g, "");
            setBookingDetails(prev => ({ ...prev, [name]: cleaned }));
            return;
        }
        setBookingDetails((prev) => ({ ...prev, [name]: value }));
    };

    const handleLocationSelect = ({ venue, lat, lng, municipality }) => {
        const fee = municipality ? getDeliveryFee(municipality) : null;
        
        if (fee === null) {
            setBookingDetails(prev => ({
                ...prev,
                venue: "", 
                lat: null,
                lng: null,
                municipality: "",
                deliveryFee: 0
            }));
            setTimeError("Service area is Cavite only. Please choose a location within Cavite.");
            setTimeout(() => setTimeError(""), 5000);
            return;
        }

        setBookingDetails(prev => ({
            ...prev,
            venue,
            lat,
            lng,
            municipality,
            deliveryFee: fee,
        }));
        setTimeError("");
    };

    const onConfirm = (selectedPayment) => {
        const newBooking = { ...bookingDetails, paymentMethod: selectedPayment };
        setBookingDetails(newBooking);
        const withBookID = addBooking(newBooking);
        showReceipt(withBookID);
    };

    const handleNext = (e) => {
        e.preventDefault();

        if (!bookingDetails.venue || !bookingDetails.municipality || bookingDetails.deliveryFee === 0) {
            setTimeError("❌ Please pin a valid location within Cavite before proceeding.");
            setTimeout(() => setTimeError(""), 5000);
            return;
        }

        const alertMessage = timeRestriction(bookingDetails, timeFormat);
        
        // Dito ay 100% accurate na ang bookingDetails.rentalFee mula sa ating initial state
        const totals = calculatingTotal(bookingDetails.deliveryFee, bookingDetails.rentalFee);

        if (alertMessage) {
            setTimeError(alertMessage);
            setTimeout(() => setTimeError(""), 5000);
            return;
        }
        
        setBookingDetails(prev => ({
            ...prev, 
            ...totals,
            downpayment: Downpayment,
            remainingBalance: totals.total - Downpayment,
        }));
        setStep(2);
    };

    const handleBack = () => setStep(1);
    const handleToPayment = () => setStep(3);

    return (
        <>
            {!showTerms && (
                <div
                    style={{ position: 'fixed', inset: 0, zIndex: 1055 }}
                    className="flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                >
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.25 }}
                        className="w-full max-w-md"
                        style={{ maxHeight: '100vh', minHeight: '70vh', display: 'flex', flexDirection: 'column' }}
                    >
                        <div
                            className="bg-white rounded-xl shadow-2xl font-bold text-[#1e1e1e] w-full"
                            style={{ display: 'flex', flexDirection: 'column', minHeight: 0, maxHeight: '100vh' }}
                        >
                            {/* modal-header */}
                            <div className={`flex justify-between items-center py-4 px-3 rounded-t-xl shrink-0 ${theme.bg}`}>
                                <h5 className={`text-sm font-semibold mb-0 ${serviceName !== "Golden Hour" ? "text-white" : "text-black"}`}>
                                    Booking Reservation Form ({serviceName})
                                </h5>
                                {step === 1 && (
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className={`${theme.closeBtn} hover:opacity-70 transition-opacity`}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>

                            <div
                                ref={scrollContainerRef}
                                className="hide-scrollbar p-3"
                                style={{
                                    flex: 1,
                                    minHeight: 0,
                                }}
                            >
                                {step === 1 && (
                                    <InputsModal
                                        bookingDetails={bookingDetails}
                                        timeError={timeError}
                                        selectedDate={selectedDate}
                                        handleChange={handleChange}
                                        handleNext={handleNext}
                                        serviceConfig={config}
                                        handleBackOptions={handleBackOptions}
                                        onLocationSelect={handleLocationSelect}
                                    />
                                )}
                                {step === 2 && (
                                    <BookingSummaryModal
                                        bookingDetails={bookingDetails}
                                        setBookingDetails={setBookingDetails}
                                        handleBack={handleBack}
                                        isTermsAccepted={isTermsAccepted}
                                        setTermsAccepted={setIsTermsAccepted}
                                        setShowTerms={setShowTerms}
                                        onNext={handleToPayment}
                                    />
                                )}
                                {step === 3 && (
                                    <PaymentModal
                                        bookingDetails={bookingDetails}
                                        serviceConfig={config}
                                        onConfirm={onConfirm}
                                    />
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
            {showTerms && <TermsModal setShowTerms={setShowTerms} />}
        </>
    );
};