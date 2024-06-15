import { getUser, getCoordinates, getPublicUrl } from '../Supabase';
import {useSession} from '../SessionContext';
import React, { useContext, useEffect, useState } from 'react';
import {PigeonContext} from '../PigeonContext';

export function Pigeon({params}){
    const session = useSession();
    const [hasPigeon, setHasPigeon] = useState(false);
    const [coordinates, setCoordinates] = useState('');


    // if (session) {
    //     console.log('logged in');
    //     getSignedInProfile().then((profile) => {
    //         pigeonData = profile[0].pigeons;
    //         pigeonData.forEach(pigeon => {
    //             if(pigeon.id == params.id) {
    //                 setHasPigeon(true);
    //             }
    //         })
    //     });
    // }
    // else{
    //     console.log('not logged in');
    // }

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

    if (!pigeon) {
        return <div>Loading...</div>;
    }


    return (
        <div>
            <h1>{pigeon.name}</h1>
            <p>{pigeon.description}</p>
            {session && session.user.role === 'admin_user' && coordinates && (
                <p>Coordinates: {coordinates}, UUID: {pigeon.uuid}</p>
            )}
            {hasPigeon && <p>You've collected this pigeon</p>}
        </div>
    );
}