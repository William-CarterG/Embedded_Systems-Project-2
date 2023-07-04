import React, { useEffect, useState, useRef } from 'react';
import AWS from 'aws-sdk';
import forgottenSoundEffect from '../sounds/sound.mp3';
import openSoundEffect from '../sounds/Open-sound-effect.mp3';

const TestPage = () => {
  const awsEndpoint = '';
  const awsRegion = '';
  const accessKeyId = '';
  const secretAccessKey = '';

  const [deviceShadow, setDeviceShadow] = useState(null);
  const [loading, setLoading] = useState(false);

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
  
  const audioRef = useRef(null);

  function audio_play(audioElement, soundEffect) {
    if (audioElement) {
      audioElement.currentTime = 0; // Reset playback position to 0
      audioElement.src = soundEffect; // Set the source to the provided sound effect
      audioElement.play().catch((error) => {
        console.error('Error playing audio:', error);
      });
    }
  }
  

  function pause() {
    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.pause();
    }
  }

  useEffect(() => {
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

    const getDeviceShadow = () => {
      const params = {
        thingName: 'my_esp_lamp',
      };

      iotHandler.getThingShadow(params, responseHandler);
    };

    getDeviceShadow();
  }, []);

  const updateDeviceShadow = (id) => {
    const box1State = id === '1-open' ? 1 : 0;
    const box2State = id === '2-open' ? 1 : 0;
    const box3State = id === '3-open' ? 1 : 0;
    const alarmState = 0;

    setLoading(true);

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

    if (id.includes('-open')) {
        audio_play(audioRef.current, openSoundEffect);
    } else if (id.includes('-close')) {
        audio_play(audioRef.current, forgottenSoundEffect);
    }
            
      setLoading(false);
    });
  };

  
  return (
    <div>
      <div className="flex flex-col items-center my-10">
        <div className="flex flex-row items-center my-10">
            <button
            onClick={() => updateDeviceShadow('1-open')}
            id="open"
            disabled={loading || !deviceShadow}
            className="w-48 h-48 text-6xl rounded-full border-2 border-gray-300 cursor-pointer uppercase font-sans"
            >
            OPEN
            </button>
            <button
            onClick={() => updateDeviceShadow('1-close')}
            id="close"
            disabled={loading || !deviceShadow}
            className="w-48 h-48 text-6xl rounded-full border-2 border-gray-300 cursor-pointer uppercase font-sans"
            >
            CLOSE
            </button>
            <div> Box1</div>
        </div>
        <div className="flex flex-row items-center my-10">
            <button
            onClick={() => updateDeviceShadow('2-open')}
            id="open"
            disabled={loading || !deviceShadow}
            className="w-48 h-48 text-6xl rounded-full border-2 border-gray-300 cursor-pointer uppercase font-sans"
            >
            OPEN
            </button>
            <button
            onClick={() => updateDeviceShadow('2-close')}
            id="close"
            disabled={loading || !deviceShadow}
            className="w-48 h-48 text-6xl rounded-full border-2 border-gray-300 cursor-pointer uppercase font-sans"
            >
            CLOSE
            </button>
            <div> Box2</div>
        </div>
        <div className="flex flex-row items-center my-10">
            <button
            onClick={() => updateDeviceShadow('3-open')}
            id="open"
            disabled={loading || !deviceShadow}
            className="w-48 h-48 text-6xl rounded-full border-2 border-gray-300 cursor-pointer uppercase font-sans"
            >
            OPEN
            </button>
            <button
            onClick={() => updateDeviceShadow('3-close')}
            id="close"
            disabled={loading || !deviceShadow}
            className="w-48 h-48 text-6xl rounded-full border-2 border-gray-300 cursor-pointer uppercase font-sans"
            >
            CLOSE
            </button>
            <div> Box3</div>
        </div>
      </div>
      <audio ref={audioRef} src={openSoundEffect} />

    </div>
  );
};

export default TestPage;
