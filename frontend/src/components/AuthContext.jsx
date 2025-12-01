import { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            // Defer setLoading to avoid cascading renders
            setTimeout(() => setLoading(false), 0);
            return;
        }

        axios.get(`${import.meta.env.VITE_API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
            setUser(res.data.user);
        })
        .catch(() => {
            localStorage.removeItem("token");
        })
        .finally(() => setLoading(false));
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };
    return (
        <AuthContext.Provider value = {{ user, setUser, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
