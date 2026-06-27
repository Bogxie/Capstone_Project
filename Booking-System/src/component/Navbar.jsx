import { useState, useEffect } from 'react'
import { useAuth } from '../context/useAuth.js'
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

    const NavItems = [
        { path: "/AdminPage", role: "Admin", class: "block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white", label: "Bookings" },
        { path: "/UserPage", class: "block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white", label: "My Bookings" },
        { path: "/HelpSupport", class: "block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white", label: "Help and Support" },
        { path: "/Settings", class: "block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white", label: "Settings" },
    ]

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

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-[250] bg-lime-600 backdrop-blur-md text-white font-semibold p-2 shadow-md border-b border-gray-800">
                <div className="max-w-7xl mx-auto flex items-center justify-between px-4 relative flex-wrap lg:flex-row lg:flex-nowrap min-h-[50px]">

                    <div className="flex items-center flex-shrink-0 z-10">
                        <img
                            src={Prclogo}
                            alt="logo"
                            className="h-12 w-auto object-contain rounded"
                        />
                    </div>

                    <button
                        className="lg:hidden ms-auto border-2 border-amber-500 text-amber-500 rounded p-1.5 focus:outline-none hover:bg-amber-500 hover:text-white transition-colors z-10"
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
                            <li className="border border-lime-500/30 rounded-lg lg:border-0">
                                <Link to="/"
                                    className={`relative px-3 py-2 transition-colors duration-300 
                                        ${activeSection === "home"
                                            ? "text-yellow-400 underline underline-offset-4 decoration-2"
                                            : "text-white hover:text-yellow-300"
                                        }`}
                                >
                                    Home
                                </Link>
                            </li>
                            <li className="sborder border-lime-500/30 rounded-lg lg:border-0">
                                <a
                                    href="#calendar"
                                    className={`relative px-3 py-2 transition-colors duration-300 
                                        ${activeSection === "calendar"
                                            ? "text-yellow-400 underline underline-offset-4 decoration-2"
                                            : "text-white hover:text-yellow-300"
                                        }`}
                                >
                                    Schedule
                                </a>
                            </li>
                            <li className="border border-lime-500/30 rounded-lg lg:border-0">
                                <a
                                    href="#reviews"
                                    className={`relative px-3 py-2 transition-colors duration-300 
                                        ${activeSection === "reviews"
                                            ? "text-yellow-400 underline underline-offset-4 decoration-2"
                                            : "text-white hover:text-yellow-300"
                                        }`}
                                >
                                    Reviews
                                </a>
                            </li>
                            <li className="border border-lime-500/30 rounded-lg lg:border-0">
                                <a className="block py-2 px-3 text-gray-100 hover:text-amber-500 transition-colors" href="#">About Us</a>
                            </li>
                        </ul>
                        <div className="flex justify-center mt-4 lg:mt-0 flex-shrink-0 lg:ms-auto z-10 w-full lg:w-auto">
                            {!currentUser ? (
                                <button
                                    className="w-full lg:w-auto px-6 py-2 bg-amber-500 text-[#1e1e1e] font-bold rounded-lg hover:bg-amber-600 transition-colors duration-200 shadow text-center flex items-center justify-center"
                                    onClick={handleModalToggle}
                                >
                                    Sign In
                                </button>
                            ) : (
                                <div
                                    className="relative group flex flex-col lg:flex-row items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg cursor-pointer border border-gray-700 w-full lg:w-auto transition-all"
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                >

                                    <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-start whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <img src={currentUser.profile} className="w-7 h-7 rounded-full border border-amber-500 object-cover flex-shrink-0" alt="Profile" />
                                            <span className="text-sm font-medium max-w-[150px] lg:max-w-[120px] truncate">{currentUser.username}</span>
                                        </div>

                                        <svg className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''} lg:group-hover:rotate-180 text-gray-400 group-hover:text-amber-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>

                                    <div className={`${isDropdownOpen ? 'block' : 'hidden'} lg:hidden lg:group-hover:block lg:absolute lg:right-0 lg:top-full lg:pt-1 z-50 w-full lg:w-48`}>
                                        <ul className="bg-[#1e1e1e] border border-gray-700 rounded-lg shadow-xl py-2 text-left mt-2 lg:mt-0">
                                            <hr className="border-gray-700 my-1 hidden lg:block" />
                                            {NavItems.map((items, i) => {
                                                if (items.role && items.role !== currentUser.role) return null
                                                return (
                                                    <li key={i}>
                                                        <Link to={items.path} className={items.class}>{items.label}</Link>
                                                    </li>
                                                )
                                            })}
                                            <li>
                                                <a href="#" onClick={logout} className="block px-4 py-2 text-sm text-red-400 hover:bg-gray-800 hover:text-white border-t border-gray-700 lg:border-t-0 mt-1 lg:mt-0 pt-2 lg:pt-1">Log Out</a>
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
