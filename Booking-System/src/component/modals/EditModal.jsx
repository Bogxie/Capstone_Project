import { useState, useCallback } from "react";
import { timeFormat, timeOptions } from "../../assets/utils/timeOptions.jsx";
import { timeRestriction } from '../../assets/utils/timeRestriction.js'
import { LocationPickerMap } from "../Locationpickermap.jsx";
import { deliveryOption } from "../../assets/utils/deliveryOptions.js";

const getDeliveryFee = (municipality) => {
    const match = deliveryOption.find((d) => d.municipality === municipality);
    return match ? match.fee : null;
};

const isValidMunicipality = (municipality) => {
    return deliveryOption.some((d) => d.municipality === municipality);
};

export const EditModal = ({ booking, onClose, handleEdit }) => {
    const [timeError, setTimeError] = useState("");
    const [bookingDetails, setBookingDetails] = useState({ ...booking });
    
    // Ginawang true kung may initial venue na para mag-initialize agad ang map at pin
    const [showMap, setShowMap] = useState(!!booking.venue); 

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBookingDetails((prev) => ({ ...prev, [name]: value }));
    };

    // FIX 1: Gumamit ng useCallback para hindi muling malikha ang function na ito tuwing nagta-type sa ibang inputs
    const handleLocationSelect = useCallback(({ venue, lat, lng, municipality }) => {
        if (!isValidMunicipality(municipality)) {
            setBookingDetails((prev) => ({
                ...prev,
                venue: "", lat: null, lng: null,
                municipality: "", deliveryFee: 0,
            }));
            setTimeError("Service area is Cavite only.");
            setTimeout(() => setTimeError(""), 4000);
            return;
        }
        const fee = getDeliveryFee(municipality);
        setBookingDetails((prev) => ({
            ...prev, venue, lat, lng,
            municipality, deliveryFee: fee ?? 0,
        }));
    }, []); // Empty dependency array para manatili ang reference nito

    const hasValidLocation = !!bookingDetails.venue;

    const handleSubmit = (e) => {
        e.preventDefault();
        const alertMessage = timeRestriction(bookingDetails, timeFormat);

        if (alertMessage) {
            setTimeError(alertMessage);
            setTimeout(() => setTimeError(""), 5000);
            return;
        }
        if (!hasValidLocation) {
            setTimeError("Please select a valid location on the map.");
            setTimeout(() => setTimeError(""), 5000);
            return;
        }
        handleEdit(bookingDetails);
    };

    const inputClass = "w-full border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
    const labelClass = "block text-xs font-semibold text-gray-600 mb-0.5";

    return (
        <div className="fixed inset-0 z-[1050] flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex justify-between items-center px-4 py-3 border-b shrink-0">
                    <h5 className="font-bold text-sm">✏️ Edit Booking <span className="text-blue-600">#{bookingDetails.bookID}</span></h5>
                    <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-4 space-y-3 overflow-y-auto hide-scrollbar flex-1">

                    {/* Booking Info — read only */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-500 space-y-1">
                        <div><span className="font-semibold text-gray-700">📅 Date:</span> {booking.month} {booking.date}, {booking.year}</div>
                        <div><span className="font-semibold text-gray-700">🎯 Service:</span> {booking.service}</div>
                        <div><span className="font-semibold text-gray-700">📦 Type:</span> {booking.type}</div>
                        <div><span className="font-semibold text-gray-700">⚡ Status:</span> {booking.status}</div>
                    </div>

                    {/* Full Name */}
                    <div>
                        <label className={labelClass}>👤 Full Name</label>
                        <input name="fullName" value={bookingDetails.fullName || ""} onChange={handleChange} className={inputClass} placeholder="Full Name" required />
                    </div>

                    {/* Email + Phone */}
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className={labelClass}>📧 Email</label>
                            <input name="email" value={bookingDetails.email || ""} onChange={handleChange} className={inputClass} placeholder="Email" required />
                        </div>
                        <div>
                            <label className={labelClass}>📞 Phone</label>
                            <input name="phoneNum" value={bookingDetails.phoneNum || ""} onChange={handleChange} className={inputClass} placeholder="09XXXXXXXXX" maxLength={11} required />
                        </div>
                    </div>

                    {/* Time */}
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className={labelClass}>⏰ Start Time</label>
                            <div className="flex gap-1">
                                <select name="timeStart" value={bookingDetails.timeStart || ""} onChange={handleChange} className={`${inputClass} flex-1`} required>
                                    <option value="">Time</option>
                                    {timeOptions()}
                                </select>
                                <select name="timeStartAmPm" value={bookingDetails.timeStartAmPm || "AM"} onChange={handleChange} className="border border-gray-300 px-1 py-2 rounded-lg text-sm focus:outline-none">
                                    <option value="AM">AM</option>
                                    <option value="PM">PM</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className={labelClass}>⏰ End Time</label>
                            <div className="flex gap-1">
                                <select name="timeEnd" value={bookingDetails.timeEnd || ""} onChange={handleChange} className={`${inputClass} flex-1`} required>
                                    <option value="">Time</option>
                                    {timeOptions()}
                                </select>
                                <select name="timeEndAmPm" value={bookingDetails.timeEndAmPm || "PM"} onChange={handleChange} className="border border-gray-300 px-1 py-2 rounded-lg text-sm focus:outline-none">
                                    <option value="AM">AM</option>
                                    <option value="PM">PM</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className={labelClass}>📝 Event Description</label>
                        <input name="description" value={bookingDetails.description || ""} onChange={handleChange} className={inputClass} placeholder="Event Description" required />
                    </div>

                    {/* Map & Auto-Detected Location */}
                    <div className="border border-gray-200 rounded-lg p-3">
                        <div className="flex justify-between items-center mb-2">
                            <p className="text-xs font-semibold text-gray-700">🗺️ Venue Location</p>
                            <button
                                type="button"
                                onClick={() => setShowMap((p) => !p)}
                                className={`text-xs font-semibold px-3 py-1 rounded-full border transition-colors ${
                                    showMap
                                        ? "bg-gray-200 border-gray-400 text-gray-700"
                                        : "bg-blue-500 border-blue-500 text-white hover:bg-blue-600"
                                }`}
                            >
                                {showMap ? "Hide Map ▲" : "Edit Location ▼"}
                            </button>
                        </div>

                        {!showMap && bookingDetails.venue && (
                            <p className="text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded-md p-2 truncate">
                                📍 {bookingDetails.venue}
                            </p>
                        )}

                        {showMap && (
                            <div className="mt-1 rounded-md border border-gray-300 shadow-sm overflow-hidden">
                                <LocationPickerMap
                                    onLocationSelect={handleLocationSelect}
                                    initialVenue={bookingDetails.venue}
                                    initialLat={booking.lat} // Pinalitan ng booking.lat (orihinal) imbes na bookingDetails.lat
                                    initialLng={booking.lng} // Pinalitan ng booking.lng (orihinal) imbes na bookingDetails.lng
                                />
                            </div>
                        )}

                        {/* FIX 2: Inalis ang onChange={() => {}} at ginawang readOnly para hindi mag-loko ang component tree render */}
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
                            <div className="mt-2 flex items-center gap-2 text-xs text-green-700 bg-green-50 border border-green-200 rounded-md px-2 py-1.5">
                                ✨ <span>Detected: <strong>{bookingDetails.municipality}</strong> — Delivery Fee: <strong>₱{bookingDetails.deliveryFee}</strong></span>
                            </div>
                        )}
                    </div>

                    {timeError && (
                        <div className="flex items-center gap-2 p-2.5 text-sm bg-red-100 text-red-700 rounded-md border border-red-200">
                            ⚠️ {timeError}
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-2 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 border border-gray-300 py-2 rounded-lg text-sm hover:bg-gray-100 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" disabled={!hasValidLocation} className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${!hasValidLocation ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};