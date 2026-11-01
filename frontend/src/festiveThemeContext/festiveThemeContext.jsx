
import { createContext, useContext, useEffect } from "react";
import { useGetActiveFestiveThemeQuery } from "../servicesApis/festiveThemeServices/festiveThemeService";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const { data, isLoading, isError } = useGetActiveFestiveThemeQuery();

    const activeTheme = data?.data || null;

    useEffect(() => {
        const root = document.documentElement;

        if (activeTheme) {
            root.style.setProperty(
                "--primary-color",
                activeTheme.primaryColor
            );

            root.style.setProperty(
                "--secondary-color",
                activeTheme.secondaryColor
            );
        } else if (!isLoading) {
            root.style.setProperty("--primary-color","#7a294b");

            root.style.setProperty("--secondary-color","#fff8fb");
        }
    }, [activeTheme, isLoading]);

    return (
        <ThemeContext.Provider
            value={{ activeTheme, isLoading, isError }}
        >
            {children}
        </ThemeContext.Provider>
    );
};


export const useTheme = () => useContext(ThemeContext);



