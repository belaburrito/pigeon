import React, { useState, useEffect } from 'react';
import {useSession} from './SessionContext';
import { Home, Admin, Pigeons, Pigeon, Found, TooFar, SignUp, SignIn, SignOut } from './pages';
import { Route, Link, useLocation } from 'wouter';
import { getUser } from './Supabase';
import supabase from './Supabase';

export const Nav = () => {
    const session = useSession();
    // const [role, setRole] = useState(null);
    // useEffect(() => {
    //     supabase.auth.onAuthStateChange((event, session) => {
    //         if (event === 'SIGNED_OUT') {
    //             setRole(null);
    //             return;
    //         }
    //     });
    //     supabase.auth.onAuthStateChange((event, session) => {
    //         if (event === 'SIGNED_IN') {
    //             getUser()
    //                 .then(user => {
    //                     setRole(user.role);
    //                 })
    //                 .catch(error => {
    //                     setRole(null);
    //                 });
    //         }
    //     });
    // }, [])

    return (
            <div className="nav-container">
                <nav>
                    <Link href="/">Home</Link>
                    <Link href="/pigeons">Pigeons</Link>

                {session && session.user.role === 'admin_user' && (
                    <Link href="/admin">Admin</Link>
                )}
            
                {!session ? (
                    <Link href="/signin">Sign In</Link>
                ) : (
                    <Link href="/signout">Sign Out</Link>
                )}
                </nav>
                <Route path="/" component={Home} />
                <Route path="/pigeons" component={Pigeons} />
                <Route path="/pigeons/:id" component={Pigeon} />
                <Route path="/found/:id" component={Found} />
                <Route path="/toofar" component={TooFar} />
                <Route path="/signup" component={SignUp} />
                <Route path="/signin" component={SignIn} />
                <Route path="/signout" component={SignOut} />
                {session && session.user.role === 'admin_user' && (
                    <Route path="/admin" component={Admin} />
                )}
            </div>
    );
};
