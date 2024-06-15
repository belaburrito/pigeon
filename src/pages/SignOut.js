import { signOut } from '../Supabase';
import { useLocation } from 'wouter';


export function SignOut() {
    const [, setLocation] = useLocation();

    const handleSignOut = () => {
        response = signOut().then((response) => {
            setLocation('/pigeons');
        });
    };

    return (
        <div id="signUp">
            <button onClick={handleSignOut}>Sign Out</button>
        </div>
    );
}