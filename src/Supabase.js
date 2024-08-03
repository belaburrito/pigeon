import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zfuzqbjeufxqlsjsjlhu.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmdXpxYmpldWZ4cWxzanNqbGh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTgzMTA5OTQsImV4cCI6MjAxMzg4Njk5NH0.geu5kkPss9uKgkp9OGRgKwZQKL-s7TfeLWnCIQZihtc"

const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase;

export async function getSignedInProfile() {
    const { data, error } = await supabase
        .from('profiles')
        .select('id, email, pigeons')

    if (error) {
        console.log('Error fetching profiles: ', error);
    }

    return data
}

export async function getPigeonsFromProfile() {
    const { data, error } = await supabase
        .from('profiles')
        .select('pigeons')

    if (error) {
        console.log('Error fetching pigeons: ', error);
    }

    return data
}

// TODO: postgresql query for json
export async function isPigeonInProfile(pigeonUuid) {
    const { data, error } = await supabase
        .from('profiles')
        .select('pigeons')
        .or(`pigeons -> '[{"uuid": "${pigeonUuid}"}]'::jsonb`);

    if (error) {
        console.log('Error fetching profiles: ', error);
    }

    return data
}

export async function getUser() {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        console.log(user);
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
    console.log(data);

    return data
}

export async function updatePigeonsToProfile(profileId, newPigeons) {
    console.log('profileId', profileId);
    supabase
    .from('profiles')
    .select('pigeons')
    .eq('id', profileId)
    .single()
    .then(response => {
      if (response.error) {
        console.error('Error fetching user data:', response.error);
      } else {
        const currentPigeons = response.data.pigeons || [];
        let combinedPigeons = currentPigeons.concat(newPigeons);

        // Remove duplicates based on a unique property, in this case 'id'
        let uniquePigeons = combinedPigeons.filter((value, index, self) =>
            index === self.findIndex((t) => (
                t.id === value.id
            ))
        );

        console.log(uniquePigeons);
        
        supabase
            .from('profiles')
            .update({ pigeons: uniquePigeons })
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
    console.log('deleting')
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
    console.log(redirectUri)
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
    } else {
        console.log('Signed out successfully');
    }
}

export async function getPublicUrl(path) {
    const { data } = await supabase
        .storage
        .from('pigeons/cards')
        .getPublicUrl(path)
    return data
}