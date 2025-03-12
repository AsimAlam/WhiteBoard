import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : {};
    });

    useEffect(() => {
        console.log("user", user);
        if (user && Object.keys(user).length !== 0) {
            localStorage.setItem('user', JSON.stringify(user));
        }
    }, [user])

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );

}

export const useUser = () => useContext(UserContext);
