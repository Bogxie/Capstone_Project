import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js'

const navLinkClass = ({ isActive }) =>
    `block w-full text-center py-2 px-3 rounded transition-colors border-2 ${
        isActive
            ? "bg-lime-500 text-black font-bold border-lime-500"
            : "text-text-secondary hover:text-lime-500 dark:hover:text-lime-400 hover:bg-lime-500/10 border-border hover:border-lime-500/30"
    }`;

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
    const roleLinks = currentUser.role === "Admin" ? adminLinks : userLinks;

    return (
        <div className={`
            hide-scrollbar
            fixed top-[4.110rem] left-0 bottom-0 w-[12.5rem] z-[300]
            bg-bg-secondary flex flex-col items-center py-8
            overflow-y-auto transition-transform duration-300 ease-in-out
            ${showSidebar ? 'translate-x-0' : '-translate-x-full'}
            lg:translate-x-0
            border-r border-border
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
                    className="w-full h-full object-cover rounded-full border-[3px] border-lime-500"
                />
            </div>

            {/* Username */}
            <div className="w-full text-center mb-8">
                <h4 className="text-text-primary font-bold text-xl m-0">
                    {currentUser?.username}
                </h4>
            </div>

            {/* Nav List */}
            <div className="w-full px-4">
                <ul className="list-none p-0 m-0 space-y-2">
                    {roleLinks.map((link) => (
                        <li key={link.to}>
                            <NavLink to={link.to} className={navLinkClass}>
                                {link.label}
                            </NavLink>
                        </li>
                    ))}

                    {sharedLinks.map((link) => (
                        <li key={link.to}>
                            <NavLink to={link.to} className={navLinkClass}>
                                {link.label}
                            </NavLink>
                        </li>
                    ))}

                    <li>
                        <button
                            onClick={logout}
                            className="block w-full text-center py-2 px-3 rounded bg-red-600 hover:bg-red-700 text-white font-bold transition-colors border-2 border-red-500"
                        >
                            Log Out
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
};