import React, { useEffect, useState } from 'react';
import IndexPage from './pages/IndexPage';
import UserPage from './pages/UserPage';
import AdminPage from './pages/AdminPage';
import QRScannerPage from './pages/QRScannerPage';
import SelectUser from './util/SelectUser';

import TestPage from './aws/TestPage';

import AWS from 'aws-sdk';

const App = () => {
  // Connection Status
  const [isConnected, setIsConnected] = useState(true);
  const [testConnection, setTestConnection] = useState(1);
  // AWS Credentials
  const awsEndpoint = '';
  const awsRegion = '';
  const accessKeyId = '';
  const secretAccessKey = '';

  useEffect(() => {
    AWS.config.update({
      region: awsRegion,
      credentials: new AWS.Credentials({
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
      }),
    });

    const iotHandler = new AWS.IotData({ endpoint: awsEndpoint });
    let test = 0;

    const responseHandler = (err, data) => {
      if (err) {
        console.error('Error updating device shadow:', err);
      } else {
        const newShadow = JSON.parse(data.payload);
        test += 1
        console.log('Device shadow updated:', newShadow);
        if (test == newShadow.state.reported.isRunning){
          
          setIsConnected(true);
        }
        else if (newShadow.state.reported.isRunning == 1){
          test = 1;
          setIsConnected(true);
        }
        else{
          setIsConnected(false);
        }
      }
    };

    const getDeviceShadow = () => {
      const params = {
        thingName: 'my_esp_lamp',
      };

      iotHandler.getThingShadow(params, responseHandler);
    };
    const checkConnection = () => {
      try {
        getDeviceShadow()
      } catch (error) {
        setIsConnected(false);
        //setIsDeviceRunning(false);
      }
    };

    // Check connection every 5 seconds
    const interval = setInterval(checkConnection, 5000);

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const [currentMenu, setCurrentMenu] = useState('index');
  const [currentUser, setCurrentUser] = useState('');


  let currentPage;

  switch (currentMenu) {
    case 'index':
      currentPage = <IndexPage />;
      break;
    case 'user':
      currentPage = <UserPage setCurrentMenu={setCurrentMenu} />;
      break;
    case 'admin':
      currentPage = <AdminPage setCurrentMenu={setCurrentMenu}/>;
      break;
    case 'qr':
      currentPage = <QRScannerPage setCurrentMenu={setCurrentMenu} currentUser={currentUser}/>;
      break;
    case 'test':
      currentPage = <TestPage />;
      break;
    default:
      currentPage = <IndexPage />;
  };

  const handleSelectUser = () => {
    setCurrentUser('');
    setCurrentMenu('index');
  };

  const handleLogOut = () => {
    handleSelectUser();
    // implement log out logic
  };

  return (
    <div>
      {currentUser !== '' ? (
        <div className="flex h-screen bg-gray-50">
          <aside className="w-1/6 bg-gray-50 dark:bg-gray-800" aria-label="Sidebar">
            <div className="px-3 py-4 overflow-y-auto rounded bg-gray-50 dark:bg-gray-800 flex flex-col justify-between h-full">
              <div>
                <ul className="space-y-2">
                  {/* Home view screen */}
                  <li>
                    <div onClick={() => setCurrentMenu('index')}
                      className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                      <svg className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" 
                      xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                        <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
                      </svg>
                      <span className="ml-3">Home</span>
                    </div>
                  </li>
                  {/* Store/Retreive document */}
                  {currentUser === 'admin' ? (
                    <li>
                      <div onClick={() => setCurrentMenu('admin')}
                        className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                        <svg className="w-6 h-6 text-gray-00 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" 
                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M3.375 3C2.339 3 1.5 3.84 1.5 4.875v.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375z" />
                          <path fillRule="evenodd" d="M3.087 9l.54 9.176A3 3 0 006.62 21h10.757a3 3 0 002.995-2.824L20.913 9H3.087zm6.163 3.75A.75.75 0 0110 12h4a.75.75 0 010 1.5h-4a.75.75 0 01-.75-.75z" clipRule="evenodd" />
                        </svg>
                        <span className="ml-3">Store document</span>
                      </div>
                    </li>
                  ):(
                    <li>
                      <div onClick={() => setCurrentMenu('user')}
                        className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                        <svg className="w-6 h-6 text-gray-00 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" 
                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M3.375 3C2.339 3 1.5 3.84 1.5 4.875v.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375z" />
                          <path fillRule="evenodd" d="M3.087 9l.54 9.176A3 3 0 006.62 21h10.757a3 3 0 002.995-2.824L20.913 9H3.087zm6.163 3.75A.75.75 0 0110 12h4a.75.75 0 010 1.5h-4a.75.75 0 01-.75-.75z" clipRule="evenodd" />
                        </svg>
                        <span className="ml-3">Retreive document</span>
                      </div>
                    </li>
                  )}
                  {/* QR scanner view */}
                  <li>
                    <div onClick={() => setCurrentMenu('qr')}
                      className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                        <path fillRule="evenodd" d="M3 4.875C3 3.839 3.84 3 4.875 3h4.5c1.036 0 1.875.84 1.875 1.875v4.5c0 1.036-.84 1.875-1.875 1.875h-4.5A1.875 1.875 0 013 9.375v-4.5zM4.875 4.5a.375.375 0 00-.375.375v4.5c0 .207.168.375.375.375h4.5a.375.375 0 00.375-.375v-4.5a.375.375 0 00-.375-.375h-4.5zm7.875.375c0-1.036.84-1.875 1.875-1.875h4.5C20.16 3 21 3.84 21 4.875v4.5c0 1.036-.84 1.875-1.875 1.875h-4.5a1.875 1.875 0 01-1.875-1.875v-4.5zm1.875-.375a.375.375 0 00-.375.375v4.5c0 .207.168.375.375.375h4.5a.375.375 0 00.375-.375v-4.5a.375.375 0 00-.375-.375h-4.5zM6 6.75A.75.75 0 016.75 6h.75a.75.75 0 01.75.75v.75a.75.75 0 01-.75.75h-.75A.75.75 0 016 7.5v-.75zm9.75 0A.75.75 0 0116.5 6h.75a.75.75 0 01.75.75v.75a.75.75 0 01-.75.75h-.75a.75.75 0 01-.75-.75v-.75zM3 14.625c0-1.036.84-1.875 1.875-1.875h4.5c1.036 0 1.875.84 1.875 1.875v4.5c0 1.035-.84 1.875-1.875 1.875h-4.5A1.875 1.875 0 013 19.125v-4.5zm1.875-.375a.375.375 0 00-.375.375v4.5c0 .207.168.375.375.375h4.5a.375.375 0 00.375-.375v-4.5a.375.375 0 00-.375-.375h-4.5zm7.875-.75a.75.75 0 01.75-.75h.75a.75.75 0 01.75.75v.75a.75.75 0 01-.75.75h-.75a.75.75 0 01-.75-.75v-.75zm6 0a.75.75 0 01.75-.75h.75a.75.75 0 01.75.75v.75a.75.75 0 01-.75.75h-.75a.75.75 0 01-.75-.75v-.75zM6 16.5a.75.75 0 01.75-.75h.75a.75.75 0 01.75.75v.75a.75.75 0 01-.75.75h-.75a.75.75 0 01-.75-.75v-.75zm9.75 0a.75.75 0 01.75-.75h.75a.75.75 0 01.75.75v.75a.75.75 0 01-.75.75h-.75a.75.75 0 01-.75-.75v-.75zm-3 3a.75.75 0 01.75-.75h.75a.75.75 0 01.75.75v.75a.75.75 0 01-.75.75h-.75a.75.75 0 01-.75-.75v-.75zm6 0a.75.75 0 01.75-.75h.75a.75.75 0 01.75.75v.75a.75.75 0 01-.75.75h-.75a.75.75 0 01-.75-.75v-.75z" clipRule="evenodd" />
                      </svg>

                      <span className="flex-1 ml-3 whitespace-nowrap">QR Scan</span>
                    </div>
                  </li>
                  {/* Change role view */}
                  <li>
                    <div onClick={handleSelectUser}
                      className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" 
                      className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                        <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 01-.372-.568 6.787 6.787 0 011.019-4.38z" clipRule="evenodd" />
                        <path d="M5.082 14.254a8.287 8.287 0 00-1.308 5.135 9.687 9.687 0 01-1.764-.44l-.115-.04a.563.563 0 01-.373-.487l-.01-.121a3.75 3.75 0 013.57-4.047zM20.226 19.389a8.287 8.287 0 00-1.308-5.135 3.75 3.75 0 013.57 4.047l-.01.121a.563.563 0 01-.373.486l-.115.04c-.567.2-1.156.349-1.764.441z" />
                      </svg>

                      <span className="flex-1 ml-3 whitespace-nowrap">Select Role</span>
                      <span className="inline-flex items-center justify-center w-3 h-3 p-3 ml-3 text-sm font-medium text-blue-600 bg-blue-200 rounded-full dark:bg-blue-900 dark:text-blue-200">
                        2
                      </span>
                    </div>
                  </li>
                  {/* Test view */}
                  <li>
                    <div onClick={() => setCurrentMenu('test')}
                      className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                        <path d="M12 .75a8.25 8.25 0 00-4.135 15.39c.686.398 1.115 1.008 1.134 1.623a.75.75 0 00.577.706c.352.083.71.148 1.074.195.323.041.6-.218.6-.544v-4.661a6.714 6.714 0 01-.937-.171.75.75 0 11.374-1.453 5.261 5.261 0 002.626 0 .75.75 0 11.374 1.452 6.712 6.712 0 01-.937.172v4.66c0 .327.277.586.6.545.364-.047.722-.112 1.074-.195a.75.75 0 00.577-.706c.02-.615.448-1.225 1.134-1.623A8.25 8.25 0 0012 .75z" />
                        <path fillRule="evenodd" d="M9.013 19.9a.75.75 0 01.877-.597 11.319 11.319 0 004.22 0 .75.75 0 11.28 1.473 12.819 12.819 0 01-4.78 0 .75.75 0 01-.597-.876zM9.754 22.344a.75.75 0 01.824-.668 13.682 13.682 0 002.844 0 .75.75 0 11.156 1.492 15.156 15.156 0 01-3.156 0 .75.75 0 01-.668-.824z" clipRule="evenodd" />
                      </svg>


                      <span className="flex-1 ml-3 whitespace-nowrap">Test Page</span>
                    </div>
                  </li>
                </ul>
              </div>
              <div>
                <ul className="space-y-2">
                  {/* Log Out button */}
                  <li>
                    <div onClick={handleLogOut}
                      className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                        <path fillRule="evenodd" d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm5.03 4.72a.75.75 0 010 1.06l-1.72 1.72h10.94a.75.75 0 010 1.5H10.81l1.72 1.72a.75.75 0 11-1.06 1.06l-3-3a.75.75 0 010-1.06l3-3a.75.75 0 011.06 0z" clipRule="evenodd" />
                      </svg>

                      <span className="flex-1 ml-3 whitespace-nowrap">Log Out</span>
                    </div>
                  </li>
                  {/* User information */}
                  <li>
                    <div 
                      className="flex items-center p-2 text-base font-normal justify-center text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                      <span className="flex-1 ml-3 whitespace-nowrap justify-center items-center text-white text-xl uppercase font-extrabold">{currentUser}</span>
                      {/* Connection status */}
                      <span className={`${
                        isConnected ? 'text-green-500' : 'text-red-500'
                      } mr-8 text-l font-bold`}>
                        {isConnected ? 'Connected' : 'Not Connected'}
                      </span>

                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </aside>
        
          <div className="h-screen w-5/6 bg-gray-50">
            {/* Header */}
            <header className=''>
              <h1 className="bg-gray-300 py-4 text-center">
                <div className="text-xl font-bold text-gray-700 cursor-pointer">
                  WELCOME TO YOUR DOCUMENT DISPENSER
                </div>
              </h1>
              <nav className="mt-6">
                <ul className="flex justify-center items-center space-x-4">
                  <li>
                    <div onClick={() => setCurrentMenu('index')} className="text-md font-semibold text-gray-600 hover:text-gray-800">
                      Home
                    </div>
                  </li>
                  <li>
                    <div onClick={() => setCurrentMenu('admin')} className="text-md font-semibold text-gray-600 hover:text-gray-800">
                      Store Document
                    </div>
                  </li>
                  <li>
                    <div onClick={() => setCurrentUser('')} className="text-md font-semibold text-gray-600 hover:text-gray-800">
                      Exit
                    </div>
                  </li>
                </ul>
              </nav>
            </header>
            <section className="body-font text-gray-600">
              {currentPage}
            </section>
          </div>
        </div>
        
      ) : (
        <SelectUser setCurrentMenu={setCurrentMenu} setCurrentUser={setCurrentUser} />
      )}
      
    </div>
  );
};

export default App;