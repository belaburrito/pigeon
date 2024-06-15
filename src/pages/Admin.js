import { insertNewPigeon, deletePigeon } from "../Supabase";
import React, { useState } from 'react';

function DeletePigeonForm() {
    const [id, setId] = useState('');
    
    const handleSubmit = (e) => {
        e.preventDefault();
        deletePigeon(id);
    };
    
    return (
        <form onSubmit={handleSubmit}>
        <div>
            <label>
            ID:
            <input
                type="text"
                value={id}
                onChange={(e) => setId(parseInt(e.target.value))}
            />
            </label>
        </div>
        <button type="submit">Submit</button>
        </form>
    );
    
}

function InsertPigeonForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [lat, setLat] = useState('41.407491');
  const [long, setLong] = useState('2.157713');
  const location = `POINT(${long} ${lat})`
  const [audacity, setAudacity] = useState(0);
  const [rpm, setRpm] = useState(0);
  const [punctuality, setPunctuality] = useState(0);
  const [cunning, setCunning] = useState(0);
  const [paranoia, setParanoia] = useState(0);
  const [vogue, setVogue] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();

    const pigeonData = {
      name,
      description,
      location,
      audacity,
      rpm,
      punctuality,
      cunning,
      paranoia,
      vogue,
    };

    console.log(JSON.stringify(pigeonData));
    insertNewPigeon(pigeonData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Name:<br></br>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Description:<br></br>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Longitude - 6 chars after decimal:<br></br>
          {/* POINT(LONG LAT) */}
          {/* POINT(-73.946823 40.807416) */}
          {/* POINT(2.157713 41.407491) */}
          {/* POINT(2.170047 41.387016) */}
          <input
            type="text"
            value={long}
            onChange={(e) => setLong(e.target.value)}
          />
        </label>
      </div>

      <div>
        <label>
          Latitude - 6 chars after decimal:<br></br>
          {/* POINT(LONG LAT) */}
          {/* POINT(-73.946823 40.807416) */}
          {/* POINT(2.157713 41.407491) */}
          {/* POINT(2.170047 41.387016) */}
          <input
            type="text"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
          />
        </label>
      </div>

      <div>
        <label>
          Audacity
          <input
            type="text"
            value={audacity}
            onChange={(e) => setAudacity(e.target.value)}
          />
        </label>
      </div>

      <div>
        <label>
          RPM
          <input
            type="text"
            value={rpm}
            onChange={(e) => setRpm(e.target.value)}
          />
        </label>
      </div>

      <div>
        <label>
          Punctuality
          <input
            type="text"
            value={punctuality}
            onChange={(e) => setPunctuality(e.target.value)}
          />
        </label>
      </div>

      <div>
        <label>
          Cunning
          <input
            type="text"
            value={cunning}
            onChange={(e) => setCunning(e.target.value)}
          />
        </label>
      </div>

      <div>
        <label>
          Paranoia
          <input
            type="text"
            value={paranoia}
            onChange={(e) => setParanoia(e.target.value)}
          />
        </label>
      </div>

      <div>
        <label>
          Vogue
          <input
            type="text"
            value={vogue}
            onChange={(e) => setVogue(e.target.value)}
          />
        </label>
      </div>
      <button type="submit">Submit</button>
    </form>

    
  );
}

export function Admin() {
    
    return (
        <div>
            <h1>Admin</h1>
            <div>
                <h2>Insert new pigeon</h2>
                <InsertPigeonForm />

                <h2>Delete pigeon</h2>
                <DeletePigeonForm />
            </div>
        </div>
        
    );
}