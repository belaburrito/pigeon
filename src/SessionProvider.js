import React, { useState, useEffect } from 'react';
import {SessionContext} from './SessionContext';
import supabase from './Supabase.js';

export const SessionProvider = ({ children }) => {
    const [session, setSession] = useState(null);

    // useEffect(() => {
    //     const subscription = supabase.auth.onAuthStateChange((event, session) => {
    //         console.log(event, session);
    //         if (event === 'SIGNED_OUT') {
    //             setSession(null)
    //             setUserRole(null)
    //         } else if (session) {
    //             setSession(session);
    //             // const role = await fetchUserRole(session.user.id);
    //             setUserRole("role");
    //         }
    //     });

    //     return () => {
    //         subscription.unsubscribe();
    //     };
    // }, []);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });
        return () => subscription.unsubscribe();
    }, []);

    return (
        <SessionContext.Provider value={session}>
            {children}
        </SessionContext.Provider>
    );
};