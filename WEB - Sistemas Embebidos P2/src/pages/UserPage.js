import React, { useState, useEffect, useRef } from 'react';
import AWS from 'aws-sdk';
import forgottenSoundEffect from '../sounds/Open-sound-effect.mp3';
import openSoundEffect from '../sounds/chest-open.mp3';

function UserPage({ setCurrentMenu }) {
  // AWS Credencials
  const awsEndpoint = '';
  const awsRegion = '';
  const accessKeyId = '';
  const secretAccessKey = '';

  // Shadow update variables
  const [deviceShadow, setDeviceShadow] = useState(null);
  const [user, setUser] = useState(localStorage.getItem('qrscanner-rut'));
  

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
  const updateDeviceShadow = (box1=0, box2=0, box3=0) => {
    const box1State = box1 // === '1-open' ? 1 : 0;
    const box2State = box2 //=== '2-open' ? 1 : 0;
    const box3State = box3 // === '3-open' ? 1 : 0;
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

  useEffect(() => {
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

  }, []);
  

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
  
  const [showPassword, setShowPassword] = useState(false);
  const [passwordInputType, setPasswordInputType] = useState('password');
  const [isRetreived, setIsRetrieved] = useState(true);
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    setUser(document.getElementById('rut').value);
    const _user = document.getElementById('rut').value;
    const password = document.getElementById('password').value;
  
    const matchingBoxes = [];
  
    for (let i = 1; i <= 3; i++) {
      const storedRut = localStorage.getItem('box-' + i);
      if (storedRut === _user) {
        const storedPassword = localStorage.getItem('password-' + _user);
  
        if (storedPassword === password) {
          matchingBoxes.push(1);
        } else {
          alert('Credentials are incorrect');
          return;
        }
      } else {
        matchingBoxes.push(0);
      }
    }
  
    if (matchingBoxes.length === 0) {
      alert('RUT not found');
    } else {
      updateDeviceShadow(matchingBoxes[0], matchingBoxes[1], matchingBoxes[2]);
      await new Promise((resolve) => {
        audio_open(resolve);
      });
      const unlockedBoxes = matchingBoxes
        .map((value, index) => (value === 1 ? index + 1 : null))
        .filter((value) => value !== null)
        .join(', ');

      alert('Boxes Unlocked: ' + unlockedBoxes);

      handleRetrieveCheck();
    }
  };
  
  const handleTogglePassword = () => {
    setShowPassword((prevState) => !prevState);
    setPasswordInputType((prevState) => (prevState === 'password' ? 'text' : 'password'));
  };
  
  const handleRetrieveCheck = () => {
    setIsRetrieved(false);
    audio_play();
    // Make sound active
  };
  
  const retrieveComplete = () => {
    // Make sound inactive
    audio_pause();
  
    let boxes = [];
    for (let i = 1; i <= 3; i++) {
      const storedRut = localStorage.getItem('box-' + i);
  
      if (storedRut === user) {
        localStorage.setItem('box-' + i, '');
        localStorage.setItem('password-' + user, '');
      }
    }
    updateDeviceShadow();
    localStorage.setItem('qrscanner-rut', '')
  
    setCurrentMenu('index');
  };
  
  //localStorage.setItem('box-2', '');
  //localStorage.setItem('box-1', '');
  // localStorage.setItem('password-1', '');
  console.log(localStorage.getItem('password-20443963-K'));
  console.log(localStorage.getItem('password-1'));
  return (
    <div className="font-sans">
      <div className="p-12">
          {isRetreived ? (
            <form onSubmit={handleSubmit} className="rounded bg-gray-200 p-4">
              <h1 className="flex items-center">
                <div className="text-sm px-2 py-1 border">Usuario</div>
              </h1>
              <input
                id="rut"
                type="text"
                placeholder="RUT"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                className="w-full px-4 py-3 my-2 border rounded"
                readOnly={localStorage.getItem('qrscanner-rut') !== ''}
              />
              <div className="relative">
                <input
                  id="password"
                  type={passwordInputType}
                  placeholder="Password"
                  className="w-full px-4 py-3 my-2 border rounded"
                />
                <button
                  type="button"
                  className="absolute top-1/2 right-4 transform -translate-y-1/2 text-sm text-gray-500 focus:outline-none"
                  onClick={handleTogglePassword}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                      <path d="M3.53 2.47a.75.75 0 00-1.06 1.06l18 18a.75.75 0 101.06-1.06l-18-18zM22.676 12.553a11.249 11.249 0 01-2.631 4.31l-3.099-3.099a5.25 5.25 0 00-6.71-6.71L7.759 4.577a11.217 11.217 0 014.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113z" />
                      <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0115.75 12zM12.53 15.713l-4.243-4.244a3.75 3.75 0 004.243 4.243z" />
                      <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 00-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 016.75 12z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                      <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                      <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              </div>
              <button
              type="submit"
              className="w-full bg-green-500 text-white px-6 py-4 my-2 rounded">
                Unlock My Containers
              </button>
            </form>
        ) : (
          <button
            onClick={retrieveComplete}
            type="submit"
            className="w-full bg-green-500 text-white py-2 px-4 rounded font-bold"
          >
            Click when document is retrieved.
          </button>
        )}
      </div>
      <audio ref={audioRef} />
    </div>
  );
}

export default UserPage;
