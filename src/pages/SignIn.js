// import { signInUser, signInGoogle } from '../Supabase';
// import { useState } from 'react';
// import { useLocation } from 'wouter';


// export function SignIn() {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [, setLocation] = useLocation();

//     const handleSignIn = () => {
//         response = signInUser(email, password).then((response) => {
//             setLocation('/pigeons');
//             console.log(response);
//         });
//     };

//     const handleSignInGoogle = () => {
//         response = signInGoogle().then((response) => {
//             console.log(response);
//         });
//     };

//     const handleSignUpButtonClick = () => {
//         setLocation('/signup');
//     }

//     return (
//         <div id="signUp">
//             <button onClick={handleSignIn}>Sign In</button>
//             <button onClick={handleSignInGoogle}>Sign In with Google</button>
//             <button onClick={handleSignUpButtonClick}>Sign Up</button>
//         </div>
//     );
// }