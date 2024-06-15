import React, { useState, useEffect } from 'react';
import {useSession} from './SessionContext';
import { Home, Admin, Pigeons, Pigeon, Found, TooFar, SignUp } from './pages';
import { Route, Link, useLocation } from 'wouter';
import { signInGoogle, signOut } from './Supabase';

export const Nav = () => {
    const [, setLocation] = useLocation();
    const session = useSession();
    const handleSignInGoogle = () => {
        response = signInGoogle().then((response) => {
            console.log(response);
        });
    };
    const handleSignOut = () => {
        response = signOut().then((response) => {
            setLocation('/');
        });
    };

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
                <Route path="/signin" component={handleSignInGoogle} />
                <Route path="/signout" component={handleSignOut} />
                {session && session.user.role === 'admin_user' && (
                    <Route path="/admin" component={Admin} />
                )}
            </div>
    );
};
