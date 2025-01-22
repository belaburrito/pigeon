import {useSession} from './SessionContext';
import { useEffect } from "react";
import { Home, Admin, Pigeons, Pigeon, Found, TooFar, SignUp } from './pages';
import { Route, Link, useLocation } from 'wouter';
import { signInGoogle, signOut } from './Supabase';

const SignInPage = () => {
    useEffect(() => {
        signInGoogle().then((response) => {
            console.log(response);
        });
    }, []);
    return <div>Signing in...</div>;
};

const SignOutPage = () => {
    const [, setLocation] = useLocation();
    
    useEffect(() => {
        const doSignOut = async () => {
            await signOut();
            setLocation('/');
        };
        doSignOut();
    }, [setLocation]);
    
    return <div>Signing out...</div>;
};

export const Nav = () => {
    const session = useSession();
    return (
            <div className="nav-container">
                <nav>
                    <Link href="/">Home</Link>
                    <Link href="/pigeons">Pigeons</Link>

                {session && session?.user?.app_metadata?.role === 'admin_user' && (
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
                <Route path="/signin" component={SignInPage} />
                <Route path="/signout" component={SignOutPage} />
                {session && session?.user?.app_metadata?.role === 'admin_user' && (
                    <Route path="/admin" component={Admin} />
                )}
            </div>
    );
};
