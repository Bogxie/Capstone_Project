import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js'

const navLinkClass = ({ isActive }) =>
    `block w-full text-center py-2 px-3 rounded transition-colors ${isActive
        ? "bg-yellow-400 text-black font-bold"
        : "bg-white/10 text-yellow-400 hover:bg-white/20"
    }`;

const adminLinks = [
    { to: "/AdminPage", label: "Bookings" },
    { to: "/UserPage", label: "My Bookings" },
    { to: "/AdminProfile", label: "Profile" },
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
    const { currentUser } = useAuth();

    const roleLinks = currentUser.role === "Admin" ? adminLinks : userLinks;

    return (
        <div className={`
            hide-scrollbar
            fixed top-[4.110rem] left-0 bottom-0 w-[12.5rem] z-[300]
            bg-[#212529] flex flex-col items-center py-8
            overflow-y-auto transition-transform duration-300 ease-in-out
            ${showSidebar ? 'translate-x-0' : '-translate-x-full'}
            lg:translate-x-0
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
                    className="w-full h-full object-cover rounded-full border-[3px] border-lime-400 bg-yellow-400"
                />
            </div>

            {/* Username */}
            <div className="w-full text-center mb-8">
                <h4 className="text-yellow-400 font-bold text-xl m-0">
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

                    {currentUser.role === "Admin" && (
                        <li className="text-center py-2 px-3 rounded bg-white/10 text-yellow-400 hover:bg-white/20 transition-colors cursor-pointer">
                            Manage Users
                        </li>
                    )}

                    {sharedLinks.map((link) => (
                        <li key={link.to}>
                            <NavLink to={link.to} className={navLinkClass}>
                                {link.label}
                            </NavLink>
                        </li>
                    ))}

                    <li>
                        <Link
                            to="/"
                            className="block w-full text-center py-2 px-3 rounded bg-yellow-400 text-black font-bold hover:bg-yellow-500 transition-colors"
                        >
                            Log Out
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};