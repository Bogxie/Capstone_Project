import { useState } from "react";
import { useAuth } from "../context/useAuth";
import { useService } from "../context/useService";
import { useTheme } from "../context/useTheme";
import { fetchDeliveryOptions } from "../assets/utils/deliveryOptions";
import { socket } from "../services/socket";
import { EditFeesModal } from "./modals/EditFeesModal";
import { EditPackagesModal } from "./modals/EditPackagesModal";
import { ServiceStatusModal } from "./modals/ServiceStatusModal";
import { BlackoutModal } from "./modals/BlackoutModal";

export const Settings = () => {

    const {
        municipalities,
        serviceConfig,
        disableServices,
        blackoutDates,
        refreshMunicipalities,
        refreshServices,
        refreshBlackoutDates,
        updateMunicipalities,
        updateServices,
        updateDisable,
        updateBlackoutDates,
    } = useService();

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
            try {
                const freshData = await refreshMunicipalities();
                if (Array.isArray(freshData) && freshData.length > 0) {
                    setEditFees(freshData.map((item) => ({
                        municipality_id: item.municipality_id,
                        municipality: item.municipality,
                        fee: typeof item.fee === 'string' ? parseFloat(item.fee) : item.fee
                    })));
                } else {
                    setEditFees(municipalities.map((item) => ({
                        municipality_id: item.municipality_id,
                        municipality: item.municipality,
                        fee: typeof item.fee === 'string' ? parseFloat(item.fee) : item.fee
                    })));
                }
            } catch (err) {
                console.error('Error refreshing municipalities:', err);
                setEditFees(municipalities.map((item) => ({
                    municipality_id: item.municipality_id,
                    municipality: item.municipality,
                    fee: typeof item.fee === 'string' ? parseFloat(item.fee) : item.fee
                })));
            }

        } else if (type === 'edit-packages') {
            try {
                const freshData = await refreshServices();
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

        } else if (type === 'blackout') {
            try {
                const freshData = await refreshBlackoutDates();

                if (Array.isArray(freshData)) {
                    setEditBlackoutDates([...freshData].sort());
                } else {
                    setEditBlackoutDates([...blackoutDates].sort());
                }

                setNewBlackoutDate("");
            } catch (err) {
                console.error("Error refreshing blackout dates:", err);

                // Fallback to current React Query data
                setEditBlackoutDates([...blackoutDates].sort());
                setNewBlackoutDate("");
            }

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
            const updateData = editFees.map(item => ({
                municipality_id: item.municipality_id,
                fee: typeof item.fee === 'string' ? parseFloat(item.fee) : Number(item.fee)
            }));

            await updateMunicipalities(updateData);
            await fetchDeliveryOptions(true);

            const freshData = await refreshMunicipalities();
            if (Array.isArray(freshData)) {
                setEditFees(freshData.map(item => ({
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
            const cleanedPackages = JSON.parse(JSON.stringify(editPackages));
            Object.keys(cleanedPackages).forEach(brand => {
                cleanedPackages[brand].packages = cleanedPackages[brand].packages.map(pkg => ({
                    ...pkg,
                    price: `₱${pkg.price.toLocaleString()}`
                }));
            });

            await updateServices(cleanedPackages);
            const freshData = await refreshServices();
            if (freshData && typeof freshData === 'object' && Object.keys(freshData).length > 0) {
                setEditPackages(normalizePackages(freshData));
            } else {
                console.warn('No fresh data received, keeping current state');
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

    const handleSaveBlackoutDates = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await updateBlackoutDates(editBlackoutDates);
            setShowModal(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            console.error("Error saving blackout dates:", err);
            alert("Failed to save blackout dates. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
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

    const handleSaveServicesStatus = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await updateDisable(editDisabledServices);
            setShowModal(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
            socket.emit('services-status-changed', {
                disabledServices: editDisabledServices
            });
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
            <h2 className="text-2xl font-bold text-[#b6ff2e] mb-4">Settings</h2>

            {/* Account */}
            <div className="bg-[#2d303a] border border-[#3a3d48] rounded-lg overflow-hidden mb-6">
                <div className="bg-[#23262f] text-[#b6ff2e] px-4 py-3 font-semibold border-b border-[#3a3d48]">Account</div>
                <div className="p-4 flex flex-col sm:flex-row gap-3">
                    <button className="flex-1 px-4 py-2 bg-[#23262f] border border-[#3a3d48] hover:border-[#b6ff2e] rounded-lg text-white text-sm font-semibold transition">✏️ Edit Profile</button>
                    <button className="flex-1 px-4 py-2 bg-[#b6ff2e] hover:bg-[#a3e829] text-[#23262f] rounded-lg text-sm font-semibold transition">🔒 Change Password</button>
                </div>
            </div>

            {/* Notification Preferences */}
            <div className="bg-[#2d303a] border border-[#3a3d48] rounded-lg overflow-hidden mb-6">
                <div className="bg-[#23262f] text-[#b6ff2e] px-4 py-3 font-semibold border-b border-[#3a3d48]">Notification Preferences</div>
                <div className="divide-y divide-[#3a3d48]">
                    {[
                        { key: "newBooking", label: "New booking alerts" },
                        { key: "statusUpdates", label: "Booking status updates" },
                        { key: "promos", label: "Promos & announcements" },
                    ].map((item) => (
                        <div key={item.key} className="flex justify-between items-center px-4 py-3 text-sm">
                            <span className="text-white">{item.label}</span>
                            <button
                                onClick={() => toggleNotification(item.key)}
                                className={`w-12 h-6 rounded-full relative transition-colors ${notifications[item.key] ? "bg-[#b6ff2e]" : "bg-[#23262f]"}`}
                            >
                                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${notifications[item.key] ? "translate-x-6" : "translate-x-0"}`} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Appearance */}
            <div className="bg-[#2d303a] border border-[#3a3d48] rounded-lg overflow-hidden mb-6">
                <div className="bg-[#23262f] text-[#b6ff2e] px-4 py-3 font-semibold border-b border-[#3a3d48]">Appearance</div>
                <div className="p-4 flex gap-3">
                    {["light", "dark"].map((mode) => (
                        <button
                            key={mode}
                            onClick={() => setTheme(mode)}
                            className={`flex-1 px-4 py-2 rounded-lg text-sm font-semibold capitalize transition border ${theme === mode
                                ? "bg-[#b6ff2e] text-[#23262f] border-[#b6ff2e]"
                                : "bg-[#23262f] text-white border-[#3a3d48] hover:border-[#b6ff2e]"
                                }`}
                        >
                            {mode} mode
                        </button>
                    ))}
                </div>
            </div>

            {/* Admin Settings */}
            {currentUser?.role === "Admin" && (
                <div className="bg-[#2d303a] border border-[#3a3d48] rounded-lg overflow-hidden mb-6">
                    <div className="bg-[#23262f] text-[#b6ff2e] px-4 py-3 font-semibold border-b border-[#3a3d48]">Booking & Pricing (Admin)</div>
                    <div className="divide-y divide-[#3a3d48] text-sm">
                        <div className="flex justify-between items-center px-4 py-3">
                            <span className="text-white">Manage delivery fees</span>
                            <button onClick={() => handleUpdate('edit-fees')} className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#b6ff2e] text-[#23262f] hover:bg-[#a3e829] transition">Manage</button>
                        </div>
                        <div className="flex justify-between items-center px-4 py-3">
                            <span className="text-white">Manage service rates & hero packages</span>
                            <button onClick={() => handleUpdate('edit-packages')} className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#b6ff2e] text-[#23262f] hover:bg-[#a3e829] transition">Manage</button>
                        </div>
                        <div className="flex justify-between items-center px-4 py-3">
                            <span className="text-white">Service Activation / Status</span>
                            <button onClick={() => handleUpdate('services-status')} className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#b6ff2e] text-[#23262f] hover:bg-[#a3e829] transition">Manage</button>
                        </div>
                        <div className="flex justify-between items-center px-4 py-3">
                            <span className="text-white">Blackout dates / availability</span>
                            <button onClick={() => handleUpdate('blackout')} className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#b6ff2e] text-[#23262f] hover:bg-[#a3e829] transition">Manage</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Save Button */}
            <form onSubmit={handleSave}>
                <button type="submit" className="px-6 py-2 bg-[#b6ff2e] hover:bg-[#a3e829] text-[#23262f] font-semibold text-sm rounded-lg transition">Save Changes</button>
                {saved && <span className="ml-3 text-green-400 text-xs">✅ Settings saved.</span>}
            </form>

            {/* Modals */}
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
                            backgroundColor: '#2d303a',
                            color: '#ffffff',
                            border: '1px solid #3a3d48',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* edit-fees */}
                        {modalType === "edit-fees" && (
                            <EditFeesModal
                                handleSaveFees={handleSaveFees}
                                setShowModal={setShowModal}
                                editFees={editFees}
                                handleFeeChange={handleFeeChange}
                                isSubmitting={isSubmitting}
                            />
                        )}

                        {/* edit-packages */}
                        {modalType === "edit-packages" && (
                            <EditPackagesModal
                                handleSavePackages={handleSavePackages}
                                setShowModal={setShowModal}
                                editPackages={editPackages}
                                handlePackageChange={handlePackageChange}
                            />
                        )}

                        {/* services-status */}
                        {modalType === "services-status" && (
                            <ServiceStatusModal
                                handleSaveServicesStatus={handleSaveServicesStatus}
                                setShowModal={setShowModal}
                                editDisabledServices={editDisabledServices}
                                handleToggleServiceStatus={handleToggleServiceStatus}
                                isSubmitting={isSubmitting}
                            />
                        )}

                        {/* blackout */}
                        {modalType === "blackout" && (
                            <BlackoutModal
                                handleSaveBlackoutDates={handleSaveBlackoutDates}
                                setShowModal={setShowModal}
                                newBlackoutDate={newBlackoutDate}
                                setNewBlackoutDate={setNewBlackoutDate}
                                handleAddBlackoutDate={handleAddBlackoutDate}
                                editBlackoutDates={editBlackoutDates}
                                handleRemoveBlackoutDate={handleRemoveBlackoutDate}
                                isSubmitting={isSubmitting}
                            />
                        )}
                    </div>
                </div>
            )}
        </>
    );
};