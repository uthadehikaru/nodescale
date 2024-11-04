const { app, BrowserWindow } = require('electron/main')
const http = require('http');
const { SerialPort, ReadlineParser } = require('serialport');
const ipc = require("electron").ipcMain;
const storage = require('electron-storage');

let lastData = 0;

function saveLastPort(port) {
  storage.set('config', { port: port })
    .then(() => {
      console.log('Port saved successfully');
    })
    .catch(err => {
      console.error('Error saving port:', err);
    });
}

function loadLastPort() {
  return storage.get('config')
    .then(config => {
      return config.port || '';
    })
    .catch(err => {
      console.error('Error loading port:', err);
      return '';
    });
}

  // Create an HTTP server
  const server = http.createServer((req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*'
    });
    res.end(`${lastData}`);
});

const createWindow = () => {
  const win = new BrowserWindow({
    width: 400,
    height: 300,
    webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
    }
  })

  win.loadFile('index.html')

  ipc.on('get-port', (event) => {
    loadLastPort().then(port => {
      win.webContents.send('set-port', port);
    });
  })

  ipc.on('port-change', (event, port) => {
    saveLastPort(port);
    readPort(win, port);
  })
}

function readPort(win, port) {
  win.webContents.send('weight-update', "waiting for data...");
  win.webContents.send('status', 'Connecting to ' + port);
  // Keep track of the current serial port and parser
  if (global.currentSerialPort) {
    global.currentSerialPort.close((err) => {
      if (err) {
        console.error('Error closing port:', err.message);
      } else {
        console.log('Serial port closed');
      }
    });
  }

  if (port === "") {
    win.webContents.send('status', 'No COM Port Connected');
    return;
  }

  let serialPort = new SerialPort({
    path: port,
    baudRate: 9600
  });

  global.currentSerialPort = serialPort; // Store the current serial port globally

  serialPort.on('error', (err) => {
    console.error('Error:', err.message);
    win.webContents.send('status', 'Error: ' + err.message);
    win.webContents.send('weight-update', '');
    if (server && server.listening) {
      server.close(() => {
        win.webContents.send('status', 'Server stopped due to serial port error');
      });
    }
  });

  serialPort.on('open', () => {
    const parser = serialPort.pipe(new ReadlineParser({ delimiter: '\n' }));

    // Listen for incoming data
    parser.on('data', (data) => {
      const weightMatch = data.match(/\d+(\.\d+)?/);
      if (weightMatch) {
        const weightNumber = parseFloat(weightMatch[0]);
        console.log('Extracted weight:', weightNumber);
        lastData = weightNumber.toString();
        win.webContents.send('weight-update', 'current weight: ' + weightNumber + ' kg');
      } else {
        console.log('No valid weight number found in:', data);
        lastData = 0;
      }
    });

    // Listen on port 8000
    server.listen(8000, () => {
      console.log('Server running at http://localhost:8000/');
      win.webContents.send('status', 'Server running at http://localhost:8000/');
    });
  });
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
