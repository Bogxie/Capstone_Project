import { useState, useRef } from "react";
import { formatCurrency } from '../../assets/Utils/formatCurrency.js'

export const BookingSummaryModal = ({
    bookingDetails,
    handleBack,
    onNext,
    isTermsAccepted,
    setTermsAccepted,
    setShowTerms,
}) => {
    const [showGcashMock, setShowGcashMock] = useState(false);
    const [gcashStep, setGcashStep] = useState(1);
    const [gcashNumber, setGcashNumber] = useState("");
    const [pin, setPin] = useState(["", "", "", ""]);
    const [isProcessing, setIsProcessing] = useState(false);
    const Merchant_name = 'Lime Serenity';

    const pinRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

    const handlePinChange = (index, value) => {
        if (!/^[0-9]?$/.test(value)) return;
        const newPin = [...pin];
        newPin[index] = value;
        setPin(newPin);
        if (value && index < 3) {
            pinRefs[index + 1].current?.focus();
        }
    };

    const handlePinSubmit = () => {
        if (pin.some(p => p === "")) return;
        setIsProcessing(true);
        setGcashStep(3);
        setTimeout(() => {
            setIsProcessing(false);
            setGcashStep(4);
        }, 3000);
    };

    const handleCheckBox = (e) => setTermsAccepted(e.target.checked);

    const tdClass = "border border-[#6184D8] text-white bg-[#1e1e1e] px-2 py-1 text-sm";
    const thClass = "border border-[#6184D8] text-white bg-[#1e1e1e] px-2 py-1 text-sm font-bold whitespace-nowrap";

    return (
        <>
            {!showGcashMock ? (
                <div>
                    <h6 className="text-center mb-2 font-bold text-sm">STEP 2 OF 3 - SECURE DATE</h6>

                    {/* Summary Card */}
                    <div className="bg-[#1e1e1e] rounded-lg p-2 mb-1 border border-gray-600">
                        <h5 className="text-center my-2 text-[#6184D8] font-semibold text-sm [font-variant:small-caps] border-b border-[#6184D8] pb-1">
                            Booking Summary
                        </h5>
                        <table className="w-full border-collapse">
                            <tbody>
                                {[
                                    ["📅 Date", `${bookingDetails.month} ${bookingDetails.date}, ${bookingDetails.year}`],
                                    ["🕐 Time", `${bookingDetails.timeStart} ${bookingDetails.timeStartAmPm} - ${bookingDetails.timeEnd} ${bookingDetails.timeEndAmPm}`],
                                    ["📍 Venue", bookingDetails.venue],
                                    [
                                        bookingDetails.service === "Rental Projector" ? "💰 Rental Fee" : "💼 Package Fee",
                                        `₱ ${formatCurrency(bookingDetails.rentalFee)}`
                                    ],
                                    ["🚚 Delivery Fee", `${bookingDetails.municipality} (₱ ${formatCurrency(bookingDetails.deliveryFee)})`],
                                    ["🧾 Tax", `₱ ${formatCurrency(bookingDetails.tax)}`],
                                    ["💳 Total", `₱ ${formatCurrency(bookingDetails.total)}`],
                                ].map(([label, value]) => (
                                    <tr key={label}>
                                        <th className={thClass}>{label}</th>
                                        <td className={`${tdClass} break-words`}>{value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Terms Checkbox */}
                    <div className="flex items-center gap-2 my-3">
                        <input
                            type="checkbox"
                            id="terms"
                            checked={isTermsAccepted}
                            onChange={handleCheckBox}
                            className="w-4 h-4 accent-[#6184D8] cursor-pointer"
                            required
                        />
                        <label htmlFor="terms" className="text-sm text-black cursor-pointer">
                            I agree to the{" "}
                            <button
                                className="text-blue-600 underline hover:text-blue-800 transition-colors p-0"
                                onClick={() => setShowTerms(true)}
                            >
                                Terms and Conditions
                            </button>
                        </label>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-1">
                        <button
                            type="button"
                            className="flex-1 py-2 text-sm font-semibold rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                            onClick={handleBack}
                        >
                            Back
                        </button>
                        <button
                            type="button"
                            className="flex-1 py-2 text-sm font-bold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => setShowGcashMock(true)}
                            disabled={!isTermsAccepted}
                        >
                            Pay Downpayment ₱1,000
                        </button>
                    </div>
                </div>

            ) : (
                /* GCash Mock */
                <div className="bg-[#007bff] rounded-lg p-5 min-h-[350px] shadow-lg">

                    {/* GCash Header */}
                    <div className="flex items-center mb-6">
                        <div className="bg-white text-blue-600 font-bold px-2 rounded text-base">G</div>
                        <span className="text-white font-bold ml-2 tracking-wider">Cash</span>
                        <span className="ml-auto text-white/50 text-sm">Pay Bill</span>
                    </div>

                    {/* Step 1 — Enter Number */}
                    {gcashStep === 1 && (
                        <div>
                            <p className="text-white text-sm text-center mb-1">Amount to Pay</p>
                            <h3 className="text-white text-center text-2xl font-bold mb-4">₱1,000.00</h3>
                            <input
                                type="tel"
                                className="w-full text-center font-bold rounded-[10px] h-[50px] text-xl px-3 mb-3 border-0 outline-none"
                                placeholder="09XXXXXXXXX"
                                maxLength={11}
                                value={gcashNumber}
                                onChange={(e) => setGcashNumber(e.target.value.replace(/[^0-9]/g, ""))}
                            />
                            <button
                                className="w-full bg-white text-blue-600 font-bold py-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={gcashNumber.length !== 11}
                                onClick={() => setGcashStep(2)}
                            >
                                Next
                            </button>
                            <button
                                className="w-full text-white/50 text-sm mt-2 py-1 hover:text-white transition-colors"
                                onClick={() => setShowGcashMock(false)}
                            >
                                Cancel Payment
                            </button>
                        </div>
                    )}

                    {/* Step 2 — PIN */}
                    {gcashStep === 2 && (
                        <div className="text-center">
                            <p className="text-white text-sm font-bold mb-3">Enter 4-digit MPIN</p>
                            <div className="flex justify-center gap-2 mb-4">
                                {pin.map((p, i) => (
                                    <input
                                        key={i}
                                        ref={pinRefs[i]}
                                        type="password"
                                        maxLength={1}
                                        className="w-[50px] h-[50px] text-center font-bold text-2xl bordered rounded-lg border-0 outline-none"
                                        value={p}
                                        onChange={(e) => handlePinChange(i, e.target.value)}
                                    />
                                ))}
                            </div>
                            <button
                                className="w-full bg-white text-blue-600 font-bold py-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={pin.some(p => p === "") || isProcessing}
                                onClick={handlePinSubmit}
                            >
                                Confirm Pay ₱1,000
                            </button>
                        </div>
                    )}

                    {/* Step 3 — Processing */}
                    {gcashStep === 3 && (
                        <div className="text-center py-10">
                            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                            <p className="text-white font-bold">Processing...</p>
                        </div>
                    )}

                    {/* Step 4 — Success */}
                    {gcashStep === 4 && (
                        <div className="text-center">
                            <div className="text-5xl mb-2">✅</div>
                            <h5 className="text-white font-bold text-lg">Payment Success!</h5>
                            <p className="text-white/50 text-sm px-3">
                                Downpayment of ₱1,000.00 sent to {Merchant_name}.
                            </p>
                            <button
                                className="w-full bg-white text-blue-600 font-bold mt-3 py-2 rounded-lg hover:bg-gray-100 transition-colors shadow"
                                onClick={onNext}
                            >
                                Next: Payment Method →
                            </button>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};