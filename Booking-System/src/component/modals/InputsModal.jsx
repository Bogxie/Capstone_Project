import { useState, useEffect } from "react";
import { timeOptions } from "../../assets/utils/timeOptions.jsx";
import { LocationPickerMap } from "../Locationpickermap.jsx";
import { fetchDeliveryOptions } from "../../assets/utils/deliveryOptions.js";

const themeMap = {
    "header-golden": { bg: "bg-amber-500", text: "text-black" },
    "header-snoop": { bg: "bg-orange-600", text: "text-white" },
    "header-projector": { bg: "bg-cyan-500", text: "text-white" },
};

export const InputsModal = ({
    bookingDetails,
    timeError,
    selectedDate,
    handleChange,
    handleNext,
    serviceConfig,
    handleBackOptions,
    onLocationSelect,
}) => {
    const locationSelected = !!(bookingDetails.venue && bookingDetails.lat);
    const theme = themeMap[serviceConfig.theme.color] ?? { bg: "bg-lime-500", text: "text-black" };
    const [showMap, setShowMap] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [deliveryOptionsLoaded, setDeliveryOptionsLoaded] = useState(false);

    useEffect(() => {
        const loadOptions = async () => {
            await fetchDeliveryOptions(true);
            setDeliveryOptionsLoaded(true);
        };
        loadOptions();
    }, []);

    const handleTypeChange = (e) => {
        const selectedValue = e.target.value;

        const selectedOption = serviceConfig.options.find(opt => opt.value === selectedValue);
        const pkg = serviceConfig.packages.find(pkg => pkg.name === selectedOption?.label);

        const parsedPrice = pkg
            ? Number(pkg.price.replace(/[₱,]/g, ""))
            : 0;

        setSelectedPackage(pkg || null);

        handleChange({ target: { name: "type", value: selectedValue } });
        handleChange({ target: { name: "packageName", value: pkg?.name || "" } });
        handleChange({ target: { name: "rentalFee", value: parsedPrice } });
    };

    const handleLocationSelect = (locationData) => {
        const isCavite = locationData.isInsideCavite || 
                         locationData.municipality || 
                         (locationData.venue && locationData.venue.toLowerCase().includes('cavite'));
        
        if (!isCavite) {
            alert('📍 Service area is Cavite only. Please select a location within Cavite.');
            return;
        }
        
        onLocationSelect(locationData);
    };

    if (!deliveryOptionsLoaded) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="text-center">
                    <div className="h-8 w-8 border-4 border-lime-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-sm text-white">Loading delivery options...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full max-h-[calc(90vh-100px)]">
            <div className="flex-shrink-0 space-y-3 pb-3">
                <h6 className="text-center font-bold text-lime-400 tracking-wide mb-0 text-xs uppercase">
                    STEP 1 OF 3 - BOOKING DETAILS
                </h6>
                <div className={`text-center py-2.5 rounded-md font-medium ${theme.bg} ${theme.text}`}>
                    📅 Selected Date:{" "}
                    <span className="font-bold">
                        {selectedDate.month} {selectedDate.date}, {selectedDate.year}
                    </span>
                </div>
            </div>

            <form
                onSubmit={handleNext}
                className="flex-1 min-h-0 overflow-y-auto space-y-4 p-1 hide-scrollbar"
                style={{ touchAction: 'pan-y' }}
            >
                {/* Full Name */}
                <div className="flex flex-col">
                    <label className="text-sm font-semibold text-white">👤 Full Name</label>
                    <input
                        name="fullName"
                        type="text"
                        placeholder="Enter your full name"
                        value={bookingDetails.fullName}
                        onChange={handleChange}
                        required
                        className="w-full mt-1 px-3 py-2 text-sm bg-zinc-800 border border-zinc-700 rounded-md text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-lime-500"
                    />
                </div>

                {/* Email + Phone */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-white">📧 Email</label>
                        <input
                            name="email"
                            type="email"
                            placeholder="email@example.com"
                            value={bookingDetails.email}
                            onChange={handleChange}
                            required
                            className="w-full mt-1 px-3 py-2 text-sm bg-zinc-800 border border-zinc-700 rounded-md text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-lime-500"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-white">📞 Phone</label>
                        <input
                            name="phoneNum"
                            type="tel"
                            maxLength={11}
                            placeholder="09XXXXXXXXX"
                            value={bookingDetails.phoneNum}
                            onChange={handleChange}
                            required
                            className="w-full mt-1 px-3 py-2 text-sm bg-zinc-800 border border-zinc-700 rounded-md text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-lime-500"
                        />
                    </div>
                </div>

                {/* Time */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-white">⏰ Start Time</label>
                        <div className="flex gap-1 mt-1">
                            <select name="timeStart" value={bookingDetails.timeStart} onChange={handleChange} required className="flex-1 px-2 py-2 text-sm bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-lime-500">
                                <option value="" disabled>Time</option>
                                {timeOptions()}
                            </select>
                            <select name="timeStartAmPm" value={bookingDetails.timeStartAmPm} onChange={handleChange} className="px-1 py-2 text-sm bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-lime-500">
                                <option value="AM">AM</option>
                                <option value="PM">PM</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-white">⏰ End Time</label>
                        <div className="flex gap-1 mt-1">
                            <select name="timeEnd" value={bookingDetails.timeEnd} onChange={handleChange} required className="flex-1 px-2 py-2 text-sm bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-lime-500">
                                <option value="" disabled>Time</option>
                                {timeOptions()}
                            </select>
                            <select name="timeEndAmPm" value={bookingDetails.timeEndAmPm} onChange={handleChange} className="px-1 py-2 text-sm bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-lime-500">
                                <option value="AM">AM</option>
                                <option value="PM">PM</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Event Type */}
                <div className="flex flex-col">
                    <label className="text-sm font-semibold text-white">📄 {serviceConfig.label}</label>
                    <select name="type" value={bookingDetails.type} onChange={handleTypeChange} required className="w-full mt-1 px-3 py-2 text-sm bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-lime-500">
                        <option value="" disabled>Select {serviceConfig.label}</option>
                        {serviceConfig.options.map((opt, i) => (
                            <option key={i} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>

                {selectedPackage && (
                    <div className={`mt-2 flex justify-between items-start px-3 py-2 rounded-lg border ${theme.bg} ${theme.text}`}>
                        <div>
                            <p className="text-xs font-bold">📦 {selectedPackage.name}</p>
                            <p className="text-xs opacity-75 mt-0.5">{selectedPackage.details}</p>
                        </div>
                        <span className="text-sm font-bold ml-3 whitespace-nowrap">
                            {selectedPackage.price}
                        </span>
                    </div>
                )}

                {/* Description */}
                <div className="flex flex-col">
                    <label className="text-sm font-semibold text-white">📝 Event Description</label>
                    <input
                        name="description"
                        type="text"
                        placeholder="Description of Event"
                        value={bookingDetails.description}
                        onChange={handleChange}
                        required
                        className="w-full mt-1 px-3 py-2 text-sm bg-zinc-800 border border-zinc-700 rounded-md text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-lime-500"
                    />
                </div>

                {/* Venue / Map */}
                <div className="flex flex-col">
                    <div className="flex justify-between items-center mb-1">
                        <label className="text-sm font-semibold text-white">🗺️ Pin Exact Venue</label>
                        <button
                            type="button"
                            onClick={() => setShowMap(prev => !prev)}
                            className={`text-xs font-semibold px-3 py-1 rounded-full border transition-colors ${showMap
                                ? "bg-zinc-700 border-zinc-600 text-white hover:bg-zinc-600"
                                : "bg-lime-500 border-lime-500 text-black hover:bg-lime-400"
                                }`}
                        >
                            {showMap ? "Hide Map ▲" : "Open Map ▼"}
                        </button>
                    </div>

                    {!showMap && (
                        <p className="text-xs text-zinc-400">
                            Pin your exact location — delivery fee will be auto-detected based on your municipality.
                        </p>
                    )}

                    {showMap && (
                        <>
                            <div className="mt-1 rounded-md border border-zinc-700 shadow-sm">
                                <LocationPickerMap
                                    onLocationSelect={handleLocationSelect}
                                    initialVenue={bookingDetails.venue}
                                    initialLat={bookingDetails.lat}
                                    initialLng={bookingDetails.lng}
                                />
                            </div>
                        </>
                    )}

                    <input
                        type="text"
                        name="venue"
                        value={bookingDetails.venue || ""}
                        onChange={() => {}}
                        required
                        tabIndex={-1}
                        aria-hidden="true"
                        style={{ opacity: 0, height: 0, padding: 0, border: 0, display: 'block' }}
                    />

                    {bookingDetails.municipality && (
                        <div className="mt-1.5 flex items-center gap-2 text-xs text-lime-400 bg-lime-500/10 border border-lime-500/20 rounded-md px-2 py-1.5">
                            ✅ <span><strong>{bookingDetails.municipality}</strong> — Delivery Fee: <strong>₱{bookingDetails.deliveryFee}</strong></span>
                        </div>
                    )}

                    {!locationSelected && (
                        <div className="mt-1.5 flex items-center gap-2 p-2 text-xs bg-lime-500/10 text-lime-400 rounded-md border border-lime-500/20">
                            📌 {showMap
                                ? "Click or search the map to pin your exact venue."
                                : "Please open the map and pin your exact venue location."
                            }
                        </div>
                    )}

                    {locationSelected && (
                        <div className="mt-1.5 flex items-center gap-2 p-2 text-xs bg-lime-500/10 text-lime-400 rounded-md border border-lime-500/20">
                            ✅ Venue pinned successfully!
                        </div>
                    )}
                </div>

                {timeError && (
                    <div className="flex items-center gap-2 p-2.5 text-sm bg-red-500/10 text-red-400 rounded-md border border-red-500/20">
                        ⚠️ {timeError}
                    </div>
                )}

                {/* Buttons */}
                <div className="flex gap-3 pt-3 border-t border-zinc-800">
                    <button
                        type="button"
                        onClick={handleBackOptions}
                        className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-2 rounded-md border border-zinc-700 transition-colors"
                    >
                        Back
                    </button>
                    <button
                        type="submit"
                        disabled={!locationSelected}
                        className={`w-full py-2 rounded-md font-medium shadow-sm transition-all
                            ${!locationSelected
                                ? "bg-zinc-700 text-zinc-500 cursor-not-allowed"
                                : `${theme.bg} ${theme.text} hover:brightness-110`
                            }`}
                    >
                        Next Step
                    </button>
                </div>
            </form>
        </div>
    );
};