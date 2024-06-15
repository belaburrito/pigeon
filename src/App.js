import React from "react";
import { PigeonProvider } from "./PigeonProvider";
// import { supabase } from './Supabase'
// import { Auth } from '@supabase/auth-ui-react'
// import { ThemeSupa } from '@supabase/auth-ui-shared'
import { SessionProvider } from "./SessionProvider";
import { Nav } from "./Nav";

export function App() {    
    return (
        <PigeonProvider>
            <SessionProvider>
                <Nav />
            </SessionProvider>
        </PigeonProvider>
    );
}

