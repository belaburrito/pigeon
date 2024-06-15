import { useState, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { getProfiles } from '../Supabase.js'

export function Home() {
    //randomPigeonId may overindex to test the 404 page
    const [randomPigeonId, setRandomPigeonId] = useState(Math.floor(Math.random() * 3) + 1);
    const [location] = useLocation();
    const DESC1 = "FOR THE FIRST TIME EVER simulate the intricate social webs of Pigeon East London (East Pigeon London). Every game another pigeon day in the eternal struggle for the next pigeon day, in this satirical and true-to-life card game."
    const DESC2 = "50 REAL PIGEONS, each vital to their community and cause, are fighting the ideological battle of their little bitty pigeon century. Ranked on essentialising categories from Audacity to Cunning to Punctuality in Trump Card style, the game of Pigeon skewers modern tropes and archetypes"
    const DESC3 = "Explore your city to find the pigeons and collect them all! Pigeons can be collected by scanning their QR code in their unique, secret locations. Pigeons are currently only available in Barcelona, Spain."
    useEffect(() => {
        setRandomPigeonId(Math.floor(Math.random() * 3) + 1);
    }, [location]);
    return (
        <div>
            <h1>Welcome to Pigeon</h1>
            <div>
                <Link href="https://www.jugglersmistake.co.uk/">A playing card game by Juggler's Mistake</Link>
                <p>{DESC1}</p>
                <p>{DESC2}</p>
            </div>
            <h1>How can I play Pigeon?</h1>
            <div>
                <p>{DESC3}</p>
            </div>
        </div>
        
    );
}