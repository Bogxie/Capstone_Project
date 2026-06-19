import { useState } from "react";
import { useAuth } from "../context/useAuth";

export const Settings = ({ deliveryFee, setDeliveryFee, serviceConfig, setServiceConfig }) => {
    const { currentUser } = useAuth();
    const [notifications, setNotifications] = useState({
        newBooking: true,
        statusUpdates: true,
        promos: false,
    });
    const [theme, setTheme] = useState("dark");
    const [saved, setSaved] = useState(false);
    const [modalType, setModalType] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editFees, setEditFees] = useState(
        deliveryFee.map((item) => ({ ...item }))
    );
    const [editPackages, setEditPackages] = useState({});

    const toggleNotification = (key) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const handleUpdate = (type) => {
        setModalType(type);
        if (type === 'edit-fees') {
            setEditFees(deliveryFee.map((item) => ({ ...item })));
        } else if (type === 'edit-packages') {
            setEditPackages(JSON.parse(JSON.stringify(serviceConfig)));
        }
        setShowModal(true);
    };

    const handleFeeChange = (index, value) => {
        setEditFees((prev) =>
            prev.map((item, i) => (i === index ? { ...item, fee: Number(value) } : item))
        );
    };

    const handleSaveFees = (e) => {
        e.preventDefault();
        setDeliveryFee(editFees);
        setShowModal(false);
    };

    const handlePackageChange = (brand, pkgIndex, field, value) => {
        setEditPackages((prev) => {
            const updated = { ...prev };
            updated[brand].packages[pkgIndex][field] = value;

            if (field === "name") {
                updated[brand].options[pkgIndex].label = value;
            }

            return updated;
        });
    };

    // FIX: Idinagdag itong kulang na handler para sa packages
    const handleSavePackages = (e) => {
        e.preventDefault();
        setServiceConfig(editPackages);
        setShowModal(false);
    };

    return (
        <>
            <title>Settings</title>

            <h2 className="text-2xl font-bold text-yellow-400 mb-4">Settings</h2>

            {/* Account Settings */}
            <div className="bg-gray-900 border border-yellow-500 rounded-lg overflow-hidden mb-6">
                <div className="bg-black text-yellow-400 px-4 py-3 font-semibold">
                    Account
                </div>
                <div className="p-4 flex flex-col sm:flex-row gap-3">
                    <button className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm font-semibold transition">
                        ✏️ Edit Profile
                    </button>
                    <button className="flex-1 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 rounded-lg text-black text-sm font-semibold transition">
                        🔒 Change Password
                    </button>
                </div>
            </div>

            {/* Notifications */}
            <div className="bg-gray-900 border border-yellow-500 rounded-lg overflow-hidden mb-6">
                <div className="bg-black text-yellow-400 px-4 py-3 font-semibold">
                    Notification Preferences
                </div>
                <div className="divide-y divide-gray-700">
                    {[
                        { key: "newBooking", label: "New booking alerts" },
                        { key: "statusUpdates", label: "Booking status updates" },
                        { key: "promos", label: "Promos & announcements" },
                    ].map((item) => (
                        <div key={item.key} className="flex justify-between items-center px-4 py-3 text-sm">
                            <span className="text-white">{item.label}</span>
                            <button
                                onClick={() => toggleNotification(item.key)}
                                className={`w-12 h-6 rounded-full relative transition-colors ${notifications[item.key] ? "bg-yellow-500" : "bg-gray-600"}`}
                            >
                                <span
                                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-black rounded-full transition-transform ${notifications[item.key] ? "translate-x-6" : "translate-x-0"}`}
                                />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Appearance */}
            <div className="bg-gray-900 border border-yellow-500 rounded-lg overflow-hidden mb-6">
                <div className="bg-black text-yellow-400 px-4 py-3 font-semibold">
                    Appearance
                </div>
                <div className="p-4 flex gap-3">
                    {["dark", "light"].map((mode) => (
                        <button
                            key={mode}
                            onClick={() => setTheme(mode)}
                            className={`flex-1 px-4 py-2 rounded-lg text-sm font-semibold capitalize transition border ${theme === mode
                                ? "bg-yellow-500 text-black border-yellow-500"
                                : "bg-black text-white border-gray-700 hover:border-yellow-500"
                            }`}
                        >
                            {mode} mode
                        </button>
                    ))}
                </div>
                {theme === "light" && (
                    <p className="px-4 pb-3 text-xs text-gray-500">
                        Light mode is coming soon — for now the app will continue using dark mode.
                    </p>
                )}
            </div>

            {/* FIX: Inayos ang duplikado at magulong Admin Booking & Pricing section */}
            {currentUser?.role === "Admin" && (
                <div className="bg-gray-900 border border-yellow-500 rounded-lg overflow-hidden mb-6">
                    <div className="bg-black text-yellow-400 px-4 py-3 font-semibold">
                        Booking & Pricing (Admin)
                    </div>
                    <div className="divide-y divide-gray-700 text-sm">
                        <div className="flex justify-between items-center px-4 py-3">
                            <span className="text-white">Manage delivery fees</span>
                            <button onClick={() => handleUpdate('edit-fees')} className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-yellow-500 text-black hover:bg-yellow-600 transition">
                                Manage 
                            </button>
                        </div>
                        <div className="flex justify-between items-center px-4 py-3">
                            <span className="text-white">Manage service rates & hero packages</span>
                            <button onClick={() => handleUpdate('edit-packages')} className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-yellow-500 text-black hover:bg-yellow-600 transition">
                                Manage 
                            </button>
                        </div>
                        <div className="flex justify-between items-center px-4 py-3">
                            <span className="text-white">Blackout dates / availability</span>
                            <button onClick={() => handleUpdate('blackout')} className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-yellow-500 text-black hover:bg-yellow-600 transition">
                                Manage
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Save */}
            <form onSubmit={handleSave}>
                <button type="submit" className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold text-sm rounded-lg transition">
                    Save Changes
                </button>
                {saved && <span className="ml-3 text-green-400 text-xs">✅ Settings saved.</span>}
            </form>

            {showModal && (
                <div className="fixed inset-0 z-[1050] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 ">
                    <div className="bg-gray-900 border border-yellow-500 rounded-lg w-full max-w-xl max-h-[85vh] overflow-y-auto p-5 hide-scrollbar">

                        {modalType === "edit-fees" && (
                            <form  onSubmit={handleSaveFees}>
                                <h3 className="text-yellow-400 font-semibold text-lg mb-4">Edit Delivery Fees</h3>
                                <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2 hide-scrollbar">
                                    {editFees.map((item, index) => (
                                        <div key={item.municipality} className="flex items-center justify-between gap-3">
                                            <label className="text-white text-sm flex-1">{item.municipality}</label>
                                            <input
                                                type="number" min="0" value={item.fee}
                                                onChange={(e) => handleFeeChange(index, e.target.value)}
                                                className="w-28 px-3 py-1.5 rounded-lg bg-black border border-gray-700 text-white text-sm focus:border-yellow-500 focus:outline-none"
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-2 mt-6">
                                    <button type="submit" className="px-4 py-2 bg-yellow-500 text-black text-sm font-semibold rounded-lg">Save Fees</button>
                                    <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-700 text-white text-sm font-semibold rounded-lg">Cancel</button>
                                </div>
                            </form>
                        )}

                        {modalType === "edit-packages" && (
                            <form className="hide-scrollbar" onSubmit={handleSavePackages}>
                                <h3 className="text-yellow-400 font-semibold text-lg mb-4">Edit Service Rates & Packages</h3>

                                <div className="space-y-6 max-h-[55vh] overflow-y-auto pr-2 hide-scrollbar">
                                    {Object.keys(editPackages).map((brand) => (
                                        <div key={brand} className="border border-gray-800 rounded-xl p-4 bg-black/40">
                                            <h4 className="text-sm font-bold text-cyan-400 mb-3 tracking-wide uppercase border-b border-gray-800 pb-1">
                                                {brand}
                                            </h4>

                                            <div className="space-y-4">
                                                {editPackages[brand].packages.map((pkg, i) => (
                                                    <div key={i} className="bg-gray-950 p-3 rounded-lg space-y-2 border border-gray-900">
                                                        <div className="flex gap-2">
                                                            <div className="flex-1">
                                                                <label className="text-[10px] text-gray-400 block uppercase font-bold">Package Name</label>
                                                                <input
                                                                    type="text" value={pkg.name}
                                                                    onChange={(e) => handlePackageChange(brand, i, "name", e.target.value)}
                                                                    className="w-full px-2 py-1 rounded bg-black border border-gray-800 text-white text-xs focus:border-yellow-500 focus:outline-none"
                                                                />
                                                            </div>
                                                            <div className="w-28">
                                                                <label className="text-[10px] text-gray-400 block uppercase font-bold">Price</label>
                                                                <input
                                                                    type="text" value={pkg.price}
                                                                    onChange={(e) => handlePackageChange(brand, i, "price", e.target.value)}
                                                                    className="w-full px-2 py-1 rounded bg-black border border-gray-800 text-white text-xs focus:border-yellow-500 focus:outline-none"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="text-[10px] text-gray-400 block uppercase font-bold">Details</label>
                                                            <input
                                                                type="text" value={pkg.details}
                                                                onChange={(e) => handlePackageChange(brand, i, "details", e.target.value)}
                                                                className="w-full px-2 py-1 rounded bg-black border border-gray-800 text-white text-xs focus:border-yellow-500 focus:outline-none"
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex gap-2 mt-6">
                                    <button type="submit" className="px-4 py-2 bg-yellow-500 text-black text-sm font-semibold rounded-lg">Save All Packages</button>
                                    <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-700 text-white text-sm font-semibold rounded-lg">Cancel</button>
                                </div>
                            </form>
                        )}

                        {modalType === "blackout" && (
                            <div>
                                <h3 className="text-yellow-400 font-semibold text-lg mb-4">Blackout Dates</h3>
                                <p className="text-gray-400 text-sm mb-4">Blackout date management UI goes here.</p>
                                <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-700 text-white text-sm font-semibold rounded-lg">Close</button>
                            </div>
                        )}

                    </div>
                </div>
            )}
        </>
    );
};