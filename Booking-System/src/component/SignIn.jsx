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
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password) => {
        const hasMinLength = password.length >= 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        return {
            isValid: hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar,
            errors: {
                minLength: !hasMinLength,
                upperCase: !hasUpperCase,
                lowerCase: !hasLowerCase,
                number: !hasNumber,
                specialChar: !hasSpecialChar
            }
        };
    };

    const validateUsername = (username) => {
        const hasMinLength = username.length >= 5;
        const hasMaxLength = username.length <= 12;
        const hasNoSpaces = !username.includes(' ');
        const hasValidChars = /^[a-zA-Z0-9_]+$/.test(username);
        
        return {
            isValid: hasMinLength && hasMaxLength && hasNoSpaces && hasValidChars,
            errors: {
                minLength: !hasMinLength,
                maxLength: !hasMaxLength,
                hasSpaces: !hasNoSpaces,
                validChars: !hasValidChars
            }
        };
    };

    const handleChange = (e) => {
        const value = e.target.name === 'email' || e.target.name === 'username' 
            ? e.target.value.trim() 
            : e.target.value;
            
        setForm({
            ...form,
            [e.target.name]: value
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
        setIsLoading(false);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage("");

        if (!validateEmail(form.email)) {
            setMessage("Please enter a valid email address");
            setIsLoading(false);
            return;
        }

        if (!form.password || form.password.length < 1) {
            setMessage("Password is required");
            setIsLoading(false);
            return;
        }

        const success = await login(form.email.trim(), form.password);
        
        if (!success) {
            setMessage("Invalid email or password");
            setIsLoading(false);
            return;
        }
        
        setIsLoading(false);
        onClose();
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage("");

        const usernameValidation = validateUsername(form.username);
        if (!usernameValidation.isValid) {
            let errorMsg = "Username must: ";
            const errors = [];
            if (usernameValidation.errors.minLength) errors.push("be at least 5 characters");
            if (usernameValidation.errors.maxLength) errors.push("be at most 12 characters");
            if (usernameValidation.errors.hasSpaces) errors.push("not contain spaces");
            if (usernameValidation.errors.validChars) errors.push("contain only letters, numbers, and underscores");
            setMessage(errorMsg + errors.join(", "));
            setIsLoading(false);
            return;
        }

        if (!validateEmail(form.email)) {
            setMessage("Please enter a valid email address");
            setIsLoading(false);
            return;
        }

        const passwordValidation = validatePassword(form.password);
        if (!passwordValidation.isValid) {
            let errorMsg = "Password must: ";
            const errors = [];
            if (passwordValidation.errors.minLength) errors.push("be at least 8 characters");
            if (passwordValidation.errors.upperCase) errors.push("contain at least 1 uppercase letter");
            if (passwordValidation.errors.lowerCase) errors.push("contain at least 1 lowercase letter");
            if (passwordValidation.errors.number) errors.push("contain at least 1 number");
            if (passwordValidation.errors.specialChar) errors.push("contain at least 1 special character");
            setMessage(errorMsg + errors.join(", "));
            setIsLoading(false);
            return;
        }

        if (form.password !== form.repassword) {
            setMessage("Passwords do not match");
            setIsLoading(false);
            return;
        }

        const success = await register({
            username: form.username.trim(),
            email: form.email.trim(),
            password: form.password,
            role: "User"
        });

        if (success) {
            setMessage("Registration successful! Closing in a moment...");
            setTimeout(() => {
                setIsLoading(false);
                onClose();
            }, 1500);
        } else {
            setMessage("Registration failed. Email might already exist.");
            setIsLoading(false);
        }
    };

    const handleForgot = (e) => {
        e.preventDefault();
        
        if (!form.email || !validateEmail(form.email)) {
            setMessage("Please enter a valid email address");
            return;
        }
        
        setMessage(`Reset link sent to ${form.email}`);
        setTimeout(() => {
            setMessage("");
            setView("SignIn");
        }, 2000);
    };

    // ✅ SOLID - White sa light, Dark sa dark
    const inputStyle = "w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20 transition-all mb-2 text-sm";
    const labelStyle = "block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1";

    return (
        <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 25
                }}
                // ✅ WHITE sa light mode, DARK sa dark mode
                className="w-full max-w-md bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl p-6 shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 dark:border-zinc-700 pb-3 mb-4">
                    <h5 className="text-lg font-bold tracking-wide">
                        <span className="text-gray-900 dark:text-white">E-vent </span>
                        <span className="text-lime-500 dark:text-lime-400">Flow</span>
                    </h5>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-lime-500 dark:hover:text-lime-400 transition-colors focus:outline-none text-xl"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Message alerts */}
                {message && (
                    <div className={`mb-4 p-3 rounded-lg text-sm font-medium text-center ${
                        message.includes("successful") 
                            ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/30 text-green-700 dark:text-green-400"
                            : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/30 text-red-600 dark:text-red-400"
                    }`}>
                        {message}
                    </div>
                )}

                {view === "SignIn" && (
                    <form onSubmit={handleLogin}>
                        <h2 className="text-xl font-bold text-center mb-4 text-gray-900 dark:text-white">Sign In</h2>

                        <label className={labelStyle}>Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="name@example.com"
                            value={form.email}
                            onChange={handleChange}
                            className={inputStyle}
                            required
                            disabled={isLoading}
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
                            disabled={isLoading}
                        />

                        <div className="text-center mb-4">
                            <span
                                onClick={() => handleViewChange("forgot")}
                                className="text-xs text-lime-600 dark:text-lime-400 hover:text-lime-700 dark:hover:text-lime-300 hover:underline cursor-pointer transition-all"
                            >
                                Forgot Password?
                            </span>
                        </div>

                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full py-2.5 bg-lime-500 hover:bg-lime-400 text-black font-bold rounded-lg transition-colors duration-200 shadow-lg shadow-lime-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Signing in..." : "Sign In"}
                        </button>

                        <button
                            type="button"
                            onClick={() => handleViewChange("SignUp")}
                            disabled={isLoading}
                            className="w-full mt-2 py-2.5 bg-transparent border border-gray-300 dark:border-zinc-600 hover:border-lime-500 text-gray-600 dark:text-zinc-300 hover:text-lime-600 dark:hover:text-lime-400 font-medium rounded-lg transition-colors duration-200 disabled:opacity-50"
                        >
                            Create Account
                        </button>

                        <small className="block text-center mt-3 text-xs text-gray-500 dark:text-zinc-500">
                            Don't have an account?
                        </small>
                    </form>
                )}

                {view === "SignUp" && (
                    <form onSubmit={handleRegister}>
                        <h2 className="text-xl font-bold text-center mb-4 text-gray-900 dark:text-white">Create Account</h2>

                        <label className={labelStyle}>Username</label>
                        <input
                            type="text"
                            name="username"
                            placeholder="Enter your username"
                            value={form.username}
                            onChange={handleChange}
                            className={inputStyle}
                            required
                            disabled={isLoading}
                        />
                        <p className="text-[10px] text-gray-500 dark:text-zinc-500 -mt-1 mb-2">
                            * 5-12 characters, letters, numbers, underscores only
                        </p>

                        <label className={labelStyle}>Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="name@example.com"
                            value={form.email}
                            onChange={handleChange}
                            className={inputStyle}
                            required
                            disabled={isLoading}
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
                            disabled={isLoading}
                        />
                        <p className="text-[10px] text-gray-500 dark:text-zinc-500 -mt-1 mb-2">
                            * 8+ chars, uppercase, lowercase, number, special character
                        </p>

                        <label className={labelStyle}>Confirm Password</label>
                        <input
                            type="password"
                            name="repassword"
                            placeholder="Re-enter your Password"
                            value={form.repassword}
                            onChange={handleChange}
                            className={inputStyle}
                            required
                            disabled={isLoading}
                        />

                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full py-2.5 bg-lime-500 hover:bg-lime-400 text-black font-bold rounded-lg transition-colors duration-200 shadow-lg shadow-lime-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Creating account..." : "Sign Up"}
                        </button>

                        <button
                            type="button"
                            onClick={() => handleViewChange("SignIn")}
                            disabled={isLoading}
                            className="w-full mt-2 py-2.5 bg-transparent border border-gray-300 dark:border-zinc-600 hover:border-lime-500 text-gray-600 dark:text-zinc-300 hover:text-lime-600 dark:hover:text-lime-400 font-medium rounded-lg transition-colors duration-200 disabled:opacity-50"
                        >
                            Back to Sign In
                        </button>

                        <small className="block text-center mt-3 text-xs text-gray-500 dark:text-zinc-500">
                            Already have an account?
                        </small>
                    </form>
                )}

                {view === "forgot" && (
                    <form onSubmit={handleForgot}>
                        <h2 className="text-xl font-bold text-center mb-2 text-gray-900 dark:text-white">Forgot Password?</h2>
                        <p className="text-xs text-gray-500 dark:text-zinc-400 text-center mb-4">Enter your email address and we'll send you a link to reset your password.</p>

                        <input
                            type="email"
                            name="email"
                            placeholder="name@example.com"
                            value={form.email}
                            onChange={handleChange}
                            className={`${inputStyle} mb-4`}
                            required
                            disabled={isLoading}
                        />

                        <button 
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-2.5 bg-lime-500 hover:bg-lime-400 text-black font-bold rounded-lg transition-colors duration-200 shadow-lg shadow-lime-500/20 disabled:opacity-50"
                        >
                            {isLoading ? "Sending..." : "Send Reset Link"}
                        </button>

                        <button
                            type="button"
                            onClick={() => handleViewChange("SignIn")}
                            disabled={isLoading}
                            className="w-full mt-2 py-2.5 bg-transparent border border-gray-300 dark:border-zinc-600 hover:border-lime-500 text-gray-600 dark:text-zinc-300 hover:text-lime-600 dark:hover:text-lime-400 font-medium rounded-lg transition-colors duration-200 disabled:opacity-50"
                        >
                            Back to Sign In
                        </button>
                    </form>
                )}
            </motion.div>
        </motion.div>
    );
};