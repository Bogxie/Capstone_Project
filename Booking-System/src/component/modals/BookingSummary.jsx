import { useState } from "react";
import { formatCurrency } from '../../assets/Utils/formatCurrency.js'

const QRCodeDisplay = ({ merchantName }) => (
    <div className="bg-white p-4 rounded-lg flex flex-col items-center justify-center">
        <div className="w-36 h-32 bg-gray-200 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-400">
            <div className="text-center">
                <span className="text-4xl">📱</span>
                <p className="text-xs text-gray-500 mt-0.5">QR Code</p>
            </div>
        </div>
        <div className="mt-2 text-center w-full">
            <p className="text-sm text-gray-600 font-bold">GCash: 09123456789</p>
            <p className="text-sm text-gray-500">{merchantName}</p>
        </div>
    </div>
);

export const BookingSummaryModal = ({
    bookingDetails,
    handleBack,
    onNext,
    isTermsAccepted,
    setTermsAccepted,
    setShowTerms,
}) => {
    const [showQR, setShowQR] = useState(false);
    const [paymentStep, setPaymentStep] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const Merchant_name = 'Lime Serenity';

    const handleCheckBox = (e) => setTermsAccepted(e.target.checked);

    const handleQRPayment = () => {
        setIsProcessing(true);
        setPaymentStep(2);
        
        setTimeout(() => {
            setIsProcessing(false);
            setPaymentStep(3);
        }, 3000);
    };

    const tdClass = "border border-[#6184D8] text-white bg-[#1e1e1e] px-2 py-1 text-sm";
    const thClass = "border border-[#6184D8] text-white bg-[#1e1e1e] px-2 py-1 text-sm font-bold whitespace-nowrap";

    return (
        <>
            {!showQR ? (
                <div>
                    <h6 className="text-center mb-2 font-bold text-sm">STEP 2 OF 3 - SECURE DATE</h6>

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
                                    ["💰 Downpayment", `₱ ${formatCurrency(bookingDetails.downpayment || 1000)}`],
                                    ["💵 Remaining", `₱ ${formatCurrency(bookingDetails.remainingBalance || bookingDetails.total - 1000)}`],
                                ].map(([label, value]) => (
                                    <tr key={label}>
                                        <th className={thClass}>{label}</th>
                                        <td className={`${tdClass} break-words`}>{value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex items-center gap-2 my-3">
                        <input
                            type="checkbox"
                            id="terms"
                            checked={isTermsAccepted}
                            onChange={handleCheckBox}
                            className="w-4 h-4 accent-[#6184D8] cursor-pointer"
                            required
                        />
                        <label htmlFor="terms" className="text-sm text-lime-400 cursor-pointer">
                            I agree to the{" "}
                            <button
                                className="text-blue-600 underline hover:text-blue-800 transition-colors p-0"
                                onClick={() => setShowTerms(true)}
                            >
                                Terms and Conditions
                            </button>
                        </label>
                    </div>

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
                            onClick={() => setShowQR(true)}
                            disabled={!isTermsAccepted}
                        >
                            Pay Downpayment ₱{formatCurrency(bookingDetails.downpayment || 1000)}
                        </button>
                    </div>
                </div>

            ) : (
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-5">
                    <div className="flex items-center mb-3">
                        <div className="bg-white text-blue-600 font-bold px-2.5 py-0.5 rounded text-sm">G</div>
                        <span className="text-white font-bold ml-2 text-base tracking-wider">Cash</span>
                        <span className="ml-auto text-white/50 text-xs">Pay Bill</span>
                    </div>

                    {paymentStep === 1 && (
                        <div>
                            <p className="text-white text-sm text-center mb-1">Scan to Pay</p>
                            <h3 className="text-white text-center text-2xl font-bold mb-3">
                                ₱{formatCurrency(bookingDetails.downpayment || 1000)}
                            </h3>
                            
                            <QRCodeDisplay merchantName={Merchant_name} />
                            
                            <p className="text-white/70 text-sm text-center mt-2">
                                Scan QR code using GCash app to pay downpayment
                            </p>
                            
                            <button
                                className="w-full bg-white text-blue-600 font-bold py-2.5 text-sm rounded-lg hover:bg-gray-100 transition-colors mt-3 disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={handleQRPayment}
                                disabled={isProcessing}
                            >
                                {isProcessing ? 'Processing...' : "I've Paid ✓"}
                            </button>
                            
                            <button
                                className="w-full text-white/50 text-sm mt-1.5 py-1 hover:text-white transition-colors"
                                onClick={() => {
                                    setShowQR(false);
                                    setPaymentStep(1);
                                    setIsProcessing(false);
                                }}
                            >
                                Cancel Payment
                            </button>
                        </div>
                    )}

                    {paymentStep === 2 && (
                        <div className="text-center py-10">
                            <div className="w-14 h-14 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                            <p className="text-white font-bold text-base">Verifying Payment...</p>
                            <p className="text-white/50 text-sm mt-1">Please wait a moment</p>
                        </div>
                    )}

                    {paymentStep === 3 && (
                        <div className="text-center">
                            <div className="text-5xl mb-2">✅</div>
                            <h5 className="text-white font-bold text-lg">Payment Confirmed!</h5>
                            <p className="text-white/70 text-sm px-2">
                                Downpayment of ₱{formatCurrency(bookingDetails.downpayment || 1000)} verified.
                            </p>
                            <div className="bg-green-500/20 border border-green-400/30 text-green-300 text-sm p-2 rounded-lg mt-3">
                                💡 Remaining balance: ₱{formatCurrency(bookingDetails.remainingBalance || bookingDetails.total - 1000)}
                            </div>
                            <button
                                className="w-full bg-white text-blue-600 font-bold mt-3 py-2.5 text-sm rounded-lg hover:bg-gray-100 transition-colors shadow"
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