import { useState } from "react";
import { useUser } from '../context/useUser.js';

export const ManageUsers = () => {
    // ✅ React Query na!
    const { users, loading, createUser, updateUser, deleteUser } = useUser();

    const [searchTerm, setSearchTerm] = useState("");
    const [filterRole, setFilterRole] = useState("All");
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [editFormData, setEditFormData] = useState({
        username: "",
        email: "",
        role: "User",
        status: "Active"
    });
    const [successMessage, setSuccessMessage] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [newUserData, setNewUserData] = useState({
        username: "",
        email: "",
        password: "",
        role: "User",
        status: "Active"
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // ✅ Wala nang fetchUsers at useEffect!

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === "All" || user.role === filterRole;
        return matchesSearch && matchesRole;
    });

    const handleEditClick = (user) => {
        setSelectedUser(user);
        setEditFormData({
            username: user.username,
            email: user.email,
            role: user.role,
            status: user.status || "Active"
        });
        setShowEditModal(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await updateUser(selectedUser.id, editFormData);
            setShowEditModal(false);
            setSuccessMessage(`✅ User ${editFormData.username} updated successfully!`);
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (err) {
            console.error('Error updating user:', err);
            alert('Failed to update user. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteClick = (user) => {
        setSelectedUser(user);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        setIsSubmitting(true);
        try {
            await deleteUser(selectedUser.id);
            setShowDeleteModal(false);
            setSuccessMessage(`✅ User ${selectedUser.username} deleted successfully!`);
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (err) {
            console.error('Error deleting user:', err);
            alert('Failed to delete user. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await createUser(newUserData);
            setShowAddModal(false);
            setNewUserData({ username: "", email: "", password: "", role: "User", status: "Active" });
            setSuccessMessage(`✅ New user added successfully!`);
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (err) {
            console.error('Error adding user:', err);
            alert('Failed to add user. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            Active: "bg-green-500/20 text-green-400 border border-green-500/30",
            Inactive: "bg-red-500/20 text-red-400 border border-red-500/30",
            Suspended: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
        };
        return styles[status] || styles.Active;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <div className="h-8 w-8 border-4 border-[#b6ff2e] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-zinc-400 text-sm">Loading users...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-2 sm:p-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-[#b6ff2e]">Manage Users</h2>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="w-full sm:w-auto px-4 py-2 bg-[#b6ff2e] hover:bg-[#a3e829] text-[#23262f] font-semibold rounded-lg transition text-sm sm:text-base"
                >
                    ➕ Add User
                </button>
            </div>

            {/* Success Message */}
            {successMessage && (
                <div className="bg-green-500/20 border border-green-500/30 text-green-400 px-3 sm:px-4 py-2 rounded-lg mb-4 text-sm">
                    {successMessage}
                </div>
            )}

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4 sm:mb-6">
                <input
                    type="text"
                    placeholder="🔍 Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 bg-[#23262f] border border-[#3a3d48] rounded-lg text-white placeholder-zinc-500 focus:border-[#b6ff2e] focus:outline-none text-sm"
                />
                <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-[#23262f] border border-[#3a3d48] rounded-lg text-white focus:border-[#b6ff2e] focus:outline-none text-sm"
                >
                    <option value="All">All Roles</option>
                    <option value="Admin">Admin</option>
                    <option value="User">User</option>
                </select>
            </div>

            {/* Users Table */}
            <div className="bg-[#2d303a] border border-[#3a3d48] rounded-xl overflow-hidden">
                {/* Mobile View */}
                <div className="block sm:hidden divide-y divide-[#3a3d48]">
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                            <div key={user.id} className="p-4 hover:bg-[#23262f] transition">
                                <div className="flex items-center gap-3 mb-2">
                                    <img
                                        src={user.profile || "https://via.placeholder.com/40"}
                                        alt={user.username}
                                        className="w-10 h-10 rounded-full border border-[#b6ff2e]/30"
                                    />
                                    <div className="flex-1">
                                        <div className="text-white font-medium">{user.username}</div>
                                        <div className="text-zinc-400 text-xs">{user.email}</div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div>
                                        <span className="text-zinc-500">Role:</span>
                                        <span className={`ml-1 px-2 py-0.5 rounded text-xs font-semibold ${user.role === "Admin"
                                            ? "bg-purple-500/20 text-purple-400"
                                            : "bg-blue-500/20 text-blue-400"
                                            }`}>
                                            {user.role}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-zinc-500">Status:</span>
                                        <span className={`ml-1 px-2 py-0.5 rounded text-xs font-semibold ${getStatusBadge(user.status)}`}>
                                            {user.status}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-zinc-500">Joined:</span>
                                        <span className="ml-1 text-zinc-300">{user.joinedDate || 'N/A'}</span>
                                    </div>
                                    <div className="flex gap-1 justify-end">
                                        <button
                                            onClick={() => handleEditClick(user)}
                                            className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded transition"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(user)}
                                            className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded transition"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="px-4 py-8 text-center text-zinc-500 text-sm">
                            No users found matching your criteria.
                        </div>
                    )}
                </div>

                {/* Desktop View */}
                <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-[#23262f] text-zinc-400 border-b border-[#3a3d48]">
                            <tr>
                                <th className="px-4 py-3 text-left">User</th>
                                <th className="px-4 py-3 text-left">Email</th>
                                <th className="px-4 py-3 text-left">Role</th>
                                <th className="px-4 py-3 text-left">Status</th>
                                <th className="px-4 py-3 text-left">Joined</th>
                                <th className="px-4 py-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#3a3d48]">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-[#23262f] transition">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={user.profile || "https://via.placeholder.com/40"}
                                                    alt={user.username}
                                                    className="w-8 h-8 rounded-full border border-[#b6ff2e]/30"
                                                />
                                                <span className="text-white font-medium">{user.username}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-zinc-300">{user.email}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded text-xs font-semibold ${user.role === "Admin"
                                                ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                                                : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusBadge(user.status)}`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-zinc-500 text-xs">{user.joinedDate || 'N/A'}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => handleEditClick(user)}
                                                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded transition"
                                                >
                                                    ✏️ Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(user)}
                                                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded transition"
                                                >
                                                    🗑️ Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-4 py-8 text-center text-zinc-500">
                                        No users found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Stats */}
            <div className="mt-4 flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-zinc-400">
                <span>Total: <strong className="text-white">{users.length}</strong></span>
                <span>Active: <strong className="text-green-400">{users.filter(u => u.status === "Active").length}</strong></span>
                <span>Admins: <strong className="text-purple-400">{users.filter(u => u.role === "Admin").length}</strong></span>
            </div>

            {/* ===== EDIT MODAL ===== */}
            {showEditModal && selectedUser && (
                <div className="fixed inset-0 z-[1050] flex items-center justify-center bg-[#23262f]/95 p-2 sm:p-4">
                    <div className="bg-[#2d303a] border border-[#3a3d48] rounded-xl w-full max-w-md p-4 sm:p-6 max-h-[90vh] overflow-y-auto shadow-2xl">
                        <h3 className="text-[#b6ff2e] font-semibold text-base sm:text-lg mb-4">✏️ Edit User</h3>
                        <form onSubmit={handleEditSubmit}>
                            <div className="space-y-3 sm:space-y-4">
                                <div>
                                    <label className="block text-sm text-zinc-400 mb-1">Username</label>
                                    <input
                                        type="text"
                                        value={editFormData.username}
                                        onChange={(e) => setEditFormData({ ...editFormData, username: e.target.value })}
                                        className="w-full px-3 py-2 bg-[#23262f] border border-[#3a3d48] rounded-lg text-white focus:border-[#b6ff2e] focus:outline-none text-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-zinc-400 mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={editFormData.email}
                                        onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                                        className="w-full px-3 py-2 bg-[#23262f] border border-[#3a3d48] rounded-lg text-white focus:border-[#b6ff2e] focus:outline-none text-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-zinc-400 mb-1">Role</label>
                                    <select
                                        value={editFormData.role}
                                        onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                                        className="w-full px-3 py-2 bg-[#23262f] border border-[#3a3d48] rounded-lg text-white focus:border-[#b6ff2e] focus:outline-none text-sm"
                                    >
                                        <option value="User">User</option>
                                        <option value="Admin">Admin</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-zinc-400 mb-1">Status</label>
                                    <select
                                        value={editFormData.status}
                                        onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                                        className="w-full px-3 py-2 bg-[#23262f] border border-[#3a3d48] rounded-lg text-white focus:border-[#b6ff2e] focus:outline-none text-sm"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                        <option value="Suspended">Suspended</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2 mt-6">
                                <button type="submit" disabled={isSubmitting} className="w-full sm:flex-1 py-2 bg-[#b6ff2e] hover:bg-[#a3e829] text-[#23262f] font-semibold rounded-lg transition text-sm disabled:opacity-50">
                                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button type="button" onClick={() => setShowEditModal(false)} className="w-full sm:flex-1 py-2 bg-[#23262f] border border-[#3a3d48] text-white font-semibold rounded-lg hover:bg-[#2d303a] transition text-sm">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ===== DELETE MODAL ===== */}
            {showDeleteModal && selectedUser && (
                <div className="fixed inset-0 z-[1050] flex items-center justify-center bg-[#23262f]/95 p-2 sm:p-4">
                    <div className="bg-[#2d303a] border border-red-500/50 rounded-xl w-full max-w-md p-4 sm:p-6 shadow-2xl">
                        <h3 className="text-red-400 font-semibold text-base sm:text-lg mb-2">⚠️ Delete User</h3>
                        <p className="text-zinc-300 text-sm mb-6">
                            Are you sure you want to delete <strong className="text-white">{selectedUser.username}</strong>?
                            This action cannot be undone.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <button onClick={handleDeleteConfirm} disabled={isSubmitting} className="w-full sm:flex-1 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition text-sm disabled:opacity-50">
                                {isSubmitting ? 'Deleting...' : 'Yes, Delete'}
                            </button>
                            <button onClick={() => setShowDeleteModal(false)} className="w-full sm:flex-1 py-2 bg-[#23262f] border border-[#3a3d48] text-white font-semibold rounded-lg hover:bg-[#2d303a] transition text-sm">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ===== ADD USER MODAL ===== */}
            {showAddModal && (
                <div className="fixed inset-0 z-[1050] flex items-center justify-center bg-[#23262f]/95 p-2 sm:p-4">
                    <div className="bg-[#2d303a] border border-[#3a3d48] rounded-xl w-full max-w-md p-4 sm:p-6 max-h-[90vh] overflow-y-auto shadow-2xl">
                        <h3 className="text-[#b6ff2e] font-semibold text-base sm:text-lg mb-4">➕ Add New User</h3>
                        <form onSubmit={handleAddUser}>
                            <div className="space-y-3 sm:space-y-4">
                                <div>
                                    <label className="block text-sm text-zinc-400 mb-1">Username</label>
                                    <input
                                        type="text"
                                        value={newUserData.username}
                                        onChange={(e) => setNewUserData({ ...newUserData, username: e.target.value })}
                                        className="w-full px-3 py-2 bg-[#23262f] border border-[#3a3d48] rounded-lg text-white focus:border-[#b6ff2e] focus:outline-none text-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-zinc-400 mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={newUserData.email}
                                        onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                                        className="w-full px-3 py-2 bg-[#23262f] border border-[#3a3d48] rounded-lg text-white focus:border-[#b6ff2e] focus:outline-none text-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-zinc-400 mb-1">Password</label>
                                    <input
                                        type="password"
                                        value={newUserData.password}
                                        onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                                        className="w-full px-3 py-2 bg-[#23262f] border border-[#3a3d48] rounded-lg text-white focus:border-[#b6ff2e] focus:outline-none text-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-zinc-400 mb-1">Role</label>
                                    <select
                                        value={newUserData.role}
                                        onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
                                        className="w-full px-3 py-2 bg-[#23262f] border border-[#3a3d48] rounded-lg text-white focus:border-[#b6ff2e] focus:outline-none text-sm"
                                    >
                                        <option value="User">User</option>
                                        <option value="Admin">Admin</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-zinc-400 mb-1">Status</label>
                                    <select
                                        value={newUserData.status}
                                        onChange={(e) => setNewUserData({ ...newUserData, status: e.target.value })}
                                        className="w-full px-3 py-2 bg-[#23262f] border border-[#3a3d48] rounded-lg text-white focus:border-[#b6ff2e] focus:outline-none text-sm"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2 mt-6">
                                <button type="submit" disabled={isSubmitting} className="w-full sm:flex-1 py-2 bg-[#b6ff2e] hover:bg-[#a3e829] text-[#23262f] font-semibold rounded-lg transition text-sm disabled:opacity-50">
                                    {isSubmitting ? 'Adding...' : 'Add User'}
                                </button>
                                <button type="button" onClick={() => setShowAddModal(false)} className="w-full sm:flex-1 py-2 bg-[#23262f] border border-[#3a3d48] text-white font-semibold rounded-lg hover:bg-[#2d303a] transition text-sm">
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