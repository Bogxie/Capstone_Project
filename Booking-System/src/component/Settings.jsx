// component/Settings.jsx
import { useState } from "react";
import { useAuth } from "../context/useAuth";
import { useTheme } from "../context/useTheme";
import { fetchDeliveryOptions } from "../assets/utils/deliveryOptions";
import { socket } from "../services/socket";
import axios from "axios";

export const Settings = ({
    municipalities,
    setMunicipalities,
    refreshMunicipalities,
    serviceConfig,
    setServiceConfig,
    refreshServices,
    blackoutDates = [],
    setBlackoutDates,
    disableServices = [],
    setDisableServices
}) => {
    const { currentUser } = useAuth();
    const { theme, setTheme } = useTheme();
    const [notifications, setNotifications] = useState({
        newBooking: true,
        statusUpdates: true,
        promos: false,
    });
    const [saved, setSaved] = useState(false);
    const [modalType, setModalType] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editFees, setEditFees] = useState([]);
    const [editPackages, setEditPackages] = useState({});
    const [editBlackoutDates, setEditBlackoutDates] = useState([]);
    const [newBlackoutDate, setNewBlackoutDate] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
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

    const normalizePrice = (price) => {
        if (typeof price === 'number') return price;
        if (typeof price === 'string') {
            const clean = price.replace(/[₱,]/g, '');
            return parseFloat(clean) || 0;
        }
        return 0;
    };

    const normalizePackages = (data) => {
        const normalized = {};
        Object.keys(data).forEach(brand => {
            normalized[brand] = {
                ...data[brand],
                packages: data[brand].packages.map(pkg => ({
                    ...pkg,
                    price: normalizePrice(pkg.price)
                }))
            };
        });
        return normalized;
    };

    const handleUpdate = async (type) => {
        setModalType(type);

        if (type === 'edit-fees') {
            if (refreshMunicipalities) {
                try {
                    const freshData = await refreshMunicipalities();
                    setEditFees(freshData.map((item) => ({
                        municipality_id: item.municipality_id,
                        municipality: item.municipality,
                        fee: typeof item.fee === 'string' ? parseFloat(item.fee) : item.fee
                    })));
                } catch (err) {
                    console.error('Error refreshing municipalities:', err);
                    setEditFees(municipalities.map((item) => ({
                        municipality_id: item.municipality_id,
                        municipality: item.municipality,
                        fee: typeof item.fee === 'string' ? parseFloat(item.fee) : item.fee
                    })));
                }
            } else {
                setEditFees(municipalities.map((item) => ({
                    municipality_id: item.municipality_id,
                    municipality: item.municipality,
                    fee: typeof item.fee === 'string' ? parseFloat(item.fee) : item.fee
                })));
            }

        } else if (type === 'edit-packages') {
            if (refreshServices) {
                try {
                    const freshData = await refreshServices();
                    setServiceConfig(freshData);
                    if (freshData && typeof freshData === 'object' && Object.keys(freshData).length > 0) {
                        setEditPackages(normalizePackages(freshData));
                    } else {
                        setEditPackages({});
                        alert('No service configuration found in database.');
                    }
                } catch (err) {
                    console.error('Error refreshing services:', err);
                    if (serviceConfig && typeof serviceConfig === 'object' && Object.keys(serviceConfig).length > 0) {
                        setEditPackages(normalizePackages(serviceConfig));
                    } else {
                        setEditPackages({});
                        alert('No service configuration found in database.');
                    }
                }
            } else {
                if (serviceConfig && typeof serviceConfig === 'object' && Object.keys(serviceConfig).length > 0) {
                    setEditPackages(normalizePackages(serviceConfig));
                } else {
                    setEditPackages({});
                    alert('No service configuration found in database.');
                }
            }

        } else if (type === 'blackout') {
            setEditBlackoutDates([...blackoutDates]);
            setNewBlackoutDate("");

        } else if (type === 'services-status') {
            setEditDisabledServices([...disableServices]);
        }

        setShowModal(true);
    };

    const handleFeeChange = (index, value) => {
        const numericValue = parseFloat(value);

        setEditFees((prev) =>
            prev.map((item, i) => {
                if (i === index) {
                    if (value === '') {
                        return { ...item, fee: 0 };
                    }
                    if (isNaN(numericValue)) {
                        return { ...item, fee: item.fee };
                    }
                    return { ...item, fee: Math.max(0, numericValue) };
                }
                return item;
            })
        );
    };

    const handleSaveFees = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const token = localStorage.getItem('token');

            const updateData = editFees.map(item => ({
                municipality_id: item.municipality_id,
                fee: typeof item.fee === 'string' ? parseFloat(item.fee) : Number(item.fee)
            }));

            await axios.put(
                'http://localhost:3001/api/municipalities',
                updateData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            await fetchDeliveryOptions(true);

            if (refreshMunicipalities) {
                const freshData = await refreshMunicipalities();
                setEditFees(freshData.map(item => ({
                    ...item,
                    fee: typeof item.fee === 'string' ? parseFloat(item.fee) : item.fee
                })));
            } else {
                setMunicipalities(editFees.map(item => ({
                    ...item,
                    fee: typeof item.fee === 'string' ? parseFloat(item.fee) : item.fee
                })));
            }

            setShowModal(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);

        } catch (err) {
            console.error("Error updating fees:", err);
            alert(`Failed to update fees: ${err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePackageChange = (brand, pkgIndex, field, value) => {
        setEditPackages((prev) => {
            const updated = { ...prev };

            if (!updated[brand]) {
                return prev;
            }

            if (field === "price") {
                const cleanValue = value.replace(/[₱,]/g, '');
                const numericValue = parseFloat(cleanValue);
                updated[brand].packages[pkgIndex].price = isNaN(numericValue) ? 0 : numericValue;
            } else {
                updated[brand].packages[pkgIndex][field] = value;
            }

            if (field === "name") {
                updated[brand].options[pkgIndex].label = value;
            }
            return updated;
        });
    };

    const handleSavePackages = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const token = localStorage.getItem('token');

            const cleanedPackages = JSON.parse(JSON.stringify(editPackages));
            Object.keys(cleanedPackages).forEach(brand => {
                cleanedPackages[brand].packages = cleanedPackages[brand].packages.map(pkg => ({
                    ...pkg,
                    price: `₱${pkg.price.toLocaleString()}`
                }));
            });

            await axios.put(
                'http://localhost:3001/api/services',
                cleanedPackages,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (refreshServices) {
                const freshData = await refreshServices();
                setServiceConfig(freshData);
                setEditPackages(normalizePackages(freshData));
            } else {
                setServiceConfig(cleanedPackages);
            }

            setShowModal(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            console.error("Error updating packages:", err);
            alert(`Failed to update packages: ${err.message}`);
        } finally {
            setIsSubmitting(false);
        }
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
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const handleToggleServiceStatus = (serviceName) => {
        setEditDisabledServices(prev => {
            if (prev.includes(serviceName)) {
                return prev.filter(name => name !== serviceName);
            } else {
                return [...prev, serviceName];
            }
        });
    };

    // ✅ UPDATED: May save sa database
    const handleSaveServicesStatus = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const token = localStorage.getItem('token');

            // ✅ Save to database
            const response = await axios.put(
                'http://localhost:3001/api/services/disabled',
                { disabledServices: editDisabledServices },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.data.success) {
                // ✅ Update state
                setDisableServices(editDisabledServices);
                setShowModal(false);
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);

                // ✅ Broadcast real-time update
                socket.emit('services-status-changed', {
                    disabledServices: editDisabledServices
                });
            }
        } catch (err) {
            console.error('Error saving services status:', err);
            alert('Failed to save. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <>
            <title>Settings</title>
            <h2 className="text-2xl font-bold text-lime-600 dark:text-lime-400 mb-4">Settings</h2>

            <div className="bg-bg-card border border-border rounded-lg overflow-hidden mb-6">
                <div className="bg-bg-header text-lime-600 dark:text-lime-400 px-4 py-3 font-semibold border-b border-border">Account</div>
                <div className="p-4 flex flex-col sm:flex-row gap-3">
                    <button className="flex-1 px-4 py-2 bg-bg-secondary border border-border hover:border-lime-500 rounded-lg text-text-primary text-sm font-semibold transition">✏️ Edit Profile</button>
                    <button className="flex-1 px-4 py-2 bg-lime-500 hover:bg-lime-400 rounded-lg text-black text-sm font-semibold transition">🔒 Change Password</button>
                </div>
            </div>

            <div className="bg-bg-card border border-border rounded-lg overflow-hidden mb-6">
                <div className="bg-bg-header text-lime-600 dark:text-lime-400 px-4 py-3 font-semibold border-b border-border">Notification Preferences</div>
                <div className="divide-y divide-border">
                    {[
                        { key: "newBooking", label: "New booking alerts" },
                        { key: "statusUpdates", label: "Booking status updates" },
                        { key: "promos", label: "Promos & announcements" },
                    ].map((item) => (
                        <div key={item.key} className="flex justify-between items-center px-4 py-3 text-sm">
                            <span className="text-text-primary">{item.label}</span>
                            <button
                                onClick={() => toggleNotification(item.key)}
                                className={`w-12 h-6 rounded-full relative transition-colors ${notifications[item.key] ? "bg-lime-500" : "bg-bg-secondary"}`}
                            >
                                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-black rounded-full transition-transform ${notifications[item.key] ? "translate-x-6" : "translate-x-0"}`} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-bg-card border border-border rounded-lg overflow-hidden mb-6">
                <div className="bg-bg-header text-lime-600 dark:text-lime-400 px-4 py-3 font-semibold border-b border-border">Appearance</div>
                <div className="p-4 flex gap-3">
                    {["light", "dark"].map((mode) => (
                        <button
                            key={mode}
                            onClick={() => setTheme(mode)}
                            className={`flex-1 px-4 py-2 rounded-lg text-sm font-semibold capitalize transition border ${theme === mode
                                ? "bg-lime-500 text-black border-lime-500"
                                : "bg-bg-secondary text-text-primary border-border hover:border-lime-500"
                                }`}
                        >
                            {mode} mode
                        </button>
                    ))}
                </div>
            </div>

            {currentUser?.role === "Admin" && (
                <div className="bg-bg-card border border-border rounded-lg overflow-hidden mb-6">
                    <div className="bg-bg-header text-lime-600 dark:text-lime-400 px-4 py-3 font-semibold border-b border-border">Booking & Pricing (Admin)</div>
                    <div className="divide-y divide-border text-sm">
                        <div className="flex justify-between items-center px-4 py-3">
                            <span className="text-text-primary">Manage delivery fees</span>
                            <button onClick={() => handleUpdate('edit-fees')} className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-lime-500 text-black hover:bg-lime-400 transition">Manage</button>
                        </div>
                        <div className="flex justify-between items-center px-4 py-3">
                            <span className="text-text-primary">Manage service rates & hero packages</span>
                            <button onClick={() => handleUpdate('edit-packages')} className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-lime-500 text-black hover:bg-lime-400 transition">Manage</button>
                        </div>
                        <div className="flex justify-between items-center px-4 py-3">
                            <span className="text-text-primary">Service Activation / Status</span>
                            <button onClick={() => handleUpdate('services-status')} className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-lime-500 text-black hover:bg-lime-400 transition">Manage</button>
                        </div>
                        <div className="flex justify-between items-center px-4 py-3">
                            <span className="text-text-primary">Blackout dates / availability</span>
                            <button onClick={() => handleUpdate('blackout')} className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-lime-500 text-black hover:bg-lime-400 transition">Manage</button>
                        </div>
                    </div>
                </div>
            )}

            <form onSubmit={handleSave}>
                <button type="submit" className="px-6 py-2 bg-lime-500 hover:bg-lime-400 text-black font-semibold text-sm rounded-lg transition">Save Changes</button>
                {saved && <span className="ml-3 text-green-400 text-xs">✅ Settings saved.</span>}
            </form>

            {showModal && (
                <div
                    className="fixed inset-0 z-[1050] flex items-center justify-center p-4"
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        backdropFilter: 'blur(8px)',
                        zIndex: 1050,
                    }}
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl"
                        style={{
                            backgroundColor: 'var(--bg-modal, #ffffff)',
                            color: 'var(--text-primary, #0f172a)',
                            border: '1px solid var(--border, #e2e8f0)',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {modalType === "edit-fees" && (
                            <form onSubmit={handleSaveFees} className="p-6">
                                <div className="flex justify-between items-center mb-4 pb-3 border-b" style={{ borderColor: 'var(--border, #e2e8f0)' }}>
                                    <h3 className="text-lg font-bold text-lime-500 dark:text-lime-400">💰 Edit Delivery Fees</h3>
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="p-1 rounded-lg transition-colors hover:bg-bg-hover"
                                        style={{ color: 'var(--text-muted, #94a3b8)' }}
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2 hide-scrollbar">
                                    {editFees.map((item, index) => (
                                        <div key={item.municipality_id || index} className="flex items-center justify-between gap-3 p-2 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary, #f8fafc)' }}>
                                            <label className="text-sm flex-1 font-medium" style={{ color: 'var(--text-primary, #0f172a)' }}>{item.municipality}</label>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs" style={{ color: 'var(--text-muted, #94a3b8)' }}>₱</span>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="1"
                                                    value={item.fee || 0}
                                                    onChange={(e) => handleFeeChange(index, e.target.value)}
                                                    className="w-28 px-3 py-1.5 rounded-lg border text-sm focus:border-lime-500 focus:outline-none focus:ring-2 focus:ring-lime-500/20"
                                                    style={{
                                                        backgroundColor: 'var(--bg-input, #ffffff)',
                                                        borderColor: 'var(--border, #e2e8f0)',
                                                        color: 'var(--text-primary, #0f172a)',
                                                    }}
                                                    disabled={isSubmitting}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-2 mt-6 pt-4 border-t" style={{ borderColor: 'var(--border, #e2e8f0)' }}>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2.5 bg-lime-500 hover:bg-lime-600 text-black font-semibold rounded-lg transition disabled:opacity-50 text-sm"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Saving...' : '💾 Save Fees'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 px-4 py-2.5 font-semibold rounded-lg transition text-sm"
                                        style={{
                                            backgroundColor: 'var(--bg-secondary, #f8fafc)',
                                            border: '1px solid var(--border, #e2e8f0)',
                                            color: 'var(--text-primary, #0f172a)',
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}

                        {modalType === "edit-packages" && (
                            <form onSubmit={handleSavePackages} className="p-6">
                                <div className="flex justify-between items-center mb-4 pb-3 border-b" style={{ borderColor: 'var(--border, #e2e8f0)' }}>
                                    <h3 className="text-lg font-bold text-lime-500 dark:text-lime-400">📦 Edit Service Packages</h3>
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="p-1 rounded-lg transition-colors hover:bg-bg-hover"
                                        style={{ color: 'var(--text-muted, #94a3b8)' }}
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="space-y-6 max-h-[50vh] overflow-y-auto pr-2 hide-scrollbar">
                                    {editPackages && Object.keys(editPackages).length > 0 ? (
                                        Object.keys(editPackages).map((brand) => (
                                            <div key={brand} className="border rounded-xl p-4" style={{ borderColor: 'var(--border, #e2e8f0)', backgroundColor: 'var(--bg-secondary, #f8fafc)' }}>
                                                <h4 className="text-sm font-bold text-lime-500 dark:text-lime-400 mb-3 uppercase border-b pb-2" style={{ borderColor: 'var(--border, #e2e8f0)' }}>{brand}</h4>
                                                <div className="space-y-4">
                                                    {editPackages[brand]?.packages?.map((pkg, i) => (
                                                        <div key={i} className="p-4 rounded-lg space-y-3 border" style={{ backgroundColor: 'var(--bg-input, #ffffff)', borderColor: 'var(--border, #e2e8f0)' }}>
                                                            <div className="grid grid-cols-2 gap-3">
                                                                <div>
                                                                    <label className="text-[10px] block uppercase font-bold mb-1" style={{ color: 'var(--text-muted, #94a3b8)' }}>Package Name</label>
                                                                    <input
                                                                        type="text"
                                                                        value={pkg.name || ''}
                                                                        onChange={(e) => handlePackageChange(brand, i, "name", e.target.value)}
                                                                        className="w-full px-3 py-2 rounded-lg border text-sm focus:border-lime-500 focus:outline-none focus:ring-2 focus:ring-lime-500/20"
                                                                        style={{
                                                                            backgroundColor: 'var(--bg-card, #ffffff)',
                                                                            borderColor: 'var(--border, #e2e8f0)',
                                                                            color: 'var(--text-primary, #0f172a)',
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="text-[10px] block uppercase font-bold mb-1" style={{ color: 'var(--text-muted, #94a3b8)' }}>Price</label>
                                                                    <input
                                                                        type="number"
                                                                        min="0"
                                                                        step="0.01"
                                                                        value={pkg.price || 0}
                                                                        onChange={(e) => handlePackageChange(brand, i, "price", e.target.value)}
                                                                        className="w-full px-3 py-2 rounded-lg border text-sm focus:border-lime-500 focus:outline-none focus:ring-2 focus:ring-lime-500/20"
                                                                        style={{
                                                                            backgroundColor: 'var(--bg-card, #ffffff)',
                                                                            borderColor: 'var(--border, #e2e8f0)',
                                                                            color: 'var(--text-primary, #0f172a)',
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <label className="text-[10px] block uppercase font-bold mb-1" style={{ color: 'var(--text-muted, #94a3b8)' }}>Details</label>
                                                                <input
                                                                    type="text"
                                                                    value={pkg.details || ''}
                                                                    onChange={(e) => handlePackageChange(brand, i, "details", e.target.value)}
                                                                    className="w-full px-3 py-2 rounded-lg border text-sm focus:border-lime-500 focus:outline-none focus:ring-2 focus:ring-lime-500/20"
                                                                    style={{
                                                                        backgroundColor: 'var(--bg-card, #ffffff)',
                                                                        borderColor: 'var(--border, #e2e8f0)',
                                                                        color: 'var(--text-primary, #0f172a)',
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8" style={{ color: 'var(--text-muted, #94a3b8)' }}>No packages available.</div>
                                    )}
                                </div>
                                <div className="flex gap-2 mt-6 pt-4 border-t" style={{ borderColor: 'var(--border, #e2e8f0)' }}>
                                    <button type="submit" className="flex-1 px-4 py-2.5 bg-lime-500 hover:bg-lime-600 text-black font-semibold rounded-lg transition text-sm">💾 Save All Packages</button>
                                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 font-semibold rounded-lg transition text-sm" style={{ backgroundColor: 'var(--bg-secondary, #f8fafc)', border: '1px solid var(--border, #e2e8f0)', color: 'var(--text-primary, #0f172a)' }}>Cancel</button>
                                </div>
                            </form>
                        )}

                        {modalType === "services-status" && (
                            <form onSubmit={handleSaveServicesStatus} className="p-6">
                                <div className="flex justify-between items-center mb-4 pb-3 border-b border-zinc-700">
                                    <h3 className="text-lg font-bold text-lime-500">⚡ Service Availability</h3>
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="p-1 rounded-lg transition-colors hover:bg-zinc-700 text-zinc-400"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <p className="text-xs mb-4 text-zinc-400">
                                    Toggle off a service to disable it.
                                    <span className="text-amber-400 ml-1">Disabled services will show as "🚫 Unavailable" to users.</span>
                                </p>

                                <div className="divide-y border rounded-xl border-zinc-700 bg-zinc-800/30">
                                    {ALL_SERVICES.map((serviceName) => {
                                        const isDisabled = editDisabledServices.includes(serviceName);
                                        const isActive = !isDisabled;
                                        const bookingCount = 0;

                                        return (
                                            <div key={serviceName} className="flex justify-between items-center px-4 py-4">
                                                <div>
                                                    <span className={`text-sm font-bold block ${isDisabled ? 'text-zinc-500 line-through' : 'text-white'}`}>
                                                        {serviceName}
                                                    </span>
                                                    <span className={`text-[11px] font-medium ${isActive ? "text-green-500" : "text-red-500"}`}>
                                                        {isActive ? "● Active" : "○ Disabled"}
                                                    </span>
                                                    <span className="text-[10px] text-zinc-500 ml-2">
                                                        ({bookingCount} booking{bookingCount !== 1 ? 's' : ''})
                                                    </span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleToggleServiceStatus(serviceName)}
                                                    className={`w-12 h-6 rounded-full relative transition-colors duration-200 focus:outline-none ${isActive ? "bg-lime-500" : "bg-zinc-600"
                                                        }`}
                                                >
                                                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${isActive ? "translate-x-6" : "translate-x-0"
                                                        }`} />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="flex gap-2 mt-6 pt-4 border-t border-zinc-700">
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2.5 bg-lime-500 hover:bg-lime-600 text-black font-semibold rounded-lg transition text-sm"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Saving...' : '💾 Save'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 px-4 py-2.5 bg-zinc-800 border border-zinc-700 text-white font-semibold rounded-lg hover:bg-zinc-700 transition text-sm"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}
                        {modalType === "blackout" && (
                            <form onSubmit={handleSaveBlackoutDates} className="p-6">
                                <div className="flex justify-between items-center mb-4 pb-3 border-b" style={{ borderColor: 'var(--border, #e2e8f0)' }}>
                                    <h3 className="text-lg font-bold text-lime-500 dark:text-lime-400">🚫 Blackout Dates</h3>
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="p-1 rounded-lg transition-colors hover:bg-bg-hover"
                                        style={{ color: 'var(--text-muted, #94a3b8)' }}
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="flex gap-2 mb-4">
                                    <input
                                        type="date"
                                        value={newBlackoutDate}
                                        onChange={(e) => setNewBlackoutDate(e.target.value)}
                                        className="flex-1 px-3 py-2 rounded-lg border text-sm focus:border-lime-500 focus:outline-none focus:ring-2 focus:ring-lime-500/20"
                                        style={{
                                            backgroundColor: 'var(--bg-input, #ffffff)',
                                            borderColor: 'var(--border, #e2e8f0)',
                                            color: 'var(--text-primary, #0f172a)',
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddBlackoutDate}
                                        className="px-4 py-2 bg-lime-500 hover:bg-lime-600 text-black text-sm font-bold rounded-lg transition"
                                    >
                                        ➕ Block Date
                                    </button>
                                </div>
                                <div className="border rounded-xl p-3 max-h-[35vh] overflow-y-auto space-y-2" style={{ borderColor: 'var(--border, #e2e8f0)', backgroundColor: 'var(--bg-secondary, #f8fafc)' }}>
                                    {editBlackoutDates.length > 0 ? (
                                        editBlackoutDates.map((date) => (
                                            <div key={date} className="flex justify-between items-center px-3 py-2 rounded-lg border" style={{ backgroundColor: 'var(--bg-input, #ffffff)', borderColor: 'var(--border, #e2e8f0)' }}>
                                                <span className="text-sm font-mono font-bold" style={{ color: 'var(--text-primary, #0f172a)' }}>🗓️ {date}</span>
                                                <button type="button" onClick={() => handleRemoveBlackoutDate(date)} className="text-red-500 text-xs font-semibold px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-500/10 transition">🗑️ Remove</button>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-4" style={{ color: 'var(--text-muted, #94a3b8)' }}>No blackout dates set.</div>
                                    )}
                                </div>
                                <div className="flex gap-2 mt-6 pt-4 border-t" style={{ borderColor: 'var(--border, #e2e8f0)' }}>
                                    <button type="submit" className="flex-1 px-4 py-2.5 bg-lime-500 hover:bg-lime-600 text-black font-semibold rounded-lg transition text-sm">💾 Save Blackout Dates</button>
                                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 font-semibold rounded-lg transition text-sm" style={{ backgroundColor: 'var(--bg-secondary, #f8fafc)', border: '1px solid var(--border, #e2e8f0)', color: 'var(--text-primary, #0f172a)' }}>Cancel</button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};