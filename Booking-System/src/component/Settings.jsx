import { useState } from "react";
import { useAuth } from "../context/useAuth";

export const Settings = ({ 
    deliveryFee, 
    setDeliveryFee, 
    serviceConfig, 
    setServiceConfig,
    blackoutDates = [],
    setBlackoutDates,
    disableServices = [], 
    setDisableServices 
}) => {
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
    
    // Internal temporary states para sa mga modal forms
    const [editFees, setEditFees] = useState([]);
    const [editPackages, setEditPackages] = useState({});
    const [editBlackoutDates, setEditBlackoutDates] = useState([]);
    const [newBlackoutDate, setNewBlackoutDate] = useState("");

    // --- TEMPORARY STATE PARA SA DISABLED SERVICES MODAL ---
    // Listahan ng lahat ng services mo para sa interface loop
    const ALL_SERVICES = ["Golden Hour", "Snoop Dough", "Rental Projector"];
    const [editDisabledServices, setEditDisabledServices] = useState([]);

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
        } else if (type === 'blackout') {
            setEditBlackoutDates([...blackoutDates]);
            setNewBlackoutDate("");
        } else if (type === 'services-status') {
            // Kopyahin ang kasalukuyang disabled services sa temporary modal state
            setEditDisabledServices([...disableServices]);
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

    const handleSavePackages = (e) => {
        e.preventDefault();
        setServiceConfig(editPackages);
        setShowModal(false);
    };

    const handleAddBlackoutDate = (e) => {
        e.preventDefault();
        if (!newBlackoutDate) return;
        if (!editBlackoutDates.includes(newBlackoutDate)) {
            setEditBlackoutDates(prev => [...prev, newBlackoutDate].sort());
        }
        setNewBlackoutDate("");
    };

    const handleRemoveBlackoutDate = (dateToRemove) => {
        setEditBlackoutDates(prev => prev.filter(date => date !== dateToRemove));
    };

    const handleSaveBlackoutDates = (e) => {
        e.preventDefault();
        setBlackoutDates(editBlackoutDates);
        setShowModal(false);
    };

    // --- HANDLERS PARA SA SERVICE TOGGLE OPTION ---
    const handleToggleServiceStatus = (serviceName) => {
        setEditDisabledServices(prev => {
            if (prev.includes(serviceName)) {
                // Kung nandoon na (disabled), tanggalin para maging "Active" ulit
                return prev.filter(name => name !== serviceName);
            } else {
                // Kung wala pa, idagdag sa disabled list
                return [...prev, serviceName];
            }
        });
    };

    const handleSaveServicesStatus = (e) => {
        e.preventDefault();
        setDisableServices(editDisabledServices); // Permanente na dito sa event submit
        setShowModal(false);
    };

    return (
        <>
            <title>Settings</title>

            <h2 className="text-2xl font-bold text-yellow-400 mb-4">Settings</h2>

            {/* Account Settings */}
            <div className="bg-gray-900 border border-yellow-500 rounded-lg overflow-hidden mb-6">
                <div className="bg-black text-yellow-400 px-4 py-3 font-semibold">Account</div>
                <div className="p-4 flex flex-col sm:flex-row gap-3">
                    <button className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm font-semibold transition">✏️ Edit Profile</button>
                    <button className="flex-1 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 rounded-lg text-black text-sm font-semibold transition">🔒 Change Password</button>
                </div>
            </div>

            {/* Notifications */}
            <div className="bg-gray-900 border border-yellow-500 rounded-lg overflow-hidden mb-6">
                <div className="bg-black text-yellow-400 px-4 py-3 font-semibold">Notification Preferences</div>
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
                                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-black rounded-full transition-transform ${notifications[item.key] ? "translate-x-6" : "translate-x-0"}`} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Appearance */}
            <div className="bg-gray-900 border border-yellow-500 rounded-lg overflow-hidden mb-6">
                <div className="bg-black text-yellow-400 px-4 py-3 font-semibold">Appearance</div>
                <div className="p-4 flex gap-3">
                    {["dark", "light"].map((mode) => (
                        <button
                            key={mode}
                            onClick={() => setTheme(mode)}
                            className={`flex-1 px-4 py-2 rounded-lg text-sm font-semibold capitalize transition border ${theme === mode ? "bg-yellow-500 text-black border-yellow-500" : "bg-black text-white border-gray-700 hover:border-yellow-500"}`}
                        >
                            {mode} mode
                        </button>
                    ))}
                </div>
            </div>

            {/* Admin Booking & Pricing section */}
            {currentUser?.role === "Admin" && (
                <div className="bg-gray-900 border border-yellow-500 rounded-lg overflow-hidden mb-6">
                    <div className="bg-black text-yellow-400 px-4 py-3 font-semibold">Booking & Pricing (Admin)</div>
                    <div className="divide-y divide-gray-700 text-sm">
                        <div className="flex justify-between items-center px-4 py-3">
                            <span className="text-white">Manage delivery fees</span>
                            <button onClick={() => handleUpdate('edit-fees')} className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-yellow-500 text-black hover:bg-yellow-600 transition">Manage</button>
                        </div>
                        <div className="flex justify-between items-center px-4 py-3">
                            <span className="text-white">Manage service rates & hero packages</span>
                            <button onClick={() => handleUpdate('edit-packages')} className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-yellow-500 text-black hover:bg-yellow-600 transition">Manage</button>
                        </div>
                        
                        {/* BAGONG SETTING ROW PARA SA ACTIVE/DISABLED SERVICES */}
                        <div className="flex justify-between items-center px-4 py-3">
                            <span className="text-white">Service Activation / Status</span>
                            <button onClick={() => handleUpdate('services-status')} className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-yellow-500 text-black hover:bg-yellow-600 transition">Manage Status</button>
                        </div>

                        <div className="flex justify-between items-center px-4 py-3">
                            <span className="text-white">Blackout dates / availability</span>
                            <button onClick={() => handleUpdate('blackout')} className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-yellow-500 text-black hover:bg-yellow-600 transition">Manage</button>
                        </div>
                    </div>
                </div>
            )}

            {/* General Save changes button */}
            <form onSubmit={handleSave}>
                <button type="submit" className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold text-sm rounded-lg transition">Save Changes</button>
                {saved && <span className="ml-3 text-green-400 text-xs">✅ Settings saved.</span>}
            </form>

            {showModal && (
                <div className="fixed inset-0 z-[1050] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 ">
                    <div className="bg-gray-900 border border-yellow-500 rounded-lg w-full max-w-xl max-h-[85vh] overflow-y-auto p-5 hide-scrollbar">

                        {modalType === "edit-fees" && (
                            <form onSubmit={handleSaveFees}>
                                <h3 className="text-yellow-400 font-semibold text-lg mb-4">Edit Delivery Fees</h3>
                                <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2 hide-scrollbar">
                                    {editFees.map((item, index) => (
                                        <div key={item.municipality} className="flex items-center justify-between gap-3">
                                            <label className="text-white text-sm flex-1">{item.municipality}</label>
                                            <input type="number" min="0" value={item.fee} onChange={(e) => handleFeeChange(index, e.target.value)} className="w-28 px-3 py-1.5 rounded-lg bg-black border border-gray-700 text-white text-sm focus:border-yellow-500 focus:outline-none" />
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
                            <form onSubmit={handleSavePackages}>
                                <h3 className="text-yellow-400 font-semibold text-lg mb-4">Edit Service Rates & Packages</h3>
                                <div className="space-y-6 max-h-[55vh] overflow-y-auto pr-2 hide-scrollbar">
                                    {Object.keys(editPackages).map((brand) => (
                                        <div key={brand} className="border border-gray-800 rounded-xl p-4 bg-black/40">
                                            <h4 className="text-sm font-bold text-cyan-400 mb-3 uppercase border-b border-gray-800 pb-1">{brand}</h4>
                                            <div className="space-y-4">
                                                {editPackages[brand].packages.map((pkg, i) => (
                                                    <div key={i} className="bg-gray-950 p-3 rounded-lg space-y-2 border border-gray-900">
                                                        <div className="flex gap-2">
                                                            <div className="flex-1">
                                                                <label className="text-[10px] text-gray-400 block uppercase font-bold">Package Name</label>
                                                                <input type="text" value={pkg.name} onChange={(e) => handlePackageChange(brand, i, "name", e.target.value)} className="w-full px-2 py-1 rounded bg-black border border-gray-800 text-white text-xs focus:border-yellow-500" />
                                                            </div>
                                                            <div className="w-28">
                                                                <label className="text-[10px] text-gray-400 block uppercase font-bold">Price</label>
                                                                <input type="text" value={pkg.price} onChange={(e) => handlePackageChange(brand, i, "price", e.target.value)} className="w-full px-2 py-1 rounded bg-black border border-gray-800 text-white text-xs focus:border-yellow-500" />
                                                            </div>
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

                        {/* MODAL WINDOW PARA SA SERVICE MANAGEMENT STATUS */}
                        {modalType === "services-status" && (
                            <form onSubmit={handleSaveServicesStatus}>
                                <h3 className="text-yellow-400 font-semibold text-lg mb-2">Service Availability Control</h3>
                                <p className="text-gray-400 text-xs mb-6">Toggle off a service to hide or disable it on the front customer options form dynamically.</p>

                                <div className="divide-y divide-gray-800 bg-black/40 border border-gray-800 rounded-xl px-4 py-2">
                                    {ALL_SERVICES.map((serviceName) => {
                                        // Kung nasa listahan ng disabled, it's currently OFF (False), otherwise it's ON (True)
                                        const isServiceDisabled = editDisabledServices.includes(serviceName);
                                        const isServiceActive = !isServiceDisabled;

                                        return (
                                            <div key={serviceName} className="flex justify-between items-center py-4">
                                                <div>
                                                    <span className="text-sm font-bold text-white block">{serviceName}</span>
                                                    <span className={`text-[11px] font-medium ${isServiceActive ? "text-green-400" : "text-red-400"}`}>
                                                        {isServiceActive ? "● Active & Selectable" : "○ Temporarily Unavailable"}
                                                    </span>
                                                </div>
                                                
                                                {/* Toggle Switch */}
                                                <button
                                                    type="button"
                                                    onClick={() => handleToggleServiceStatus(serviceName)}
                                                    className={`w-12 h-6 rounded-full relative transition-colors duration-200 focus:outline-none ${isServiceActive ? "bg-green-500" : "bg-gray-700"}`}
                                                >
                                                    <span
                                                        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-black rounded-full transition-transform duration-200 ${isServiceActive ? "translate-x-6" : "translate-x-0"}`}
                                                    />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="flex gap-2 mt-8">
                                    <button type="submit" className="px-4 py-2 bg-yellow-500 text-black text-sm font-semibold rounded-lg hover:bg-yellow-600 transition">
                                        Save Service Status
                                    </button>
                                    <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-700 text-white text-sm font-semibold rounded-lg hover:bg-gray-600 transition">
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Blackout dates modal */}
                        {modalType === "blackout" && (
                            <form onSubmit={handleSaveBlackoutDates}>
                                <h3 className="text-yellow-400 font-semibold text-lg mb-2">Manage Blackout Dates</h3>
                                <div className="flex gap-2 mb-6">
                                    <input type="date" value={newBlackoutDate} onChange={(e) => setNewBlackoutDate(e.target.value)} className="flex-1 px-3 py-2 rounded-lg bg-black border border-gray-700 text-white text-sm focus:border-yellow-500 focus:outline-none" />
                                    <button type="button" onClick={handleAddBlackoutDate} className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition">➕ Block Date</button>
                                </div>
                                <div className="bg-black/50 border border-gray-800 rounded-xl p-3 max-h-[35vh] overflow-y-auto space-y-2 hide-scrollbar">
                                    {editBlackoutDates.map((date) => (
                                        <div key={date} className="flex justify-between items-center bg-gray-950 px-3 py-2 rounded-lg border border-gray-900">
                                            <span className="text-white text-sm font-mono font-bold">🗓️ {date}</span>
                                            <button type="button" onClick={() => handleRemoveBlackoutDate(date)} className="text-red-500 text-xs font-semibold px-2 py-1 rounded hover:bg-red-500/10 transition">🗑️ Remove</button>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-2 mt-6">
                                    <button type="submit" className="px-4 py-2 bg-yellow-500 text-black text-sm font-semibold rounded-lg">Save Blackout Dates</button>
                                    <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-700 text-white text-sm font-semibold rounded-lg">Cancel</button>
                                </div>
                            </form>
                        )}

                    </div>
                </div>
            )}
        </>
    );
};