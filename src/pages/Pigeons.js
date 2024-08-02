import { useLocation } from "wouter";
import { PigeonContext } from  "../PigeonContext";
import { useContext, useEffect } from 'react';
import { getPublicUrl, getPigeonsFromProfile } from "../Supabase";
import { useState } from "react";

export const PigeonCard = ({ pigeon, userPigeons }) => {
    const [loaded, setLoaded] = useState(false);
    const [, setLocation] = useLocation();
    const [pigeonUrl, setPigeonUrl] = useState('');
    // TODO: If logged out, check local storage for pigeon data
    useEffect(() => {
        const fetchPigeonUrl = async () => {
            if (userPigeons.includes(pigeon.uuid)) {
                const url = await getPublicUrl(pigeon.name + ".png");
                setPigeonUrl(url.publicUrl);
            }
        };
        fetchPigeonUrl();
    }, [pigeon.uuid, pigeon.name, userPigeons]);

    const navigateToPigeon = () => {
        setLocation(`/pigeons/${pigeon.id}`);
    };

    const handleImageLoad = () => {
        setLoaded(true);
    };

    return (
        <div key={pigeon.id} className="pigeon" onClick={navigateToPigeon}>
            {pigeonUrl ? (
                <img
                    src={pigeonUrl}
                    alt={pigeon.name}
                    width="600px"
                    className={`fade-in ${loaded ? 'loaded' : ''}`}
                    onLoad={handleImageLoad}
                />
            ) : (
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