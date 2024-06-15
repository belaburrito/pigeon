import { useLocation } from "wouter";
import { PigeonContext } from  "../PigeonContext";
import { useContext } from 'react';


export const PigeonCard = ({ pigeon }) => {

    const [, setLocation] = useLocation();

    const navigateToPigeon = () => {
        setLocation(`/pigeons/${pigeon.id}`);
    };
    return (
        <div key={pigeon.id} className="pigeon" onClick={navigateToPigeon}>
            <h1>{pigeon.name}</h1>
        </div>
    );
};

export function Pigeons() {
    const { pigeons } = useContext(PigeonContext);
    return (
        <div className="pigeon-container">
            {pigeons.map(pigeon => (
                <PigeonCard key={pigeon.id} pigeon={pigeon} />
            ))}
        </div>
    );
}