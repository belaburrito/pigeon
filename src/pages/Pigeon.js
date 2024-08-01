import {getCoordinates, getPigeonsFromProfile } from '../Supabase';
import {useSession} from '../SessionContext';
import React, { useContext, useEffect, useState } from 'react';
import {PigeonContext} from '../PigeonContext';

export function Pigeon({params}){
    const session = useSession();
    const [coordinates, setCoordinates] = useState('');

    const { pigeons } = useContext(PigeonContext);
    const [pigeon, setPigeon] = useState(null);
    useEffect(() => {
        const foundPigeon = pigeons.find(p => p.id.toString() === params.id);
        setPigeon(foundPigeon);
        async function fetchCoordinates() {
            const data = await getCoordinates(foundPigeon.location);
            if (data) {
                setCoordinates(data);
            }
        }
        if (foundPigeon) {
            fetchCoordinates();
        };
    }, [pigeons, params.id]);

    const [userPigeons, setUserPigeons] = useState([]);
    // TODO: Make this re-useable for pigeons.js and pigeon.js
    useEffect(() => {
        const fetchUserPigeons = async () => {
            const data = await getPigeonsFromProfile();
            const uuids = data.flatMap(item => 
                item.pigeons.map(pigeon => pigeon.uuid)
            );
            setUserPigeons(uuids);
        };
        fetchUserPigeons();
    }, []);

    if (!pigeon) {
        return <div>Loading...</div>;
    }

    const pigeonExistsInUserData = userPigeons.includes(pigeon.uuid);

    return (
        <div>
            <h1>{pigeon.name}</h1>
            {pigeonExistsInUserData && (
                <p>{pigeon.description}</p>
            )}
            {!pigeonExistsInUserData && (
                <p>Hmm, you haven't found this pigeon yet. Go exploring to catch it!</p>
            )}
            {session && session.user.role === 'admin_user' && coordinates && (
                <p>Coordinates: {coordinates}, UUID: {pigeon.uuid}</p>
            )}
        </div>
    );
}