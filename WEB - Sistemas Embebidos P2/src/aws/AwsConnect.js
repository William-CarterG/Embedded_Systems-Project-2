import React, { useEffect } from 'react';
import AWS from 'aws-sdk';

const AwsConnect = () => {
  useEffect(() => {
    const awsEndpoint = '';
    const awsRegion = '';
    const accessKeyId = 'YOUR_ACCESS_KEY_ID';
    const secretAccessKey = 'YOUR_SECRET_ACCESS_KEY';

    AWS.config.update({
      region: awsRegion,
      credentials: new AWS.Credentials({
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
      }),
    });

    const iotHandler = new AWS.IotData({ endpoint: awsEndpoint });

    function updateAppState(newShadow) {
      console.log("Button clicked", newShadow);
      const onButton = document.getElementById('open');
      const offButton = document.getElementById('close');

      onButton.classList.remove('loading');
      offButton.classList.remove('loading');

      try {
        if (newShadow.state.desired.led.onboard === 0) {
          offButton.disabled = true;
          onButton.disabled = false;
        } else {
          offButton.disabled = false;
          onButton.disabled = true;
        }
      } catch (err) {
        console.error('Error updating device shadow:', err);
      }
    }

    function responseHandler(err, data) {
      if (err) {
        console.error('Error updating device shadow:', err);
      } else {
        const newShadow = JSON.parse(data.payload);

        console.log('Device shadow updated:', newShadow);

        updateAppState(newShadow);
      }
    }

    function updateDeviceShadow(event) {
      const { id } = event.target;

      event.target.classList.add('loading');
      const ledValue = id === 'open' ? 1 : 0;

      const payload = {
        state: {
          desired: {
            led: {
              onboard: ledValue,
            },
          },
        },
      };

      const params = {
        payload: JSON.stringify(payload),
        thingName: 'my_esp_lamp',
      };
      iotHandler.updateThingShadow(params, responseHandler);
    }

    function getDeviceShadow() {
      const params = {
        thingName: 'my_esp_lamp',
      };

      iotHandler.getThingShadow(params, responseHandler);
      console.log("Initial state");
    }
    
    getDeviceShadow();
  }, []);

  return <></>; // Empty fragment as we don't have any JSX elements in this version
};

export default AwsConnect;
