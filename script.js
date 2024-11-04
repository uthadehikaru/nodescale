const ipc = require("electron").ipcRenderer;

document.addEventListener("DOMContentLoaded", () => {
    const portInput = document.getElementById('port');
    portInput.addEventListener('change', () => {
        const port = portInput.value;
        ipc.send('port-change', port);
    });

    ipc.send('get-port');

    ipc.on('set-port', (event, port) => {
        console.log('set-port', port);
        portInput.value = port;
        portInput.dispatchEvent(new Event('change'));
    });

    ipc.on('status', (event, status) => {
        const statusElement = document.getElementById('status');
        if (statusElement) {
            statusElement.textContent = status;
        } else {
            console.error('Element with id "status" not found');
        }
    });

    // Listen for weight updates from the main process
    ipc.on('weight-update', (event, weight) => {
        // Update the UI with the new weight
        const infoElement = document.getElementById('info');
        if (infoElement) {
            infoElement.textContent = weight;
        } else {
            console.error('Element with id "info" not found');
        }
    });
});