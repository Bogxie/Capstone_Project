import { useState } from "react";
import { useAuth } from "../context/useAuth";

export const UserProfile = () => {
    const { currentUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        username: currentUser?.username || "",
        email: currentUser?.email || "",
        phone: currentUser?.phone || "+63 912 345 6789",
        bio: currentUser?.bio || "Customer since 2024",
        location: currentUser?.location || "Cavite, Philippines"
    });
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [successMessage, setSuccessMessage] = useState("");
    const [avatar, setAvatar] = useState(currentUser?.profile || "https://via.placeholder.com/150");

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    // Handle profile update
    const handleUpdateProfile = (e) => {
        e.preventDefault();
        setIsEditing(false);
        setSuccessMessage("✅ Profile updated successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
    };

    // Handle password change
    const handlePasswordChange = (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert("❌ New passwords do not match!");
            return;
        }
        setShowPasswordModal(false);
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setSuccessMessage("✅ Password changed successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
    };

    // Handle avatar change
    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result);
                setSuccessMessage("✅ Profile picture updated!");
                setTimeout(() => setSuccessMessage(""), 3000);
            };
            reader.readAsDataURL(file);
        }
    };

    // Stats data
    const stats = [
        { label: "Total Bookings", value: "12", icon: "📅" },
        { label: "Completed", value: "8", icon: "✅" },
        { label: "Pending", value: "3", icon: "⏳" },
        { label: "Cancelled", value: "1", icon: "❌" },
    ];

    return (
        <div className="p-2 sm:p-4 max-w-4xl mx-auto">
            {/* Success Message */}
            {successMessage && (
                <div className="bg-green-500/20 border border-green-500/30 text-green-400 px-4 py-2 rounded-lg mb-4 text-sm">
                    {successMessage}
                </div>
            )}

            {/* Profile Header */}
            <div className="bg-gray-900 border border-yellow-500/30 rounded-xl overflow-hidden mb-6">
                <div className="bg-gradient-to-r from-yellow-500/20 to-transparent px-4 sm:px-6 py-4 sm:py-6">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                        {/* Avatar */}
                        <div className="relative group">
                            <img
                                src={avatar}
                                alt="Profile"
                                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-yellow-400 object-cover"
                            />
                            <label 
                                htmlFor="avatar-upload"
                                className="absolute bottom-0 right-0 bg-yellow-500 rounded-full p-1 cursor-pointer hover:bg-yellow-600 transition"
                            >
                                <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                            </label>
                            <input
                                id="avatar-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleAvatarChange}
                            />
                        </div>

                        {/* User Info */}
                        <div className="text-center sm:text-left flex-1">
                            <h2 className="text-xl sm:text-2xl font-bold text-white">
                                {profileData.fullName || profileData.username}
                            </h2>
                            <p className="text-gray-400 text-sm">@{profileData.username}</p>
                            <p className="text-yellow-400 text-xs sm:text-sm">{currentUser?.role || "User"}</p>
                            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2">
                                <span className="px-2 py-1 bg-gray-800 rounded-full text-xs text-gray-300">
                                    📧 {profileData.email}
                                </span>
                                <span className="px-2 py-1 bg-gray-800 rounded-full text-xs text-gray-300">
                                    📱 {profileData.phone}
                                </span>
                            </div>
                        </div>

                        {/* Edit Button */}
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="w-full sm:w-auto px-4 py-2 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-600 transition text-sm"
                        >
                            {isEditing ? "Cancel" : "✏️ Edit Profile"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-gray-900 border border-yellow-500/30 rounded-lg p-3 sm:p-4 text-center">
                        <div className="text-2xl sm:text-3xl mb-1">{stat.icon}</div>
                        <div className="text-lg sm:text-xl font-bold text-white">{stat.value}</div>
                        <div className="text-xs text-gray-400">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Profile Details */}
            <div className="bg-gray-900 border border-yellow-500/30 rounded-xl overflow-hidden">
                <div className="bg-black text-yellow-400 px-4 sm:px-6 py-3 font-semibold text-sm sm:text-base">
                    Profile Details
                </div>
                <div className="p-4 sm:p-6">
                    {isEditing ? (
                        // Edit Form
                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={profileData.fullName}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 bg-black border border-gray-700 rounded-lg text-white focus:border-yellow-500 focus:outline-none text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Username</label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={profileData.username}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 bg-black border border-gray-700 rounded-lg text-white focus:border-yellow-500 focus:outline-none text-sm"
                                        disabled
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={profileData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 bg-black border border-gray-700 rounded-lg text-white focus:border-yellow-500 focus:outline-none text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Phone</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={profileData.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 bg-black border border-gray-700 rounded-lg text-white focus:border-yellow-500 focus:outline-none text-sm"
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-sm text-gray-400 mb-1">Location</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={profileData.location}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 bg-black border border-gray-700 rounded-lg text-white focus:border-yellow-500 focus:outline-none text-sm"
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-sm text-gray-400 mb-1">Bio</label>
                                    <textarea
                                        name="bio"
                                        value={profileData.bio}
                                        onChange={handleInputChange}
                                        rows="3"
                                        className="w-full px-3 py-2 bg-black border border-gray-700 rounded-lg text-white focus:border-yellow-500 focus:outline-none text-sm resize-none"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <button
                                    type="submit"
                                    className="w-full sm:w-auto px-6 py-2 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-600 transition text-sm"
                                >
                                    💾 Save Changes
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="w-full sm:w-auto px-6 py-2 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        // View Mode
                        <div className="space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs text-gray-500">Full Name</label>
                                    <p className="text-white text-sm sm:text-base">{profileData.fullName}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500">Username</label>
                                    <p className="text-white text-sm sm:text-base">@{profileData.username}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500">Email</label>
                                    <p className="text-white text-sm sm:text-base">{profileData.email}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500">Phone</label>
                                    <p className="text-white text-sm sm:text-base">{profileData.phone}</p>
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="text-xs text-gray-500">Location</label>
                                    <p className="text-white text-sm sm:text-base">{profileData.location}</p>
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="text-xs text-gray-500">Bio</label>
                                    <p className="text-white text-sm sm:text-base">{profileData.bio}</p>
                                </div>
                            </div>

                            {/* Change Password Button */}
                            <div className="pt-4 border-t border-gray-800">
                                <button
                                    onClick={() => setShowPasswordModal(true)}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition"
                                >
                                    🔒 Change Password
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ===== CHANGE PASSWORD MODAL ===== */}
            {showPasswordModal && (
                <div className="fixed inset-0 z-[1050] flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-4">
                    <div className="bg-gray-900 border border-yellow-500 rounded-lg w-full max-w-md p-4 sm:p-6">
                        <h3 className="text-yellow-400 font-semibold text-base sm:text-lg mb-4">🔒 Change Password</h3>
                        <form onSubmit={handlePasswordChange}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Current Password</label>
                                    <input
                                        type="password"
                                        value={passwordData.currentPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                        className="w-full px-3 py-2 bg-black border border-gray-700 rounded-lg text-white focus:border-yellow-500 focus:outline-none text-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">New Password</label>
                                    <input
                                        type="password"
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                        className="w-full px-3 py-2 bg-black border border-gray-700 rounded-lg text-white focus:border-yellow-500 focus:outline-none text-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Confirm New Password</label>
                                    <input
                                        type="password"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                        className="w-full px-3 py-2 bg-black border border-gray-700 rounded-lg text-white focus:border-yellow-500 focus:outline-none text-sm"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2 mt-6">
                                <button
                                    type="submit"
                                    className="w-full sm:flex-1 py-2 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-600 transition text-sm"
                                >
                                    Update Password
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordModal(false)}
                                    className="w-full sm:flex-1 py-2 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};