import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js'

const adminLinks = [
    { to: "/AdminPage", label: "Bookings" },
    { to: "/UserPage", label: "My Bookings" },
    { to: "/AdminProfile", label: "Profile" },
    { to: "/ManageUsers", label: "Manage Users" },
];

const userLinks = [
    { to: "/UserPage", label: "My Bookings" },
    { to: "/UserProfile", label: "Profile" },
];

const sharedLinks = [
    { to: "/HelpSupport", label: "Help & Support" },
    { to: "/Settings", label: "Settings" },
];

export const Sidebar = ({ showSidebar, onClose }) => {
    const { currentUser, logout } = useAuth();
    const roleLinks = currentUser?.role === "Admin" ? adminLinks : userLinks;

    return (
        <>
            {/* Overlay - walang blur */}
            {showSidebar && (
                <div 
                    className="fixed inset-0 z-[45] lg:hidden bg-black/50"
                    onClick={onClose}
                />
            )}

            <div className={`
                hide-scrollbar
                fixed top-[4.110rem] left-0 bottom-0 w-[12.5rem] z-[240]
                bg-[#23262f] 
                flex flex-col items-center py-8
                overflow-y-auto transition-transform duration-300 ease-in-out
                ${showSidebar ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0
                border-r border-[#3a3d48]
                shadow-xl
            `}>
                <button
                    onClick={onClose}
                    className="absolute top-5.5 right-2.5 z-[1001] lg:hidden bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 rounded transition-colors"
                >
                    ✕
                </button>

                {/* Profile Image */}
                <div className="relative w-20 h-20 mb-4 shrink-0">
                    <img
                        src={currentUser?.profile}
                        alt="profile"
                        className="w-full h-full object-cover rounded-full border-[3px] border-[#b6ff2e]"
                    />
                </div>

                {/* Username */}
                <div className="w-full text-center mb-8">
                    <h4 className="font-bold text-xl m-0 text-white">
                        {currentUser?.username}
                    </h4>
                </div>

                {/* Nav List */}
                <div className="w-full px-4">
                    <ul className="list-none p-0 m-0 space-y-2">
                        {roleLinks.map((link) => (
                            <li key={link.to}>
                                <NavLink 
                                    to={link.to} 
                                    className={({ isActive }) =>
                                        `block w-full text-center py-2 px-3 rounded-lg transition-all duration-200 border-2 ${
                                            isActive
                                                ? "bg-[#b6ff2e] text-[#23262f] font-bold border-[#b6ff2e] shadow-lg shadow-[#b6ff2e]/20"
                                                : "text-gray-300 hover:text-[#b6ff2e] hover:bg-[#b6ff2e]/10 border-[#3a3d48] hover:border-[#b6ff2e]/30"
                                        }`
                                    }
                                >
                                    {link.label}
                                </NavLink>
                            </li>
                        ))}

                        {sharedLinks.map((link) => (
                            <li key={link.to}>
                                <NavLink 
                                    to={link.to} 
                                    className={({ isActive }) =>
                                        `block w-full text-center py-2 px-3 rounded-lg transition-all duration-200 border-2 ${
                                            isActive
                                                ? "bg-[#b6ff2e] text-[#23262f] font-bold border-[#b6ff2e] shadow-lg shadow-[#b6ff2e]/20"
                                                : "text-gray-300 hover:text-[#b6ff2e] hover:bg-[#b6ff2e]/10 border-[#3a3d48] hover:border-[#b6ff2e]/30"
                                        }`
                                    }
                                >
                                    {link.label}
                                </NavLink>
                            </li>
                        ))}

                        <li className="pt-2 border-t border-[#3a3d48]">
                            <button
                                onClick={logout}
                                className="block w-full text-center py-2 px-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold transition-colors border-2 border-red-500/50"
                            >
                                Log Out
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
};