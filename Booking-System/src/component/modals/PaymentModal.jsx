// src/component/Modals/PaymentModal.jsx
import { useState } from "react";
import { formatCurrency } from "../../assets/utils/formatCurrency"

const themeMap = {
    "header-golden":    { bg: "bg-[#F59E0B]", text: "text-black" },
    "header-snoop":     { bg: "bg-[#92400E]", text: "text-white" },
    "header-projector": { bg: "bg-[#1E293B]", text: "text-white" },
};

const QRCodeDisplay = ({ merchantName }) => (
    <div className="bg-white p-3 rounded-lg flex flex-col items-center justify-center">
        <div className="w-36 h-32 bg-gray-200 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-400">
            <div className="text-center">
                <span className="text-4xl">📱</span>
                <p className="text-xs text-gray-500 mt-0.5">QR Code</p>
            </div>
        </div>
        <div className="mt-1.5 text-center w-full">
            <p className="text-xs text-gray-600 font-bold">GCash: 09123456789</p>
            <p className="text-xs text-gray-500">{merchantName}</p>
        </div>
    </div>
);

export const PaymentModal = ({ 
    bookingDetails, 
    serviceConfig, 
    onConfirm,
    isSubmitting = false  // ✅ Added
}) => {
    const [balanceMethod, setBalanceMethod] = useState("Cash");
    const [showQR, setShowQR] = useState(false);
    const [paymentStep, setPaymentStep] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const theme = themeMap[serviceConfig?.theme?.color] ?? { bg: "bg-gray-700", text: "text-white" };
    const Merchant_name = 'Lime Serenity';

    const remainingBalance = bookingDetails.remainingBalance || bookingDetails.total - 1000;

    const handleConfirm = (method) => {
        if (isSubmitting) {
            console.log('⏳ Booking already in progress...');
            return;
        }
        onConfirm(method);
    };

    const handleQRPayment = () => {
        setIsProcessing(true);
        setPaymentStep(2);
        
        setTimeout(() => {
            setIsProcessing(false);
            setPaymentStep(3);
        }, 3000);
    };

    return (
        <div>
            <h6 className="text-center mb-3 font-bold text-sm tracking-wider">
                STEP 3 OF 3 - PAYMENT METHOD
            </h6>

            {!showQR ? (
                <div className="bg-[#212529] border border-gray-600 rounded-xl p-4 mb-2 text-center shadow">
                    <div className="flex items-center gap-2 bg-green-900/30 border border-green-700/40 text-green-400 text-xs px-3 py-2 rounded-lg mb-3">
                        ✅ Downpayment of ₱{formatCurrency(bookingDetails.downpayment || 1000)} Verified
                    </div>

                    <div className="text-4xl mb-1">💳</div>
                    <h5 className="text-yellow-400 font-bold text-sm mt-1">Remaining Balance</h5>
                    <h2 className="text-white font-bold text-2xl mb-3">₱{formatCurrency(remainingBalance)}</h2>

                    <div className="text-left mb-3">
                        <label className="text-gray-400 text-xs font-bold mb-2 block">
                            Select Payment Method:
                        </label>
                        <div className="flex flex-col gap-2">
                            <div
                                onClick={() => {
                                    setBalanceMethod("Cash");
                                    setShowQR(false);
                                    setPaymentStep(1);
                                }}
                                className={`p-2.5 rounded-lg border cursor-pointer transition-all duration-200 ${
                                    balanceMethod === "Cash" && !showQR
                                        ? "border-yellow-400 bg-yellow-400/10"
                                        : "border-gray-600 bg-gray-700/20 hover:border-gray-500"
                                }`}
                            >
                                <div className="flex justify-between items-center">
                                    <span className={`text-sm ${balanceMethod === "Cash" && !showQR ? "text-yellow-400 font-bold" : "text-white"}`}>
                                        💵 Cash on Delivery
                                    </span>
                                    {balanceMethod === "Cash" && !showQR && <span className="text-yellow-400">✔</span>}
                                </div>
                            </div>

                            <div
                                onClick={() => {
                                    setBalanceMethod("GCash");
                                    setShowQR(true);
                                    setPaymentStep(1);
                                    setIsProcessing(false);
                                }}
                                className={`p-2.5 rounded-lg border cursor-pointer transition-all duration-200 ${
                                    balanceMethod === "GCash" && showQR
                                        ? "border-blue-500 bg-blue-500/10"
                                        : "border-gray-600 bg-gray-700/20 hover:border-gray-500"
                                }`}
                            >
                                <div className="flex justify-between items-center">
                                    <span className={`text-sm ${balanceMethod === "GCash" && showQR ? "text-blue-400 font-bold" : "text-white"}`}>
                                        👛 GCash
                                    </span>
                                    {balanceMethod === "GCash" && showQR && <span className="text-blue-400">✔</span>}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-yellow-400/5 border border-yellow-400/20 text-white text-xs text-left px-3 py-2 rounded-lg">
                        ℹ️ Pay remaining <strong>₱{formatCurrency(remainingBalance)}</strong>{" "}
                        {balanceMethod === "Cash" 
                            ? "in cash" 
                            : "via GCash"} on{" "}
                        <strong>{bookingDetails.month} {bookingDetails.date}</strong>.
                    </div>

                    <button
                        type="button"
                        className={`w-full ${theme.bg} ${theme.text} font-bold py-2 text-sm rounded-lg shadow-lg mt-3 hover:opacity-90 transition-opacity ${
                            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        onClick={() => {
                            if (balanceMethod === "GCash") {
                                setShowQR(true);
                                setPaymentStep(1);
                            } else {
                                handleConfirm(balanceMethod);
                            }
                        }}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Processing...' : balanceMethod === "GCash" ? "Pay via GCash" : "Confirm Booking ✓"}
                    </button>

                    <p className="text-center text-gray-500 text-xs mt-2">
                        By clicking confirm, your date is officially reserved.
                    </p>
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
                                ₱{formatCurrency(remainingBalance)}
                            </h3>
                            
                            <QRCodeDisplay merchantName={Merchant_name} />
                            
                            <p className="text-white/70 text-xs text-center mt-2">
                                Scan QR using GCash app
                            </p>
                            
                            <button
                                className="w-full bg-white text-blue-600 font-bold py-2 text-sm rounded-lg hover:bg-gray-100 transition-colors mt-3 disabled:opacity-50 disabled:cursor-not-allowed"
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
                                    setBalanceMethod("Cash");
                                }}
                            >
                                Back
                            </button>
                        </div>
                    )}

                    {paymentStep === 2 && (
                        <div className="text-center py-8">
                            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                            <p className="text-white font-bold text-base">Verifying Payment...</p>
                            <p className="text-white/50 text-sm mt-1">Please wait a moment</p>
                        </div>
                    )}

                    {paymentStep === 3 && (
                        <div className="text-center">
                            <div className="text-5xl mb-2">✅</div>
                            <h5 className="text-white font-bold text-lg">Payment Confirmed!</h5>
                            <p className="text-white/70 text-sm px-2">
                                Remaining balance of ₱{formatCurrency(remainingBalance)} verified.
                            </p>
                            <div className="bg-green-500/20 border border-green-400/30 text-green-300 text-sm p-2.5 rounded-lg mt-3">
                                💡 Total paid: ₱{formatCurrency(bookingDetails.total)}
                            </div>
                            <button
                                className={`w-full bg-white text-blue-600 font-bold mt-3 py-2.5 text-sm rounded-lg hover:bg-gray-100 transition-colors shadow ${
                                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                                onClick={() => handleConfirm("GCash")}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Processing...' : 'Confirm Booking ✓'}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};