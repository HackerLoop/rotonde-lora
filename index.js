'use strict';

const client = require('rotonde-client/node/rotonde-client')('ws://rotonde:4224');

const initializeLora = () => {
  client.eventHandlers.attach('SERIAL_READ', (e) => {
    console.log(e);
  });
  client.eventHandlers.attachOnce('SERIAL_WRITE_STATUS', (e) => {
    console.log(e);
  });
  client.sendAction('SERIAL_WRITE', {
    "port": "ttyAMA0",
    "data": "radio get freq\r\n",
    "response": "SERIAL_WRITE_STATUS"
  });
}

client.onReady(() => {
  client.bootstrap({}, [], ['SERIAL_OPEN', 'SERIAL_CLOSE']).then(() => {
    client.eventHandlers.attachOnce('SERIAL_OPEN_STATUS', (e) => {
      if (e.data.status != 'OK' && e.data.status != 'ALREADY_OPENNED') {
        client.sendAction('SERIAL_CLOSE', {
          "port": "ttyAMA0",
        });
        process.exit(1);
      }
      initializeLora();
    });
    client.sendAction('SERIAL_OPEN', {
      "port": "ttyAMA0",
      "baud": 57600,
      "parser": "READLINE",
      "separator": "\r\n",
      "response": "SERIAL_OPEN_STATUS"
    });
  });
});

client.connect();
