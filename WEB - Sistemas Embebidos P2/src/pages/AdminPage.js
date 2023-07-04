import React, { useState, useEffect, useRef } from 'react';
import AWS from 'aws-sdk';
import forgottenSoundEffect from '../sounds/Open-sound-effect.mp3';
import openSoundEffect from '../sounds/chest-open.mp3';


const AdminPage = ({ setCurrentMenu}) => {
  // AWS Credencials
  const awsEndpoint = '';
  const awsRegion = '';
  const accessKeyId = '';
  const secretAccessKey = '';

  // Shadow update variables
  const [deviceShadow, setDeviceShadow] = useState(null);

  // Updates state of app after modifying shadow
  const updateAppState = (newShadow) => {
    try {
      if (newShadow.state.desired.led.onboard === 0) {
        setDeviceShadow(newShadow);
      } else {
        setDeviceShadow(newShadow);
      }
    } catch (err) {
      console.error('Error updating device shadow:', err);
    }
  };

// Updates device shadow.
  const updateDeviceShadow = (id) => {
    const box1State = id === '1-open' ? 1 : 0;
    const box2State = id === '2-open' ? 1 : 0;
    const box3State = id === '3-open' ? 1 : 0;
    const alarmState = 0;


    const payload = {
      state: {
        desired: {
          led: {
            onboard: box1State,
            box2: box2State,
            box3: box3State,
            alarm: alarmState,
          },
          box1:{
            remove:null,
            state:null,
            status: null
          }
        },
    
      },
    };

    const params = {
      payload: JSON.stringify(payload),
      thingName: 'my_esp_lamp',
    };

    const iotHandler = new AWS.IotData({ endpoint: awsEndpoint });
    iotHandler.updateThingShadow(params, (err, data) => {
      if (err) {
        console.error('Error updating device shadow:', err);
      } else {
        const newShadow = JSON.parse(data.payload);

        console.log('Device shadow updated:', newShadow);

        updateAppState(newShadow);
      }
    });
  };

  // Data variables
  const [rut, setRut] = useState(localStorage.getItem('qrscanner-rut'));
  const [compartment, setCompartment] = useState('1');
  
  const [isStored, setIsStored] = useState(true); // Makes sure the right buttons are shown.


  // Generates random password of 4 numbers.
  const generatePassword = () => {
    const min = 1000; // Minimum value (inclusive)
    const max = 9999; // Maximum value (inclusive)
    const password = Math.floor(Math.random() * (max - min + 1)) + min;
    return password.toString();
  };

  //localStorage.setItem('box-1', '')
  //localStorage.setItem('box-2', '')
  //localStorage.setItem('box-3', '')

  useEffect(() => {
    for(let i=1; i<4; i++){
      if(localStorage.getItem(`box-${i}`) === '' || localStorage.getItem(`box-${i}`) === null){
        setCompartment(i.toString());
        break;
      }
    };
    // Sets up AWS connection
    AWS.config.update({
      region: awsRegion,
      credentials: new AWS.Credentials({
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
      }),
    });

    const iotHandler = new AWS.IotData({ endpoint: awsEndpoint });

    const responseHandler = (err, data) => {
      if (err) {
        console.error('Error updating device shadow:', err);
      } else {
        const newShadow = JSON.parse(data.payload);

        console.log('Device shadow updated:', newShadow);

        updateAppState(newShadow);
      }
    };


    // Sets up initial state
    const getDeviceShadow = () => {
      const params = {
        thingName: 'my_esp_lamp',
      };

      iotHandler.getThingShadow(params, responseHandler);
    };
    getDeviceShadow();

    // Checks whether user selected a box and click the the 'Store' button.
    const localStorageKey = `box-${compartment}`;
    const localStorageValue = localStorage.getItem(localStorageKey);
    setIsStored(true);
    
  }, [compartment]);

  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  function audio_open(callback) {
    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
      audioElement.src = openSoundEffect;
      audioElement.loop = false;
      audioElement.addEventListener('ended', callback);
      audioElement.play();
    }
  }
  
  function audio_play() {
    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
      audioElement.src = forgottenSoundEffect;
  
      audioElement.addEventListener('canplaythrough', () => {
        setIsPlaying(true);
        audioElement.loop = true;
        audioElement.play();
      });
    }
  }
  
  function audio_pause() {
    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.pause();
      audioElement.loop = false;
      setIsPlaying(false);
    }
  }

  const handleFormSubmit = async (event) => {
    console.timeLog("Hols llegue con rut", rut);
    event.preventDefault();
    let localStorageKey;
    
    if (compartment === '1') {
      localStorageKey = 'box-1';
      localStorage.setItem(localStorageKey, rut);
    } else if (compartment === '2') {
      localStorageKey = 'box-2';
      localStorage.setItem(localStorageKey, rut);
    } else if (compartment === '3') {
      localStorageKey = 'box-3';
      localStorage.setItem(localStorageKey, rut);
    }
    
    const passwordKey = `password-${rut}`;
    let password
    if(localStorage.getItem(passwordKey) === '' || localStorage.getItem(passwordKey) === null){
      password = generatePassword();
      localStorage.setItem(passwordKey, password);
    }
    else{
      password = localStorage.getItem(passwordKey);
    }
    
    // Implement aws request to open box.
    updateDeviceShadow(`${compartment}-open`);
    await new Promise((resolve) => {
      audio_open(resolve);
    });

    window.alert(`Puedes guardar tu documento en el compartimiento ${compartment}.\nLa contraseña para usuario con rut '${rut}' es:\n${password}.`);
    setIsStored(false);
    audio_play();
  };



  const storedComplete = () => {
    setIsStored(true);
    // Make sound alarm inactive.
    audio_pause();

    // Make aws request to close box.
    updateDeviceShadow(`${compartment}-close`);
    localStorage.setItem('qrscanner-rut', '')
    // Exit to home
    setCurrentMenu('index')
  }

  return (
    <div className="p-8">
      {isStored ? (
        
        <form onSubmit={handleFormSubmit}>
          <h3 className="mb-3 tracking-widest">Ingresar documento</h3>
          <label htmlFor="rutInput">Ingrese RUT:</label>
          <input
            type="text"
            id="rutInput"
            placeholder="RUT"
            value={rut}
            onChange={(e) => setRut(e.target.value)}
            required
            className={`w-full py-2 px-4 mb-4 border rounded`}
            readOnly={localStorage.getItem('qrscanner-rut') !== ''}
          />


          <label htmlFor="compartment">Escoja un compartimiento:</label>
          <select
            name="compartment"
            id="compartment"
            value={compartment}
            onChange={(e) => setCompartment(e.target.value)}
            className="w-full py-2 px-4 mb-4 border border-gray-300 rounded"
          >
            {['1', '2', '3'].map((option) => {
              const localStorageValue = localStorage.getItem(`box-${option}`);
              if (localStorageValue === null || localStorageValue === '') {
                
                return <option key={option} value={option}>{option}</option>;
              }
              return null;
            })}
          </select>
          <button
            onClick={handleFormSubmit}
            type="submit"
            className="w-full bg-green-500 text-white py-2 px-4 rounded font-bold"
          >
            Store document
          </button>
        </form>
      ) : (
        <button
          onClick={storedComplete}
          className="w-full bg-green-500 text-white py-2 px-4 rounded font-bold"
        >
          Click when document storing is finished!.
        </button>
      )}
      <audio ref={audioRef} />
    </div>
  );
};

export default AdminPage;


