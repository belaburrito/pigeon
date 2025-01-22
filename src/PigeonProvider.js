import { useEffect, useState } from "react";
import { PigeonContext } from "./PigeonContext";
import { GetPigeons } from './Supabase';

export const PigeonProvider = ({ children }) => {
    const [pigeons, setPigeons] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await GetPigeons();
            setPigeons(data);
        };
        fetchData();
    }, []);

    return (
        <PigeonContext.Provider value={{ pigeons }}>
            {children}
        </PigeonContext.Provider>
    );
};
