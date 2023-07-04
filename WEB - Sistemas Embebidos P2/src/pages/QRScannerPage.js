import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import AdminPage from './AdminPage';
import UserPage from './UserPage';

const QRScannerPage = ({ setCurrentMenu, currentUser }) => {
  const [found, setFound] = useState(false);
  const [rutValue, setRutValue] = useState('');
  let html5QrcodeScanner;

  const onScanSuccess = (decodedText, decodedResult) => {
    if (html5QrcodeScanner === undefined) {
      alert('Scanner not initialized');
      return;
    }

    if (!decodedText.includes('?')) {
      alert('Are you scanning a proper identity document?');
      return;
    }

    const [url, query] = decodedText.split('?');

    const urlQueryParams = new URLSearchParams(query);

    const decodedRutValue = urlQueryParams.get('RUN');
    localStorage.setItem('qrscanner-rut', decodedRutValue);

    setFound(true);
    setRutValue(decodedRutValue);
  };

  useEffect(() => {
    return () => {
      if (html5QrcodeScanner) {
        html5QrcodeScanner.clear();
      }
    };
  }, []);

  const startScan = () => {
    html5QrcodeScanner = new Html5QrcodeScanner('reader', { fps: 10, qrbox: 250 });
    html5QrcodeScanner.render(onScanSuccess);
  };

  return (
    <div>
      {found ? (
        <div>
          <div className="font-sans p-12 rounded bg-gray-200 p-4 mt-3">
            <div className="ml-7" id="document-result">
              We have found a RUT! <b>{rutValue}</b>
            </div>

            {currentUser === 'admin' ? (
              <AdminPage setCurrentMenu={setCurrentMenu} />
            ) : (
              <UserPage setCurrentMenu={setCurrentMenu} />
            )}
          </div>
        </div>
      ) : (
        <div>
          <h1 className="flex items-center">
            <div className="text-sm px-2 py-1 border">QR Scanner</div>
          </h1>
          <button
            onClick={startScan}
            className="w-full bg-green-500 text-white px-6 py-4 my-2 rounded"
          >
            Start QR
          </button>
          <div style={{ width: '500px' }} id="reader"></div>
        </div>
      )}
    </div>
  );
};

export default QRScannerPage;
