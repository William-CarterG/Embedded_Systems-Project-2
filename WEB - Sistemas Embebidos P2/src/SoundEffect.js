import React, { useRef } from 'react';
import useSound from 'use-sound';
import sound from './sounds/sound.mp3';
import openSoundEffect from './sounds/Open-sound-effect.mp3';

const SoundEffect = ( {audio} ) => {
  const audioRef = useRef(null);

  function play() {
    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.currentTime = 0; // Reset playback position to 0
      audioElement.play();
    }
  }

  function pause() {
    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.pause();
    }
  }

  return (
    <div>
      <li>
        <div className="flex items-center p-2 text-base font-normal justify-center text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
          <button className="flex-1 ml-3 whitespace-nowrap justify-center items-center text-white text-xl uppercase font-extrabold" onClick={play}>Play Sound</button>
        </div>
      </li>
      <li>
        <div className="flex items-center p-2 text-base font-normal justify-center text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
          <button className="flex-1 ml-3 whitespace-nowrap justify-center items-center text-white text-xl uppercase font-extrabold" onClick={pause}>Pause Sound</button>
        </div>
      </li>
      <audio ref={audioRef} src={openSoundEffect} />
    </div>
  );
};

export default SoundEffect;
