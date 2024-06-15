export function TooFar(){
    console.log("Pigeon not found!");
    return (
        <div>
            <h1>Pigeon flew away!</h1>
            <p>You might be too far away to collect your pigeon. Pigeons can only be collected by catching them in person.</p>
            <p>Otherwise, you may not have enabled location tracking. <a href="#">Why ask for your location?</a></p>
        </div>
    );
}