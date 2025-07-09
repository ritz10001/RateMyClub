"use client"

import { useContext, useState, createContext } from "react";

const ClubContext = createContext();

export function ClubProvider({ children }) {
    const [clubData, setClubData] = useState(null);

    return(
        <ClubContext.Provider value={{ clubData, setClubData }}>
            {children}
        </ClubContext.Provider>
    )

}

export function useClub() {
    return useContext(ClubContext);
}