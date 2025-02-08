import React, { useContext, useEffect, useState } from 'react';
import { PigeonContext } from '../PigeonContext';
import { VerifyLocation, getPublicUrl } from '../Supabase';
import { useLocation } from 'wouter';
import { getSignedInProfile, updatePigeonsToProfile } from '../Supabase';
import Modal from '../Modal';
import {SessionContext} from '../SessionContext';

export const Found = ({ params }) => {
    const { pigeons } = useContext(PigeonContext);
    const pigeonUUID = params.uuid;
    const pigeonName = params.name;

    const [userLocation, setUserLocation] = useState(null);
    const [, setLocation] = useLocation();
    const [loading, setLoading] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const [success, setSuccess] = useState(false);
    const session = useContext(SessionContext);

    const [showPigeon, setShowPigeon] = useState(true);

    const handleLocationButtonClick = () => {
        closeModal();
        getUserLocation();
    };

    const getUserLocation = async () => {
        setLoading(true);
        setShowPigeon(false);

        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser.");
            setLoading(false);
            return;
        }
    
        try {
            const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });
            //The user has previously blocked location access and needs to manually unblock it
            if (permissionStatus.state === 'denied') {
                setLoading(false);
                setLocation('/toofar');
                return;
            }
    
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });

            setUserLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude
            });
        } catch (error) {
            console.error('Error getting user location', error);
            //The user has ignored the location access prompt
            //The modal explains why location is needed and allows the user to try again
            if (error.code === 1) {
                openModal();
            } else {
                alert('Error getting location.');
            
            }
        } finally {
            setLoading(false);
        }
    };
    const foundPigeon = pigeons.find(pigeon => pigeon.uuid.toString() === pigeonUUID);
    useEffect(() => {
        if(userLocation && foundPigeon) {
            setLoading(true);
            VerifyLocation(userLocation.lat, userLocation.lng).then(res => {
                // || (res && res[0].name !== foundPigeon.name)
                // Above condition is to ensure that the coordinate matches the found pigeon, and not just any pigeon
                if (!res) {
                    setLocation('/toofar');
                } else {
                    localStorage.setItem(foundPigeon.name, JSON.stringify(foundPigeon));
                    setSuccess(true);
                    setShowPigeon(true);
                    if (session) {
                        getSignedInProfile().then((profile) => {
                            updatePigeonsToProfile(profile[0].id, [foundPigeon.id]);
                        });
                    }
                }
            })
            .catch(err => {
                console.error(err);
            })
            .finally(() => {
                setLoading(false);
            });
        }
    }, [userLocation, foundPigeon, setLocation]);

    // TODO: Make reusable for found.js and pigeons.js
    const [pigeonUrl, setPigeonUrl] = useState('');
    useEffect(() => {
        if (foundPigeon) {
            getPublicUrl(foundPigeon.name + ".png").then((url) => {
                setPigeonUrl(url.publicUrl);
            });
        }
    }, [foundPigeon]);

    return (
        <div>
            {success ? (
                <div>
                    <h1>Success!</h1>
                    <p>You found <b>{foundPigeon.name}</b>!</p>
                    <div className="pigeon"><img src={pigeonUrl} alt={foundPigeon.name} width="600" /></div>
                    <p>Keep exploring to collect them all!</p>
                    {!session && <button onClick={() => setLocation('/signin')}>Sign in or Sign Up</button>}
                </div>
            ) : (
                <>
                    <Modal 
                        title="Here, pigeon, pigeon..."
                        isOpen={isModalOpen}
                        onClose={closeModal}
                    >
                        <p>You need to be in the same location as this pigeon to collect it, but we can't seem to find you.
                        </p>
                        <button id="allowLocationBtn" onClick={handleLocationButtonClick}>Allow access to my current location</button>
                    </Modal>
                    {loading ? <p>Verifying location...</p> : null}
                    {foundPigeon && showPigeon ? (
                        <div>
                            <h1>Congrats! You Found {foundPigeon.name}</h1>
                            <button onClick={getUserLocation}>Collect Pigeon</button>
                            {/* {loading && <p>Getting location...</p>} */}
                            {userLocation && (
                                <div>
                                    <p>Location: {userLocation.lat}, {userLocation.lng}</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        null
                    )}
                </>
            )}
        </div>
    );
    
};