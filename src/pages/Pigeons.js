import { useLocation } from "wouter";
import { PigeonContext } from  "../PigeonContext";
import { useContext, useEffect } from 'react';
import { getPublicUrl, getPigeonsFromProfile } from "../Supabase";
import { useState } from "react";


export const PigeonCard = ({ pigeon, userPigeons }) => {
    const [, setLocation] = useLocation();
    const [pigeonUrl, setPigeonUrl] = useState('');
    const pigeonExistsInUserData = userPigeons.includes(pigeon.uuid);

    if (pigeonExistsInUserData) {
        getPublicUrl(pigeon.name + ".png").then((url) => {
            setPigeonUrl(url.publicUrl);
        });
    }

    const navigateToPigeon = () => {
        setLocation(`/pigeons/${pigeon.id}`);
    };
    return (
        <div key={pigeon.id} className="pigeon" onClick={navigateToPigeon}>
            {pigeonExistsInUserData && (
                <img src={pigeonUrl} alt={pigeon.name} width="600px"/>
            )}
            {!pigeonExistsInUserData && (
                <h1>{pigeon.name}</h1>
            )}
        </div>
    );
};

export function Pigeons() {
    const { pigeons } = useContext(PigeonContext);
    const [userPigeons, setUserPigeons] = useState([]);
    useEffect(() => {
        // Fetch user pigeon data once
        const fetchUserPigeons = async () => {
            const data = await getPigeonsFromProfile();
            const uuids = data.flatMap(item => 
                item.pigeons.map(pigeon => pigeon.uuid)
            );
            setUserPigeons(uuids);
        };
        fetchUserPigeons();
    }, []);
    return (
        <div className="pigeon-container">
            {pigeons.map(pigeon => (
                <PigeonCard key={pigeon.id} pigeon={pigeon} userPigeons={userPigeons} name={pigeon.name} />
            ))}
        </div>
    );
}