import { createContext, useEffect, useState } from "react";
import { useGetCurrentUserQuery } from "../servicesApis/userServices/userServices";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [authInitialized, setAuthInitialized] = useState(false);

    const { data, isSuccess, isError, isLoading } =
        useGetCurrentUserQuery();

    useEffect(() => {
        if (isSuccess) {
            setUser(data?.data);
            setIsLoggedIn(true);
            setAuthInitialized(true);
        } else if (isError) {
            setUser(null);
            setIsLoggedIn(false);
            setAuthInitialized(true);
        }
    }, [data, isSuccess, isError]);

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn,
                setIsLoggedIn,
                user,
                setUser,
                isLoading,
                authInitialized
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};