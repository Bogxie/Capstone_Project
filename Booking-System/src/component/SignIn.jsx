import { useState, useEffect } from "react";
import { useAuth } from "../context/useAuth";
import { motion } from "framer-motion"

export const SignIn = ({ onClose }) => {
    const { register, login } = useAuth();
    const [view, setView] = useState("SignIn");
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        repassword: ""
    });
    const [message, setMessage] = useState("");

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleViewChange = (newView) => {
        setForm({
            username: "",
            email: "",
            password: "",
            repassword: "",
        });
        setMessage("");
        setView(newView);
    };

    const handleLogin = (e) => {
        e.preventDefault();
        if (!login(form.email, form.password)) {
            setMessage("Invalid credentials");
            return;
        }
        onClose();
    };

    const handleRegister = (e) => {
        e.preventDefault();
        if (form.password !== form.repassword) {
            setMessage("Passwords do not match");
            return;
        }
        register({
            ...form,
            role: "User"
        });

        setMessage("Success! Closing in a moment...");
        setTimeout(() => {
            onClose();
        }, 1500);
    };

    const handleForgot = (e) => {
        e.preventDefault();
        setMessage(`Reset link sent to ${form.email}`);
        setTimeout(() => {
            setMessage("");
            setView("SignIn");
        }, 2000);
    };

    const inputStyle = "w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors mb-2 text-sm";
    const labelStyle = "block text-xs font-semibold text-gray-400 mb-1";

    return (
        <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[260] p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            {/* MODAL CARD BOX */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 25
                }}
                className="w-full max-w-md bg-[#1e1e1e] border border-gray-800 rounded-xl p-6 shadow-2xl relative text-white"
                onClick={(e) => e.stopPropagation()}
            >
                {/* HEADER */}
                <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-4">
                    <h5 className="text-lg font-bold tracking-wide text-amber-500">Account Access</h5>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors focus:outline-none text-xl"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* ALERT/MESSAGE ALERTS */}
                {message && (
                    <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-lg text-sm font-medium text-center">
                        {message}
                    </div>
                )}

                {/* VIEW: SIGN IN */}
                {view === "SignIn" && (
                    <form onSubmit={handleLogin}>
                        <h2 className="text-xl font-bold text-center mb-4">Sign In</h2>

                        <label className={labelStyle}>Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="name@example.com"
                            value={form.email}
                            onChange={handleChange}
                            className={inputStyle}
                            required
                        />

                        <label className={labelStyle}>Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={handleChange}
                            className={inputStyle}
                            required
                        />

                        <div className="text-right mb-4">
                            <span
                                onClick={() => handleViewChange("forgot")}
                                className="text-xs text-amber-500 hover:underline cursor-pointer transition-all"
                            >
                                Forgot Password?
                            </span>
                        </div>

                        {/* PRIMARY ACTION BUTTON */}
                        <button className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-[#1e1e1e] font-bold rounded-lg transition-colors duration-200 shadow-md">
                            Sign In
                        </button>

                        {/* SECONDARY ACTION BUTTON */}
                        <button
                            type="button"
                            onClick={() => setView("SignUp")}
                            className="w-full mt-2 py-2.5 bg-transparent border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white font-medium rounded-lg transition-colors duration-200"
                        >
                            Sign Up
                        </button>

                        <small className="block text-center mt-3 text-xs text-gray-500">
                            Don't have an account yet?
                        </small>
                    </form>
                )}

                {/* VIEW: SIGN UP */}
                {view === "SignUp" && (
                    <form onSubmit={handleRegister}>
                        <h2 className="text-xl font-bold text-center mb-4">Sign Up</h2>

                        <label className={labelStyle}>Username</label>
                        <input
                            type="text"
                            name="username"
                            placeholder="Enter your username"
                            value={form.username}
                            minLength={5}
                            maxLength={12}
                            onChange={handleChange}
                            className={inputStyle}
                            required
                        />

                        <label className={labelStyle}>Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Name@example.com"
                            value={form.email}
                            onChange={handleChange}
                            className={inputStyle}
                            required
                        />

                        <label className={labelStyle}>Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter Password"
                            value={form.password}
                            onChange={handleChange}
                            className={inputStyle}
                            required
                        />

                        <label className={labelStyle}>Confirm Password</label>
                        <input
                            type="password"
                            name="repassword"
                            placeholder="Re-enter your Password"
                            value={form.repassword}
                            onChange={handleChange}
                            className={inputStyle}
                            required
                        />

                        <button type="submit" className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-[#1e1e1e] font-bold rounded-lg transition-colors duration-200 shadow-md">
                            Sign Up
                        </button>

                        <button
                            type="button"
                            onClick={() => handleViewChange("SignIn")}
                            className="w-full mt-2 py-2.5 bg-transparent border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white font-medium rounded-lg transition-colors duration-200"
                        >
                            Back to Sign In
                        </button>

                        <small className="block text-center mt-3 text-xs text-gray-500">
                            Already have an account?
                        </small>
                    </form>
                )}

                {view === "forgot" && (
                    <form onSubmit={handleForgot}>
                        <h2 className="text-xl font-bold text-center mb-2">Forgot Password?</h2>
                        <p className="text-xs text-gray-400 text-center mb-4">Enter your email address and we'll send you a link to reset your password.</p>

                        <input
                            type="email"
                            name="email"
                            placeholder="name@example.com"
                            value={form.email}
                            onChange={handleChange}
                            className={`${inputStyle} mb-4`}
                            required
                        />

                        <button className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-[#1e1e1e] font-bold rounded-lg transition-colors duration-200 shadow-md">
                            Send Reset Link
                        </button>

                        <button
                            type="button"
                            onClick={() => handleViewChange("SignIn")}
                            className="w-full mt-2 py-2.5 bg-transparent border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white font-medium rounded-lg transition-colors duration-200"
                        >
                            Back to Sign In
                        </button>
                    </form>
                )}
            </motion.div>
        </motion.div>
    );
};