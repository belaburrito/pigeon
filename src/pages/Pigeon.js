import {getCoordinates, getPigeonsFromProfile, getLocalStoragePigeons } from '../Supabase';
import {useSession} from '../SessionContext';
import React, { useContext, useEffect, useState } from 'react';
import {PigeonContext} from '../PigeonContext';

export function Pigeon({params}){
    const session = useSession();
    const [coordinates, setCoordinates] = useState('');

    const { pigeons } = useContext(PigeonContext);
    const [pigeon, setPigeon] = useState(null);
    useEffect(() => {
        const foundPigeon = pigeons.find(p => p.uuid.toString() === params.id);
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
            if (data[0]?.pigeon_ids.length === 0) {
                return;
            }
            // const uuids = data.flatMap(item => 
            //     item.pigeons.map(pigeon => pigeon.uuid)
            // );
            setUserPigeons(data[0]?.pigeon_ids);
        };
        fetchUserPigeons();
    }, []);

    if (!pigeon) {
        return <div>Hmm, you haven't found this pigeon yet. Go exploring to catch it!</div>;
    }

    const localPigeons = getLocalStoragePigeons();
    console.log("local pigeons", localPigeons)
    // TODO: Only check localPigeons if user is not logged in.
    // I'm keeping it as is because otherwise a user may collect a pigeon, log in, and it won't appear to be collected.
    const pigeonExistsInUserData = (userPigeons?.includes(pigeon.uuid) || localPigeons?.some(localPigeon => localPigeon.uuid === pigeon.uuid));

    return (
        <div>
            <h1>{pigeon.name}</h1>
            {pigeonExistsInUserData && (
                <p>{pigeon.description}</p>
            )}
            {/* TODO: Upon log in/sign up, we should save local storage pigeons to the user's profile */}
            {/* {pigeonExistsInUserData && !session && (
                <p>You found this pigeon! Make sure to sign up or log in to keep your pigeon permanently.</p>
            )} */}
            {!pigeonExistsInUserData && (
                <p>Hmm, you haven't found this pigeon yet. Go exploring to catch it!</p>
            )}
            {session && session?.user?.app_metadata?.role === 'admin_user' && coordinates && (
                <p>Coordinates: {coordinates}, UUID: {pigeon.uuid}</p>
            )}
        </div>
    );
}