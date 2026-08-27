// component/modals/EditModal.jsx
import { useState, useCallback, useEffect } from "react";
import { timeFormat, timeOptions } from "../../assets/utils/timeOptions.jsx";
import { timeRestriction } from '../../assets/utils/timeRestriction.js'
import { LocationPickerMap } from "../Locationpickermap.jsx";
import { getDeliveryFee, fetchDeliveryOptions, getDeliveryOptions } from "../../assets/utils/deliveryOptions.js";
import { BookingSuccess } from "../BookingSuccess.jsx";

export const EditModal = ({ booking, onClose, handleEdit }) => {
    const [timeError, setTimeError] = useState("");
    const [bookingDetails, setBookingDetails] = useState({ ...booking });
    const [showMap, setShowMap] = useState(!!booking.venue);
    const [deliveryOptionsLoaded, setDeliveryOptionsLoaded] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [updatedBooking, setUpdatedBooking] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const loadDeliveryOptions = async () => {
            await fetchDeliveryOptions();
            setDeliveryOptionsLoaded(true);
        };
        loadDeliveryOptions();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBookingDetails((prev) => ({ ...prev, [name]: value }));
    };

    const handleLocationSelect = useCallback((locationData) => {
        console.log('📍 Location data received:', locationData);

        const { venue, lat, lng, municipality, isInsideCavite } = locationData || {};

        if (!isInsideCavite) {
            console.log('❌ NOT in Cavite!');
            setTimeError("⚠️ Service area is Cavite only. Please select a location within Cavite.");
            setTimeout(() => setTimeError(""), 5000);
            return;
        }

        console.log('✅ IN Cavite!');

        let detectedMunicipality = municipality;

        if (!detectedMunicipality && venue) {
            const venueLower = venue.toLowerCase();
            const options = getDeliveryOptions();

            for (const opt of options) {
                if (venueLower.includes(opt.municipality.toLowerCase())) {
                    detectedMunicipality = opt.municipality;
                    break;
                }
            }
        }

        const fee = detectedMunicipality ? getDeliveryFee(detectedMunicipality) : 0;

        setBookingDetails((prev) => ({
            ...prev,
            venue: venue || prev.venue,
            lat: lat || prev.lat,
            lng: lng || prev.lng,
            municipality: detectedMunicipality || prev.municipality,
            deliveryFee: fee !== null ? fee : prev.deliveryFee,
        }));

        setTimeError("");
    }, []);

    const hasValidLocation = !!bookingDetails.venue;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!deliveryOptionsLoaded) {
            setTimeError("Please wait, loading delivery options...");
            setTimeout(() => setTimeError(""), 3000);
            setIsSubmitting(false);
            return;
        }

        const alertMessage = timeRestriction(bookingDetails, timeFormat);

        if (alertMessage) {
            setTimeError(alertMessage);
            setTimeout(() => setTimeError(""), 5000);
            setIsSubmitting(false);
            return;
        }
        if (!hasValidLocation) {
            setTimeError("Please select a valid location on the map.");
            setTimeout(() => setTimeError(""), 5000);
            setIsSubmitting(false);
            return;
        }

        try {
            // ✅ FIX: handleEdit now has token
            const result = await handleEdit(bookingDetails);
            console.log('🔍 RESULT FROM handleEdit:', result);
            console.log('🔍 booking_id:', result?.booking_id);
            console.log('🔍 display_id:', result?.display_id);
            setUpdatedBooking(result || bookingDetails);
            setShowSuccess(true);
        } catch (error) {
            console.error('Error updating booking:', error);
            setTimeError("Failed to update booking. Please try again.");
            setTimeout(() => setTimeError(""), 5000);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSuccessClose = () => {
        setShowSuccess(false);
        onClose();
    };

    const inputClass = "w-full border border-zinc-700 bg-zinc-800 px-3 py-2 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500";
    const labelClass = "block text-xs font-semibold text-white mb-0.5";

    const displayId = booking.display_id || booking.bookID || `BK-${String(booking.booking_id).padStart(6, '0')}`;
    const fullName = bookingDetails.fullName || bookingDetails.full_name || '';
    const email = bookingDetails.email || '';
    const phoneNum = bookingDetails.phoneNum || bookingDetails.phone_num || '';
    const description = bookingDetails.description || '';

    const total = parseFloat(bookingDetails.total) || 0;
    const downpayment = parseFloat(bookingDetails.downpayment) || 1000;
    const remainingBalance = total - downpayment;

    return (
        <>
            <div className="fixed inset-0 z-[1050] flex items-center justify-center bg-zinc-950/90 backdrop-blur-sm">
                <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl flex flex-col max-h-[90vh]">

                    <div className="flex justify-between items-center px-4 py-3 border-b border-zinc-800 shrink-0">
                        <h5 className="font-bold text-sm text-white">✏️ Edit Booking <span className="text-lime-400">#{displayId}</span></h5>
                        <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-4 space-y-3 overflow-y-auto hide-scrollbar flex-1">

                        <div className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-400 space-y-1">
                            <div><span className="font-semibold text-zinc-300">📅 Date:</span> <span className="text-white">{booking.month} {booking.date || booking.day}, {booking.year}</span></div>
                            <div><span className="font-semibold text-zinc-300">🎯 Service:</span> <span className="text-white">{booking.service}</span></div>
                            <div><span className="font-semibold text-zinc-300">📦 Type:</span> <span className="text-white">{booking.type}</span></div>
                            <div><span className="font-semibold text-zinc-300">⚡ Status:</span> <span className="text-white">{booking.status}</span></div>
                        </div>

                        <div className="bg-lime-500/10 border border-lime-500/20 rounded-lg px-3 py-2 text-xs">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-white">💰 Remaining Balance:</span>
                                <span className={`font-bold ${remainingBalance > 0 ? 'text-lime-400' : 'text-green-400'}`}>
                                    ₱{remainingBalance.toFixed(2)}
                                </span>
                            </div>
                            <div className="flex justify-between text-zinc-400 mt-1 pt-1 border-t border-lime-500/20">
                                <span>Total: ₱{total.toFixed(2)}</span>
                                <span>Downpayment: ₱{downpayment.toFixed(2)}</span>
                            </div>
                        </div>

                        <div>
                            <label className={labelClass}>👤 Full Name</label>
                            <input
                                name="fullName"
                                value={fullName}
                                onChange={handleChange}
                                className={inputClass}
                                placeholder="Full Name"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className={labelClass}>📧 Email</label>
                                <input
                                    name="email"
                                    value={email}
                                    onChange={handleChange}
                                    className={inputClass}
                                    placeholder="Email"
                                    required
                                />
                            </div>
                            <div>
                                <label className={labelClass}>📞 Phone</label>
                                <input
                                    name="phoneNum"
                                    value={phoneNum}
                                    onChange={handleChange}
                                    className={inputClass}
                                    placeholder="09XXXXXXXXX"
                                    maxLength={11}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className={labelClass}>⏰ Start Time</label>
                                <div className="flex gap-1">
                                    <select
                                        name="timeStart"
                                        value={bookingDetails.timeStart || ""}
                                        onChange={handleChange}
                                        className={`${inputClass} flex-1`}
                                        required
                                    >
                                        <option value="">Select Time</option>
                                        {timeOptions()}
                                    </select>
                                    <select
                                        name="timeStartAmPm"
                                        value={bookingDetails.timeStartAmPm || "AM"}
                                        onChange={handleChange}
                                        className="border border-zinc-700 bg-zinc-800 px-1 py-2 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-lime-500"
                                    >
                                        <option value="AM">AM</option>
                                        <option value="PM">PM</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>⏰ End Time</label>
                                <div className="flex gap-1">
                                    <select
                                        name="timeEnd"
                                        value={bookingDetails.timeEnd || ""}
                                        onChange={handleChange}
                                        className={`${inputClass} flex-1`}
                                        required
                                    >
                                        <option value="">Select Time</option>
                                        {timeOptions()}
                                    </select>
                                    <select
                                        name="timeEndAmPm"
                                        value={bookingDetails.timeEndAmPm || "PM"}
                                        onChange={handleChange}
                                        className="border border-zinc-700 bg-zinc-800 px-1 py-2 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-lime-500"
                                    >
                                        <option value="AM">AM</option>
                                        <option value="PM">PM</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className={labelClass}>📝 Event Description</label>
                            <input
                                name="description"
                                value={description}
                                onChange={handleChange}
                                className={inputClass}
                                placeholder="Event Description"
                                required
                            />
                        </div>

                        <div className="border border-zinc-700 rounded-lg p-3">
                            <div className="flex justify-between items-center mb-2">
                                <p className="text-xs font-semibold text-white">🗺️ Venue Location</p>
                                <button
                                    type="button"
                                    onClick={() => setShowMap((p) => !p)}
                                    className={`text-xs font-semibold px-3 py-1 rounded-full border transition-colors ${
                                        showMap
                                            ? "bg-zinc-700 border-zinc-600 text-white"
                                            : "bg-lime-500 border-lime-500 text-black hover:bg-lime-400"
                                    }`}
                                >
                                    {showMap ? "Hide Map ▲" : "Edit Location ▼"}
                                </button>
                            </div>

                            {!showMap && bookingDetails.venue && (
                                <p className="text-xs text-zinc-400 bg-zinc-800 border border-zinc-700 rounded-md p-2 truncate">
                                    📍 {bookingDetails.venue}
                                </p>
                            )}

                            {showMap && (
                                <div className="mt-1 rounded-md border border-zinc-700 shadow-sm overflow-hidden">
                                    <LocationPickerMap
                                        onLocationSelect={handleLocationSelect}
                                        initialVenue={bookingDetails.venue || booking.venue}
                                        initialLat={booking.lat}
                                        initialLng={booking.lng}
                                    />
                                </div>
                            )}

                            <input
                                type="text"
                                name="venue"
                                value={bookingDetails.venue || ""}
                                readOnly
                                required
                                tabIndex={-1}
                                aria-hidden="true"
                                style={{ opacity: 0, height: 0, padding: 0, border: 0, display: 'block' }}
                            />

                            {bookingDetails.venue && bookingDetails.municipality && (
                                <div className="mt-2 flex items-center gap-2 text-xs text-lime-400 bg-lime-500/10 border border-lime-500/20 rounded-md px-2 py-1.5">
                                    ✨ <span>Detected: <strong>{bookingDetails.municipality}</strong> — Delivery Fee: <strong>₱{bookingDetails.deliveryFee}</strong></span>
                                </div>
                            )}
                        </div>

                        {timeError && (
                            <div className="flex items-center gap-2 p-2.5 text-sm bg-red-500/10 text-red-400 rounded-md border border-red-500/20">
                                ⚠️ {timeError}
                            </div>
                        )}

                        <div className="flex gap-2 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 border border-zinc-700 bg-zinc-800 py-2 rounded-lg text-sm text-white hover:bg-zinc-700 transition-colors"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={!hasValidLocation || !deliveryOptionsLoaded || isSubmitting}
                                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                                    !hasValidLocation || !deliveryOptionsLoaded || isSubmitting 
                                        ? 'bg-zinc-700 text-zinc-500 cursor-not-allowed' 
                                        : 'bg-lime-500 text-black hover:bg-lime-400'
                                }`}
                            >
                                {isSubmitting ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {showSuccess && (
                <BookingSuccess
                    bookingDetails={updatedBooking}
                    onClose={handleSuccessClose}
                    isEdit={true}
                />
            )}
        </>
    );
};