const http = require('http');
const { SerialPort, ReadlineParser } = require('serialport');

const port = new SerialPort({
    path: 'COM2',
    baudRate: 9600
});

const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));


let lastData = 0;

// Listen for incoming data
parser.on('data', (data) => {
    // console.log('Received data:', data);
    // Extract only the weight number from the received data
    const weightMatch = data.match(/\d+(\.\d+)?/);
    if (weightMatch) {
        const weightNumber = parseFloat(weightMatch[0]);
        console.log('Extracted weight:', weightNumber);
        lastData = weightNumber.toString(); // Update lastData with only the weight number
    } else {
        console.log('No valid weight number found in:', data);
        lastData = 0;
    }
});

port.on('error', (err) => {
    console.error('Error:', err.message);
});

// Create an HTTP server
const server = http.createServer((req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*'
    });
    res.end(`${lastData}`);
});

// Listen on port 8000
server.listen(8000, () => {
    console.log('Server running at http://localhost:8000/');
});
