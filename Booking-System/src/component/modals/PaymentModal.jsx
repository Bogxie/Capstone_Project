import { useState } from "react";
import { formatCurrency } from "../../assets/utils/formatCurrency"

const themeMap = {
    "header-golden":    { bg: "bg-[#F59E0B]", text: "text-black" },
    "header-snoop":     { bg: "bg-[#92400E]", text: "text-white" },
    "header-projector": { bg: "bg-[#1E293B]", text: "text-white" },
};

export const PaymentModal = ({ bookingDetails, serviceConfig, onConfirm }) => {
    const [balanceMethod, setBalanceMethod] = useState("Cash");
    const theme = themeMap[serviceConfig.theme.color] ?? { bg: "bg-gray-700", text: "text-white" };

    return (
        <div>
            <h6 className="text-center mb-3 font-bold text-sm tracking-widest">
                STEP 3 OF 3 - PAYMENT METHOD
            </h6>

            <div className="bg-[#212529] border border-gray-600 rounded-xl p-4 mb-1 text-center shadow">

                {/* Downpayment Verified */}
                <div className="flex items-center gap-2 bg-green-900/30 border border-green-700/40 text-green-400 text-xs px-3 py-2 rounded-lg mb-3">
                    ✅ Downpayment of ₱{formatCurrency(bookingDetails.downpayment || 1000)} Verified
                </div>

                <div className="text-4xl mb-1">💳</div>
                <h5 className="text-yellow-400 font-bold mt-1">Remaining Balance</h5>
                <h2 className="text-white font-bold text-2xl mb-3">₱{formatCurrency(bookingDetails.remainingBalance)}</h2>

                {/* Payment Method Selection */}
                <div className="text-left mb-3">
                    <label className="text-gray-400 text-xs font-bold mb-2 block">
                        Select Payment Method for Remaining Balance:
                    </label>
                    <div className="flex flex-col gap-2">

                        {/* Cash */}
                        <div
                            onClick={() => setBalanceMethod("Cash")}
                            className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                                balanceMethod === "Cash"
                                    ? "border-yellow-400 bg-yellow-400/10"
                                    : "border-gray-600 bg-gray-700/20 hover:border-gray-500"
                            }`}
                        >
                            <div className="flex justify-between items-center">
                                <span className={`text-sm ${balanceMethod === "Cash" ? "text-yellow-400 font-bold" : "text-white"}`}>
                                    💵 Cash on Delivery
                                </span>
                                {balanceMethod === "Cash" && <span className="text-yellow-400">✔</span>}
                            </div>
                        </div>

                        {/* GCash */}
                        <div
                            onClick={() => setBalanceMethod("GCash")}
                            className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                                balanceMethod === "GCash"
                                    ? "border-blue-500 bg-blue-500/10"
                                    : "border-gray-600 bg-gray-700/20 hover:border-gray-500"
                            }`}
                        >
                            <div className="flex justify-between items-center">
                                <span className={`text-sm ${balanceMethod === "GCash" ? "text-blue-400 font-bold" : "text-white"}`}>
                                    👛 GCash
                                </span>
                                {balanceMethod === "GCash" && <span className="text-blue-400">✔</span>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Note */}
                <div className="bg-yellow-400/5 border border-yellow-400/20 text-white text-xs text-left px-3 py-2 rounded-lg">
                    ℹ️ Pay the remaining <strong>₱{formatCurrency(bookingDetails.remainingBalance)}</strong>{" "}
                    {balanceMethod === "Cash" ? "in cash" : "via GCash"} upon setup on{" "}
                    <strong>{bookingDetails.month} {bookingDetails.date}</strong>.
                </div>
            </div>

            {/* Confirm Button */}
            <button
                type="button"
                className={`w-full ${theme.bg} ${theme.text} font-bold py-2 rounded-lg shadow-lg mt-2 hover:opacity-90 transition-opacity`}
                onClick={() => onConfirm(balanceMethod)}
            >
                Confirm Booking ✓
            </button>

            <p className="text-center text-gray-500 text-xs my-2">
                By clicking confirm, your date is officially reserved.
            </p>
        </div>
    );
};