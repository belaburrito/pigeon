import { useState, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { getProfiles } from '../Supabase.js'

export function Home() {
    //randomPigeonId may overindex to test the 404 page
    const [randomPigeonId, setRandomPigeonId] = useState(Math.floor(Math.random() * 3) + 1);
    const [location] = useLocation();

    useEffect(() => {
        setRandomPigeonId(Math.floor(Math.random() * 3) + 1);
    }, [location]);
    return (
        <div>
            <h1>Welcome to Pigeon</h1>
            <div>
                <Link href={`/found/${randomPigeonId}`}>Click to find a random pigeon</Link>
            </div>
        </div>
        
    );
}