import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase;

export async function getSignedInProfile() {
    const { data, error } = await supabase
        .from('profiles')
        .select('id, email, pigeon_ids')

    if (error) {
        console.log('Error fetching profiles: ', error);
    }

    return data
}

export async function getPigeonsFromProfile() {
    const { data, error } = await supabase
        .from('profiles')
        .select('pigeon_ids')

    if (error) {
        console.log('Error fetching pigeons: ', error);
    }

    return data
}

// TODO: postgresql query for json
export async function isPigeonInProfile(pigeonUuid) {
    const { data, error } = await supabase
        .from('profiles')
        .select('pigeon_ids')
        .or(`pigeons -> '[{"uuid": "${pigeonUuid}"}]'::jsonb`);

    if (error) {
        console.log('Error fetching profiles: ', error);
    }

    return data
}

export async function getUser() {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        return user;
    } catch (error) {
        return null;
    }
}

export async function GetPigeons() {
    const { data, error } = await supabase
        .from('pigeons')
        .select()

    if (error) {
        console.log('Error fetching pigeons: ', error);
    }

    return data
}

export async function updatePigeonsToProfile(profileId, newPigeons) {
    supabase
    .from('profiles')
    .select('pigeon_ids')
    .eq('id', profileId)
    .single()
    .then(response => {
      if (response.error) {
        console.error('Error fetching user data:', response.error);
      } else {
        const currentPigeons = response.data.pigeon_ids || [];
        let combinedPigeons = currentPigeons.concat(newPigeons);
        // Remove duplicates
        let uniquePigeons = [...new Set(combinedPigeons)]
        supabase
            .from('profiles')
            .update({ pigeon_ids: uniquePigeons })
            .eq('id', profileId)
            .then(updateResponse => {
                if (updateResponse.error) {
                    console.error('Error updating user data:', updateResponse.error);
                } else {
                    console.log('User data updated successfully:', updateResponse.data);
                    localStorage.clear();
                }
            });
        }
    });
}

export async function insertNewPigeon(pigeon) {
    const { data, error } = await supabase
        .from('pigeons')
        .insert([pigeon])

    if (error) {
        console.log('Error inserting pigeon: ', error);
    }
}

export async function deletePigeon(id) {
    const { data, error } = await supabase
        .from('pigeons')
        .delete()
        .eq('id', id)

    if (error) {
        console.log('Error deleting pigeon: ', error);
    }

}

export async function VerifyLocation(lat, long) {
    const { data, error } = await supabase.rpc('nearby_pigeon', {
        lat: lat,
        long: long,
      }) 
    if (error) {
        console.log('Error verifying location: ', error);
    }

    // if (data && data.length > 0 && data[0].name) {
    //     console.log('Pigeon Name:', data[0].name);
    // } else {
    //     console.log('No pigeon data available');
    // }

    return data;  
}

export async function getCoordinates(location) {
    const { data, error } = await supabase.rpc('geography_to_lon_lat', {geog: location}) 
    if (error) {
        console.log('Error getting coordinates: ', error);
    }

    return data;  
}

export function getLocalStoragePigeons() {
    const pigeons = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        // console.log(key);
        if (key.toLowerCase().includes('pigeon')) {
            // console.log('found pigeon')
            const pigeon = JSON.parse(localStorage.getItem(key));
            // console.log(pigeon);
            pigeons.push(pigeon);
            //localStorage.removeItem(key);
        }
    }
    return pigeons;
}

// export async function signUpNewUser(email, password) {
//     localPigeons = getLocalStoragePigeons() ? getLocalStoragePigeons() : null;
//     const { data, error } = await supabase.auth.signUp({
//       email: email,
//       password: password,
//       options: {
//         emailRedirectTo: '/',
//         data: {
//             pigeons: localPigeons
//         }
//       }
//     })
//     if (error) {
//         console.log('Error signing up: ', error);
//     } else {
//         console.log('Signed up successfully');
//         console.log(data);
//     }
//   }
  
// export async function signInUser(email, password) {
//     localPigeons = getLocalStoragePigeons() ? getLocalStoragePigeons() : null;
//     console.log('local pigeons');
//     console.log(localPigeons);
//     const { data, error } = await supabase.auth.signInWithPassword({
//         email: email,
//         password: password
//     })
//     if (error) {
//         console.log('Error signing in: ', error.message);
//     } else {
//         console.log('Signed in successfully');
//         updatePigeonsToProfile(data.user.id, localPigeons);
//         return data;
//     }
// }

// TODO: Refactor this to call updatePigeonsToProfile after log in
export async function signInGoogle() {
    const redirectUri = process.env.REDIRECT_URI || 'https://google.com';
    supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUri
        }
    })
}

export async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) {
        console.log('Error signing out: ', error.message);
        await supabase.auth._removeSession()
        await supabase.auth._notifyAllSubscribers('SIGNED_OUT', null)
    } else {
        console.log('Signed out successfully');
    }
}

export async function getPublicUrl(path) {
    const { data } = await supabase
        .storage
        .from('cards')
        .getPublicUrl(path)
    return data
}