import { useState } from "react";
import { timeOptions } from "../../assets/utils/tImeOptions.jsx";
import { LocationPickerMap } from "../Locationpickermap.jsx";

const themeMap = {
    "header-golden": { bg: "bg-[#F59E0B]", text: "text-black" },
    "header-snoop": { bg: "bg-[#92400E]", text: "text-white" },
    "header-projector": { bg: "bg-[#1E293B]", text: "text-white" },
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
    const theme = themeMap[serviceConfig.theme.color] ?? { bg: "bg-gray-700", text: "text-white" };
    const [showMap, setShowMap] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState(null);

    const handleTypeChange = (e) => {
        const selectedValue = e.target.value;

        const selectedOption = serviceConfig.options.find(opt => opt.value === selectedValue);
        const pkg = serviceConfig.packages.find(pkg => pkg.name === selectedOption?.label);

        const parsedPrice = pkg
            ? Number(pkg.price.replace(/[₱,]/g, ""))
            : 0;

        setSelectedPackage(pkg || null); // ← ito ang bago

        handleChange({ target: { name: "type", value: selectedValue } });
        handleChange({ target: { name: "rentalFee", value: parsedPrice } });
    };

    return (
        <div className="flex flex-col h-full max-h-[calc(90vh-100px)]">
            <div className="flex-shrink-0 space-y-3 pb-3">
                <h6 className="text-center font-bold text-gray-700 tracking-wide mb-0">
                    STEP 1 OF 3 - BOOKING DETAILS
                </h6>
                <div className={`text-center py-2.5 rounded-md font-medium ${theme.bg} ${theme.text}`}>
                    📅 Selected Date:{" "}
                    <span className="font-bold">
                        {selectedDate.month} {selectedDate.date}, {selectedDate.year}
                    </span>
                </div>
            </div>

            {/* Scrollable Form */}
            <form
                onSubmit={handleNext}
                className="flex-1 min-h-0 overflow-y-auto space-y-4 p-1  hide-scrollbar"
                style={{ touchAction: 'pan-y' }}
            >
                {/* Full Name */}
                <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-700">👤 Full Name</label>
                    <input
                        name="fullName"
                        type="text"
                        placeholder="Enter your full name"
                        value={bookingDetails.fullName}
                        onChange={handleChange}
                        required
                        className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Email + Phone */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700">📧 Email</label>
                        <input
                            name="email"
                            type="email"
                            placeholder="email@example.com"
                            value={bookingDetails.email}
                            onChange={handleChange}
                            required
                            className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700">📞 Phone</label>
                        <input
                            name="phoneNum"
                            type="tel"
                            maxLength={11}
                            placeholder="09XXXXXXXXX"
                            value={bookingDetails.phoneNum}
                            onChange={handleChange}
                            required
                            className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Time */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700">⏰ Start Time</label>
                        <div className="flex gap-1 mt-1">
                            <select name="timeStart" value={bookingDetails.timeStart} onChange={handleChange} required className="flex-1 px-2 py-2 text-sm border border-gray-300 rounded-md focus:outline-none">
                                <option value="" disabled>Time</option>
                                {timeOptions()}
                            </select>
                            <select name="timeStartAmPm" value={bookingDetails.timeStartAmPm} onChange={handleChange} className="px-1 py-2 text-sm border border-gray-300 rounded-md">
                                <option value="AM">AM</option>
                                <option value="PM">PM</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700">⏰ End Time</label>
                        <div className="flex gap-1 mt-1">
                            <select name="timeEnd" value={bookingDetails.timeEnd} onChange={handleChange} required className="flex-1 px-2 py-2 text-sm border border-gray-300 rounded-md focus:outline-none">
                                <option value="" disabled>Time</option>
                                {timeOptions()}
                            </select>
                            <select name="timeEndAmPm" value={bookingDetails.timeEndAmPm} onChange={handleChange} className="px-1 py-2 text-sm border border-gray-300 rounded-md">
                                <option value="AM">AM</option>
                                <option value="PM">PM</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Event Type */}
                <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-700">📄 {serviceConfig.label}</label>
                    <select name="type" value={bookingDetails.type} onChange={handleTypeChange} required className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none">
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
                    <label className="text-sm font-semibold text-gray-700">📝 Event Description</label>
                    <input
                        name="description"
                        type="text"
                        placeholder="Description of Event"
                        value={bookingDetails.description}
                        onChange={handleChange}
                        required
                        className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Venue / Map */}
                <div className="flex flex-col">
                    <div className="flex justify-between items-center mb-1">
                        <label className="text-sm font-semibold text-gray-700">🗺️ Pin Exact Venue</label>
                        <button
                            type="button"
                            onClick={() => setShowMap(prev => !prev)}
                            className={`text-xs font-semibold px-3 py-1 rounded-full border transition-colors ${showMap
                                ? "bg-gray-200 border-gray-400 text-gray-700 hover:bg-gray-300"
                                : "bg-blue-500 border-blue-500 text-white hover:bg-blue-600"
                                }`}
                        >
                            {showMap ? "Hide Map ▲" : "Open Map ▼"}
                        </button>
                    </div>

                    {!showMap && (
                        <p className="text-xs text-gray-500">
                            Pin your exact location — delivery fee will be auto-detected based on your municipality.
                        </p>
                    )}

                    {showMap && (
                        <>
                            <div className="mt-1 rounded-md border border-gray-300 shadow-sm">
                                <LocationPickerMap
                                    onLocationSelect={onLocationSelect}
                                    initialVenue={bookingDetails.venue}
                                />
                            </div>
                        </>
                    )}

                    {/* Hidden required input — always present para ma-validate ng browser */}
                    <input
                        type="text"
                        name="venue"
                        value={bookingDetails.venue}
                        onChange={() => { }}
                        required
                        tabIndex={-1}
                        aria-hidden="true"
                        style={{ opacity: 0, height: 0, padding: 0, border: 0, display: 'block' }}
                    />

                    {/* Detected municipality */}
                    {bookingDetails.municipality && (
                        <div className="mt-1.5 flex items-center gap-2 text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded-md px-2 py-1.5">
                            📍 <span><strong>{bookingDetails.municipality}</strong> — Delivery Fee: <strong>₱{bookingDetails.deliveryFee}</strong></span>
                        </div>
                    )}

                    {/* Warning — show kapag hindi pa naka-pin */}
                    {!locationSelected && (
                        <div className="mt-1.5 flex items-center gap-2 p-2 text-xs bg-amber-50 text-amber-800 rounded-md border border-amber-200">
                            📌 {showMap
                                ? "Click or search the map to pin your exact venue."
                                : "Please open the map and pin your exact venue location."
                            }
                        </div>
                    )}

                    {/* Success — show kapag naka-pin na */}
                    {locationSelected && (
                        <div className="mt-1.5 flex items-center gap-2 p-2 text-xs bg-green-50 text-green-700 rounded-md border border-green-200">
                            ✅ Venue pinned successfully!
                        </div>
                    )}
                </div>



                {/* Time Error */}
                {timeError && (
                    <div className="flex items-center gap-2 p-2.5 text-sm bg-red-100 text-red-700 rounded-md border border-red-200">
                        ⚠️ {timeError}
                    </div>
                )}

                {/* Buttons */}
                <div className="flex gap-3 pt-3 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={handleBackOptions}
                        className="w-full bg-red hover:bg-red-200 text-gray-700 font-medium py-2 rounded-md border border-gray-300 transition-colors"
                    >
                        Back
                    </button>
                    <button
                        type="submit"
                        disabled={!locationSelected}
                        className={`w-full py-2 rounded-md font-medium shadow-sm transition-all
                            ${!locationSelected
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
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