import { useState } from "react";
import { AuthContext } from "./AuthContext";
import AdminProfile from '../assets/Images/lime_rbg2.png'

const defaultUser = [{
    id: 1,
    profile: AdminProfile,
    email: 'Admin@example.com',
    username: "Admin",
    password: "Admin69420",
    role: "Admin"
}];

export const AuthProvider = ({ children }) => {
    const [users, setUsers] = useState(defaultUser);
    const [currentUser, setCurrentUser] = useState(null);
    const [showSignIn, setShowSignIn] = useState(false);

    const login = (email, password) => {
        const found = users.find(u => u.email === email && u.password === password);

        if (found) {
            setCurrentUser(found);
            console.log("Logged in user:", found);
            return true;
        }
        return false;
    };

    const register = ({ email, password, username, role }) => {
        const newUser = {
            id: Date.now(),
            email,
            password,
            username,
            role: role || "User",
            profile: AdminProfile,

        }
        setUsers(prev => [...prev, newUser]);
        setCurrentUser(newUser);
        console.log(newUser);
    };

    const logout = () => {
        setCurrentUser(null);
    };

    return (
        <AuthContext.Provider value={{ currentUser, login, register, logout, showSignIn, setShowSignIn }}>
            {children}
        </AuthContext.Provider>
    )

}

