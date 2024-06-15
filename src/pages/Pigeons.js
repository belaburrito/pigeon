import { useLocation } from "wouter";
import { PigeonContext } from  "../PigeonContext";
import { useContext } from 'react';
import { getPublicUrl } from "../Supabase";
import { useState } from "react";


export const PigeonCard = ({ pigeon }) => {

    const [, setLocation] = useLocation();
    const [pigeonUrl, setPigeonUrl] = useState('');

    getPublicUrl(pigeon.name + ".png").then((url) => {
        console.log("url", url.publicUrl);
        setPigeonUrl(url.publicUrl);
    });

    const navigateToPigeon = () => {
        setLocation(`/pigeons/${pigeon.id}`);
    };
    return (
        <div key={pigeon.id} className="pigeon" onClick={navigateToPigeon}>
            <img src={pigeonUrl} alt={pigeon.name} width="600px"/>
        </div>
    );
};

export function Pigeons() {
    const { pigeons } = useContext(PigeonContext);
    return (
        <div className="pigeon-container">
            {pigeons.map(pigeon => (
                <PigeonCard key={pigeon.id} pigeon={pigeon} name={pigeon.name} />
            ))}
        </div>
    );
}