import { useState } from "react";

export const ManageUsers = () => {
    const [users, setUsers] = useState([
        { 
            id: 1, 
            username: "Admin", 
            email: "admin@example.com", 
            role: "Admin", 
            status: "Active",
            profile: "https://via.placeholder.com/40",
            joinedDate: "2024-01-15"
        },
        { 
            id: 2, 
            username: "JohnDoe", 
            email: "john@example.com", 
            role: "User", 
            status: "Active",
            profile: "https://via.placeholder.com/40",
            joinedDate: "2024-02-20"
        },
        { 
            id: 3, 
            username: "JaneSmith", 
            email: "jane@example.com", 
            role: "User", 
            status: "Inactive",
            profile: "https://via.placeholder.com/40",
            joinedDate: "2024-03-10"
        },
        { 
            id: 4, 
            username: "MikeJohnson", 
            email: "mike@example.com", 
            role: "User", 
            status: "Active",
            profile: "https://via.placeholder.com/40",
            joinedDate: "2024-04-05"
        },
    ]);

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

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === "All" || user.role === filterRole;
        return matchesSearch && matchesRole;
    });

    const showSuccessMessage = (message) => {
        setSuccessMessage(message);
        setTimeout(() => setSuccessMessage(""), 3000);
    };

    const handleEditClick = (user) => {
        setSelectedUser(user);
        setEditFormData({
            username: user.username,
            email: user.email,
            role: user.role,
            status: user.status
        });
        setShowEditModal(true);
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        setUsers(prev => prev.map(user => 
            user.id === selectedUser.id 
                ? { ...user, ...editFormData }
                : user
        ));
        setShowEditModal(false);
        showSuccessMessage(`✅ User ${editFormData.username} updated successfully!`);
    };

    const handleDeleteClick = (user) => {
        setSelectedUser(user);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = () => {
        setUsers(prev => prev.filter(user => user.id !== selectedUser.id));
        setShowDeleteModal(false);
        showSuccessMessage(`✅ User ${selectedUser.username} deleted successfully!`);
    };

    const handleAddUser = (e) => {
        e.preventDefault();
        const newUser = {
            id: Date.now(),
            username: newUserData.username,
            email: newUserData.email,
            role: newUserData.role,
            status: newUserData.status,
            profile: "https://via.placeholder.com/40",
            joinedDate: new Date().toISOString().split('T')[0]
        };
        setUsers(prev => [...prev, newUser]);
        setShowAddModal(false);
        setNewUserData({ username: "", email: "", password: "", role: "User", status: "Active" });
        showSuccessMessage(`✅ New user ${newUser.username} added successfully!`);
    };

    const getStatusBadge = (status) => {
        const styles = {
            Active: "bg-green-500/20 text-green-400 border border-green-500/30",
            Inactive: "bg-red-500/20 text-red-400 border border-red-500/30",
            Suspended: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
        };
        return styles[status] || styles.Active;
    };

    return (
        <div className="p-2 sm:p-4">
            {/* Header - Responsive */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-yellow-400">Manage Users</h2>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="w-full sm:w-auto px-4 py-2 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-600 transition text-sm sm:text-base"
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

            {/* Search and Filter - Responsive */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4 sm:mb-6">
                <input
                    type="text"
                    placeholder="🔍 Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-yellow-500 focus:outline-none text-sm"
                />
                <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-yellow-500 focus:outline-none text-sm"
                >
                    <option value="All">All Roles</option>
                    <option value="Admin">Admin</option>
                    <option value="User">User</option>
                </select>
            </div>

            {/* Users Table - Responsive */}
            <div className="bg-gray-900 border border-yellow-500/30 rounded-xl overflow-hidden">
                {/* Mobile Card View - visible on small screens */}
                <div className="block sm:hidden divide-y divide-gray-800">
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                            <div key={user.id} className="p-4 hover:bg-gray-800/50 transition">
                                <div className="flex items-center gap-3 mb-2">
                                    <img
                                        src={user.profile}
                                        alt={user.username}
                                        className="w-10 h-10 rounded-full border border-yellow-400/30"
                                    />
                                    <div className="flex-1">
                                        <div className="text-white font-medium">{user.username}</div>
                                        <div className="text-gray-400 text-xs">{user.email}</div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div>
                                        <span className="text-gray-500">Role:</span>
                                        <span className={`ml-1 px-2 py-0.5 rounded text-xs font-semibold ${
                                            user.role === "Admin" 
                                                ? "bg-purple-500/20 text-purple-400" 
                                                : "bg-blue-500/20 text-blue-400"
                                        }`}>
                                            {user.role}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Status:</span>
                                        <span className={`ml-1 px-2 py-0.5 rounded text-xs font-semibold ${getStatusBadge(user.status)}`}>
                                            {user.status}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Joined:</span>
                                        <span className="ml-1 text-gray-400">{user.joinedDate}</span>
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
                        <div className="px-4 py-8 text-center text-gray-400 text-sm">
                            No users found matching your criteria.
                        </div>
                    )}
                </div>

                {/* Desktop Table View - hidden on small screens */}
                <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-black text-yellow-400">
                            <tr>
                                <th className="px-4 py-3 text-left">User</th>
                                <th className="px-4 py-3 text-left">Email</th>
                                <th className="px-4 py-3 text-left">Role</th>
                                <th className="px-4 py-3 text-left">Status</th>
                                <th className="px-4 py-3 text-left">Joined</th>
                                <th className="px-4 py-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-800/50 transition">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={user.profile}
                                                    alt={user.username}
                                                    className="w-8 h-8 rounded-full border border-yellow-400/30"
                                                />
                                                <span className="text-white font-medium">{user.username}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-gray-300">{user.email}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                                user.role === "Admin" 
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
                                        <td className="px-4 py-3 text-gray-400 text-xs">{user.joinedDate}</td>
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
                                    <td colSpan="6" className="px-4 py-8 text-center text-gray-400">
                                        No users found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Stats - Responsive */}
            <div className="mt-4 flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400">
                <span>Total: <strong className="text-white">{users.length}</strong></span>
                <span>Active: <strong className="text-green-400">{users.filter(u => u.status === "Active").length}</strong></span>
                <span>Admins: <strong className="text-purple-400">{users.filter(u => u.role === "Admin").length}</strong></span>
            </div>

            {/* ===== EDIT MODAL - Responsive ===== */}
            {showEditModal && selectedUser && (
                <div className="fixed inset-0 z-[1050] flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-4">
                    <div className="bg-gray-900 border border-yellow-500 rounded-lg w-full max-w-md p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
                        <h3 className="text-yellow-400 font-semibold text-base sm:text-lg mb-4">✏️ Edit User</h3>
                        <form onSubmit={handleEditSubmit}>
                            <div className="space-y-3 sm:space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Username</label>
                                    <input
                                        type="text"
                                        value={editFormData.username}
                                        onChange={(e) => setEditFormData({ ...editFormData, username: e.target.value })}
                                        className="w-full px-3 py-2 bg-black border border-gray-700 rounded-lg text-white focus:border-yellow-500 focus:outline-none text-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={editFormData.email}
                                        onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                                        className="w-full px-3 py-2 bg-black border border-gray-700 rounded-lg text-white focus:border-yellow-500 focus:outline-none text-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Role</label>
                                    <select
                                        value={editFormData.role}
                                        onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                                        className="w-full px-3 py-2 bg-black border border-gray-700 rounded-lg text-white focus:border-yellow-500 focus:outline-none text-sm"
                                    >
                                        <option value="User">User</option>
                                        <option value="Admin">Admin</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Status</label>
                                    <select
                                        value={editFormData.status}
                                        onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                                        className="w-full px-3 py-2 bg-black border border-gray-700 rounded-lg text-white focus:border-yellow-500 focus:outline-none text-sm"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                        <option value="Suspended">Suspended</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2 mt-6">
                                <button type="submit" className="w-full sm:flex-1 py-2 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-600 transition text-sm">
                                    Save Changes
                                </button>
                                <button type="button" onClick={() => setShowEditModal(false)} className="w-full sm:flex-1 py-2 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition text-sm">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ===== DELETE MODAL - Responsive ===== */}
            {showDeleteModal && selectedUser && (
                <div className="fixed inset-0 z-[1050] flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-4">
                    <div className="bg-gray-900 border border-red-500 rounded-lg w-full max-w-md p-4 sm:p-6">
                        <h3 className="text-red-400 font-semibold text-base sm:text-lg mb-2">⚠️ Delete User</h3>
                        <p className="text-gray-300 text-sm mb-6">
                            Are you sure you want to delete <strong className="text-white">{selectedUser.username}</strong>? 
                            This action cannot be undone.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <button onClick={handleDeleteConfirm} className="w-full sm:flex-1 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition text-sm">
                                Yes, Delete
                            </button>
                            <button onClick={() => setShowDeleteModal(false)} className="w-full sm:flex-1 py-2 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition text-sm">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ===== ADD USER MODAL - Responsive ===== */}
            {showAddModal && (
                <div className="fixed inset-0 z-[1050] flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-4">
                    <div className="bg-gray-900 border border-yellow-500 rounded-lg w-full max-w-md p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
                        <h3 className="text-yellow-400 font-semibold text-base sm:text-lg mb-4">➕ Add New User</h3>
                        <form onSubmit={handleAddUser}>
                            <div className="space-y-3 sm:space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Username</label>
                                    <input
                                        type="text"
                                        value={newUserData.username}
                                        onChange={(e) => setNewUserData({ ...newUserData, username: e.target.value })}
                                        className="w-full px-3 py-2 bg-black border border-gray-700 rounded-lg text-white focus:border-yellow-500 focus:outline-none text-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={newUserData.email}
                                        onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                                        className="w-full px-3 py-2 bg-black border border-gray-700 rounded-lg text-white focus:border-yellow-500 focus:outline-none text-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Password</label>
                                    <input
                                        type="password"
                                        value={newUserData.password}
                                        onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                                        className="w-full px-3 py-2 bg-black border border-gray-700 rounded-lg text-white focus:border-yellow-500 focus:outline-none text-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Role</label>
                                    <select
                                        value={newUserData.role}
                                        onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
                                        className="w-full px-3 py-2 bg-black border border-gray-700 rounded-lg text-white focus:border-yellow-500 focus:outline-none text-sm"
                                    >
                                        <option value="User">User</option>
                                        <option value="Admin">Admin</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Status</label>
                                    <select
                                        value={newUserData.status}
                                        onChange={(e) => setNewUserData({ ...newUserData, status: e.target.value })}
                                        className="w-full px-3 py-2 bg-black border border-gray-700 rounded-lg text-white focus:border-yellow-500 focus:outline-none text-sm"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2 mt-6">
                                <button type="submit" className="w-full sm:flex-1 py-2 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-600 transition text-sm">
                                    Add User
                                </button>
                                <button type="button" onClick={() => setShowAddModal(false)} className="w-full sm:flex-1 py-2 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition text-sm">
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