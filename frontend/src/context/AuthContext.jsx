import { createContext, useContext, useState, useEffect, useCallback } from "react";

import { getProfile } from "../api/users";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

    const [token, setToken] = useState(
        localStorage.getItem("token") || null
    );

    const [user, setUser] = useState(null);
    const [userLoading, setUserLoading] = useState(false);

    useEffect(() => {

        if (token) {
            localStorage.setItem("token", token);
        } else {
            localStorage.removeItem("token");
            setUser(null);
        }

    }, [token]);

    const refreshUser = useCallback(async () => {

        if (!token) return;

        try {
            setUserLoading(true);
            const response = await getProfile();
            setUser(response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setUserLoading(false);
        }

    }, [token]);

    useEffect(() => {
        if (token) {
            refreshUser();
        }
    }, [token, refreshUser]);

    const login = (newToken) => {
        setToken(newToken);
    };

    const logout = () => {
        setToken(null);
    };

    return (
        <AuthContext.Provider
            value={{ token, login, logout, user, userLoading, refreshUser }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
