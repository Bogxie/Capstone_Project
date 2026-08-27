import { useState, useEffect } from 'react'
import { useAuth } from '../context/useAuth.js'
import { HashLink } from 'react-router-hash-link'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { SignIn } from './SignIn.jsx'
import Prclogo from '../assets/images/lime_rbg2.png'

export const Navbar = () => {
    const location = useLocation();
    const { currentUser, logout, showSignIn, setShowSignIn } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("");

    const getNavItems = (role) => {
        const isAdmin = role === 'Admin';

        if (isAdmin) {
            return [
                { path: "/AdminPage", label: "Bookings" },
                { path: "/UserPage", label: "My Bookings" },
                { path: "/AdminProfile", label: "Profile" },
                { path: "/ManageUsers", label: "Manage Users" },  
                { path: "/HelpSupport", label: "Help and Support" },
                { path: "/Settings", label: "Settings" },
            ];
        }

        return [
            { path: "/UserPage", label: "My Bookings" },
            { path: "/UserProfile", label: "Profile" },
            { path: "/HelpSupport", label: "Help and Support" },
            { path: "/Settings", label: "Settings" },
        ];
    };

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    }

    const handleModalToggle = () => {
        setShowSignIn(!showSignIn);
    };

    useEffect(() => {
        if (location.pathname !== "/") return;

        let observer;

        const observeSections = () => {
            const sections = document.querySelectorAll("#home, #calendar, #reviews");

            if (!sections.length) {
                requestAnimationFrame(observeSections);
                return;
            }

            observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            setActiveSection(entry.target.id);
                        }
                    });
                },
                {
                    threshold: 0.4,
                    rootMargin: "-80px 0px 0px 0px",
                }
            );

            sections.forEach((section) => observer.observe(section));
        };

        observeSections();

        return () => observer?.disconnect();
    }, [location.pathname]);

    const NavItems = getNavItems(currentUser?.role);

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-[50] bg-[#23262f] text-white font-semibold p-2 shadow-lg border-b border-[#3a3d48]">
                <div className="max-w-7xl mx-auto flex items-center justify-between px-4 relative flex-wrap lg:flex-row lg:flex-nowrap min-h-[50px]">
                    <div className="flex items-center flex-shrink-0 z-10 gap-2">
                        <img
                            src={Prclogo}
                            alt="logo"
                            className="h-12 w-auto object-contain rounded"
                        />
                        <span className="text-xl font-bold tracking-wide hidden sm:block">
                            <span className="text-white">E-vent </span>
                            <span className="text-[#b6ff2e]">Flow</span>
                        </span>
                    </div>

                    <button
                        className="lg:hidden ms-auto border-2 border-[#b6ff2e] text-[#b6ff2e] rounded p-1.5 focus:outline-none hover:bg-[#b6ff2e] hover:text-[#23262f] transition-colors z-10"
                        type="button"
                        onClick={toggleMenu}
                    >
                        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                            {isOpen ? (
                                <path fillRule="evenodd" clipRule="evenodd" d="M18.278 16.864a1 1 0 01-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 01-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 011.414-1.414l4.828 4.829 4.829-4.829a1 1 0 111.414 1.414l-4.829 4.828 4.829 4.829z" />
                            ) : (
                                <path fillRule="evenodd" d="M4 5h16a1 1 0 010 2H4a1 1 0 110-2zm0 6h16a1 1 0 010 2H4a1 1 0 010-2zm0 6h16a1 1 0 010 2H4a1 1 0 010-2z" />
                            )}
                        </svg>
                    </button>

                    <div className={`${isOpen ? 'block' : 'hidden'} w-full lg:contents`} id="navbarNav">

                        <ul className="flex flex-col lg:flex-row lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 mt-4 lg:mt-0 lg:space-x-8 space-y-1 lg:space-y-0 text-left lg:text-center items-stretch lg:items-center w-full lg:w-auto pb-4 lg:pb-0">
                            <li className="border border-[#3a3d48] rounded-lg lg:border-0">
                                <Link to="/"
                                    className={`relative px-3 py-2 transition-colors duration-300 block
                                        ${activeSection === "home"
                                            ? "text-[#b6ff2e] underline underline-offset-4 decoration-2"
                                            : "text-gray-300 hover:text-[#b6ff2e]"
                                        }`}
                                >
                                    Home
                                </Link>
                            </li>
                            <li className="border border-[#3a3d48] rounded-lg lg:border-0">
                                <HashLink
                                    to="/#calendar"
                                    className={`relative px-3 py-2 transition-colors duration-300 block
                                        ${activeSection === "calendar"
                                            ? "text-[#b6ff2e] underline underline-offset-4 decoration-2"
                                            : "text-gray-300 hover:text-[#b6ff2e]"
                                        }`}
                                >
                                    Schedule
                                </HashLink>
                            </li>
                            <li className="border border-[#3a3d48] rounded-lg lg:border-0">
                                <HashLink
                                    to="/#reviews"
                                    className={`relative px-3 py-2 transition-colors duration-300 block
                                        ${activeSection === "reviews"
                                            ? "text-[#b6ff2e] underline underline-offset-4 decoration-2"
                                            : "text-gray-300 hover:text-[#b6ff2e]"
                                        }`}
                                >
                                    Reviews
                                </HashLink>
                            </li>
                            <li className="border border-[#3a3d48] rounded-lg lg:border-0">
                                <HashLink 
                                    to="/#about"
                                    className="block py-2 px-3 text-gray-300 hover:text-[#b6ff2e] transition-colors"
                                >
                                    About Us
                                </HashLink>
                            </li>
                        </ul>

                        <div className="flex justify-center mt-4 lg:mt-0 flex-shrink-0 lg:ms-auto z-10 w-full lg:w-auto">
                            {!currentUser ? (
                                <button
                                    className="w-full lg:w-auto px-6 py-2 bg-[#b6ff2e] text-[#23262f] font-bold rounded-lg hover:bg-[#a3e829] transition-colors duration-200 border border-[#b6ff2e]/30 shadow-md shadow-[#b6ff2e]/10 text-center flex items-center justify-center"
                                    onClick={handleModalToggle}
                                >
                                    Sign In
                                </button>
                            ) : (
                                <div
                                    className="relative group flex flex-col lg:flex-row items-center gap-2 px-4 py-2 bg-[#2d303a] rounded-lg cursor-pointer border border-[#3a3d48] w-full lg:w-auto transition-all hover:border-[#b6ff2e]/30"
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                >
                                    <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-start whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <img src={currentUser.profile} className="w-7 h-7 rounded-full border border-[#b6ff2e] object-cover flex-shrink-0" alt="Profile" />
                                            <span className="text-sm font-medium max-w-[150px] lg:max-w-[120px] truncate text-white">{currentUser.username}</span>
                                        </div>

                                        <svg className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''} lg:group-hover:rotate-180 text-gray-400 group-hover:text-[#b6ff2e]`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>

                                    {/* DROPDOWN */}
                                    <div className={`${isDropdownOpen ? 'block' : 'hidden'} lg:hidden lg:group-hover:block lg:absolute lg:right-0 lg:top-full lg:pt-1 z-50 w-full lg:w-48`}>
                                        <ul className="bg-[#23262f] border border-[#3a3d48] rounded-lg shadow-xl py-2 text-left mt-2 lg:mt-0">
                                            <hr className="border-[#3a3d48] my-1 hidden lg:block" />
                                            {NavItems.map((items, i) => {
                                                return (
                                                    <li key={i}>
                                                        <Link
                                                            to={items.path}
                                                            className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#2d303a] hover:text-[#b6ff2e] transition-colors"
                                                            onClick={() => setIsDropdownOpen(false)}
                                                        >
                                                            {items.label}
                                                        </Link>
                                                    </li>
                                                )
                                            })}
                                            <li>
                                                <a
                                                    href="#"
                                                    onClick={logout}
                                                    className="block px-4 py-2 text-sm text-red-400 hover:bg-[#2d303a] hover:text-red-300 border-t border-[#3a3d48] lg:border-t-0 mt-1 lg:mt-0 pt-2 lg:pt-1 transition-colors"
                                                >
                                                    Log Out
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <AnimatePresence>
                {showSignIn && (
                    <SignIn onClose={handleModalToggle} />
                )}
            </AnimatePresence>
        </>
    )
}