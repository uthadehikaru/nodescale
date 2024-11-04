const { SerialPort } = require('serialport');

const port = new SerialPort({
    path: 'COM1',
    baudRate: 9600
});

port.on('open', () => {
    console.log('Port opened');
    setInterval(() => {
        const weight = (Math.random() * 100).toFixed(2); // Simulate weight data
        port.write(`ST,GS, ${weight} kg\n`, (err) => {
            if (err) {
                return console.log('Error on write:', err.message);
            }
            console.log('Weight data sent:', weight);
        });
    }, 1000); // Send data every second
});

