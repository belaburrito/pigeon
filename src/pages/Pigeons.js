import { useLocation } from "wouter";
import { PigeonContext } from  "../PigeonContext";
import { useContext, useEffect, useLayoutEffect } from 'react';
import { getPublicUrl, getPigeonsFromProfile, getLocalStoragePigeons } from "../Supabase";
import { useState } from "react";
import { useSession } from "../SessionContext";

export const PigeonCard = ({ pigeon, userPigeons }) => {
    const [loaded, setLoaded] = useState(false);
    const [, setLocation] = useLocation();
    const [pigeonUrl, setPigeonUrl] = useState('');
    const localPigeons = getLocalStoragePigeons();
    // TODO: Only check localPigeons if user is not logged in.
    // I'm keeping it as is because otherwise a user may collect a pigeon, log in, and it won't appear to be collected.
    useEffect(() => {
        const fetchPigeonUrl = async () => {
            if (userPigeons.includes(pigeon.uuid) || localPigeons.some(localPigeon => localPigeon.uuid === pigeon.uuid)) {   
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
                    className={`${loaded ? 'visible' : 'hidden'}`}
                    onLoad={handleImageLoad}
                />
            ) : (
                <h1>{pigeon.name}</h1>
            )}
        </div>
    );
};

export const StarterPigeon = () => {
    const [, setLocation] = useLocation();
    const navigateToPigeon = (id) => {
        setLocation(`/pigeons/${id}`);
    };
    const [fadeIn, setFadeIn] = useState(false);

    useEffect(() => {
      // Trigger the fade-in effect after the component mounts
      setFadeIn(true);
    }, []);

    return (
        <div className="starter-pigeon-container">
            <div className={`glowing-text ${fadeIn ? 'fade-in' : ''}`}>
            Collect Your First Pigeon
            </div>
            <img 
            src="https://zfuzqbjeufxqlsjsjlhu.supabase.co/storage/v1/object/public/pigeons/cards/Conspiracy%20Pigeon.png" 
            alt="Conspiracy Pigeon" 
            className={`pigeon-image ${fadeIn ? 'fade-in' : ''}`}
            />
      </div>
        // <div className="pigeon">
        //     <img
        //         src="https://zfuzqbjeufxqlsjsjlhu.supabase.co/storage/v1/object/public/pigeons/cards/Conspiracy%20Pigeon.png"
        //         alt="Conspiracy Pigeon"
        //         width="600px"
        //         // className={`fade-in ${loaded ? 'loaded' : ''}`}
        //         // onLoad={handleImageLoad}
        //     />
        // </div>
    );
}

// TODO: If !session and !localPigeons, or session and !userPigeons, show a section to collect a starter pigeon
export function Pigeons() {
    const { pigeons } = useContext(PigeonContext);
    const [userPigeons, setUserPigeons] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const session = useSession();
    useEffect(() => {
        // Fetch user pigeon data once
        const fetchUserPigeons = async () => {
            const data = await getPigeonsFromProfile();
            if (data[0] === null || data[0]?.pigeons === null) {
                setLoaded(true);
                return;
            }
            const uuids = data.flatMap(item => 
                item.pigeons.map(pigeon => pigeon.uuid)
            );
            setUserPigeons(uuids);
            setLoaded(true);
        };
        fetchUserPigeons();
    }, []);
    return (
        <div className="pigeons">
            {session && (
                <p className={`${loaded ? 'visible' : 'hidden'}`}>You've collected {userPigeons.length} Pigeons out of 50.</p>
            )}
            {/* { userPigeons.length === 0 && <StarterPigeon />} */}
            <div className="pigeon-container">
                {pigeons.map(pigeon => (
                    <PigeonCard key={pigeon.id} pigeon={pigeon} userPigeons={userPigeons} name={pigeon.name} />
                ))}

            </div>
        </div>
    );
}