import { useState, useEffect, useRef } from "react";
import { motion } from 'framer-motion';
import { useAuth } from "../../context/useAuth.js";
import { useBooking } from "../../context/useBooking.js";
import { InputsModal } from "./InputsModal.jsx";
import { BookingSummaryModal } from "./BookingSummary.jsx";
import { PaymentModal } from './PaymentModal.jsx';
import { getDeliveryFee } from '../../assets/utils/deliveryOptions.js';
import { timeFormat } from "../../assets/Utils/tImeOptions.jsx";
import { timeRestriction } from "../../assets/Utils/TimeRestriction.js";
import { calculatingTotal } from "../../assets/Utils/calculatingTotal.js";
import { TermsModal } from "./TermsModal.jsx";
import { service_config } from "../../assets/Utils/ServiceConfig.js";
import axios from "axios";
import '../../assets/css/BookingModal.css';

const Downpayment = 1000;

const headerTheme = {
    "Golden Hour": { 
        bg: "bg-amber-500", 
        closeBtn: "text-black hover:text-black/70", 
        text: "text-black" 
    },
    "Snoop Dough": { 
        bg: "bg-orange-600", 
        closeBtn: "text-white hover:text-white/70", 
        text: "text-white" 
    },
    "Rental Projector": { 
        bg: "bg-cyan-500", 
        closeBtn: "text-white hover:text-white/70", 
        text: "text-white" 
    },
};

export const BookingModal = ({
    selectedDate, onClose, showReceipt, serviceName, handleBackOptions, serviceConfig = {}
}) => {

    const config = serviceConfig[serviceName] || service_config[serviceName];
    const theme = headerTheme[serviceName] ?? { bg: "bg-lime-500", closeBtn: "text-black hover:text-black/70", text: "text-black" };
    const { currentUser } = useAuth();
    const { addBooking, refreshBookings } = useBooking();
    const [step, setStep] = useState(1);
    const [showTerms, setShowTerms] = useState(false);
    const [isTermsAccepted, setIsTermsAccepted] = useState(false);
    const [timeError, setTimeError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const scrollContainerRef = useRef(null);

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
            packageName: "",
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

    const onConfirm = async (selectedPayment) => {
        if (isSubmitting) {
            console.log('⏳ Booking already in progress...');
            return;
        }

        setIsSubmitting(true);
        console.log('🔄 Creating booking with payment:', selectedPayment);

        const bookingData = {
            fullName: bookingDetails.fullName,
            email: bookingDetails.email,
            phoneNum: bookingDetails.phoneNum,
            service: bookingDetails.service,
            serviceType: bookingDetails.type,
            packageName: bookingDetails.packageName || '',
            rentalFee: bookingDetails.rentalFee,
            municipality: bookingDetails.municipality,
            deliveryFee: bookingDetails.deliveryFee,
            venue: bookingDetails.venue,
            lat: bookingDetails.lat,
            lng: bookingDetails.lng,
            description: bookingDetails.description,
            paymentMethod: selectedPayment,
            downpayment: bookingDetails.downpayment,
            timeStart: bookingDetails.timeStart,
            timeStartAmPm: bookingDetails.timeStartAmPm,
            timeEnd: bookingDetails.timeEnd,
            timeEndAmPm: bookingDetails.timeEndAmPm,
            month: bookingDetails.month,
            date: bookingDetails.date,
            year: bookingDetails.year,
            user_id: currentUser?.user_id || null
        };

        try {
            const token = localStorage.getItem('token');
            
            const response = await axios.post(
                'http://localhost:3001/api/bookings',
                bookingData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.data.success) {
                const newBooking = {
                    ...bookingData,
                    booking_id: response.data.bookingId,
                    display_id: response.data.displayId,
                    total: response.data.total,
                    subtotal: response.data.subtotal,
                    tax: response.data.tax,
                    status: 'Pending'
                };

                await addBooking(newBooking);
                await refreshBookings();
                
                // ✅ ✅ ✅ ITO ANG KULANG! - Clear temp booking
                const socket = window.socket;
                if (socket) {
                    const dateKey = `${bookingDetails.year}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(bookingDetails.date).padStart(2, '0')}`;
                    
                    // ✅ Send booking-confirmed to clear temp booking
                    socket.emit('booking-confirmed', {
                        date: dateKey,
                        service: bookingDetails.service,
                        userId: currentUser?.user_id || null
                    });
                }
                
                showReceipt(newBooking);
            }
        } catch (err) {
            console.error('❌ Error creating booking:', err);
            if (err.response?.status === 409) {
                alert(err.response.data.error || 'This slot is already booked. Please choose another time or date.');
            } else {
                alert('Failed to create booking. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleNext = (e) => {
        e.preventDefault();

        if (!bookingDetails.venue || !bookingDetails.municipality || bookingDetails.deliveryFee === 0) {
            setTimeError("❌ Please pin a valid location within Cavite before proceeding.");
            setTimeout(() => setTimeError(""), 5000);
            return;
        }

        const alertMessage = timeRestriction(bookingDetails, timeFormat);
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
                    className="flex items-center justify-center bg-zinc-950/90 backdrop-blur-sm p-4"
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
                            className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl text-white w-full"
                            style={{ display: 'flex', flexDirection: 'column', minHeight: 0, maxHeight: '100vh' }}
                        >
                            <div className={`flex justify-between items-center py-3 px-4 rounded-t-xl shrink-0 ${theme.bg}`}>
                                <h5 className={`text-sm font-bold tracking-wide uppercase mb-0 ${theme.text}`}>
                                    {serviceName} Booking
                                </h5>
                                {step === 1 && (
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className={`${theme.closeBtn} focus:outline-none transition-colors`}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>

                            <div
                                ref={scrollContainerRef}
                                className="hide-scrollbar p-4"
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
                                        isSubmitting={isSubmitting}
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