# NodeScale

NodeScale is a desktop application built with Electron that reads data from a specified COM port and serves it over a local HTTP server. This application is particularly useful for interfacing with devices that communicate over serial ports, such as scales or other measurement devices.

## Features

- **COM Port Communication**: Connect to a specified COM port to read data.
- **Local HTTP Server**: Serve the read data over a local HTTP server for easy access.
- **Electron-based UI**: Simple user interface to select COM ports and view status updates.

## Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd nodescale
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the application**:
   ```bash
   npm start
   ```

## Usage

1. **Select COM Port**: Use the dropdown menu in the application to select the COM port you wish to connect to.

2. **View Data**: The application will display the current data read from the COM port.

3. **Access via HTTP**: The data is also available via a local HTTP server running at `http://localhost:8000/`.

## Dependencies

- **Electron**: For building the desktop application.
- **serialport**: For handling serial communication.
- **electron-storage**: For saving and loading configuration data.

## License

This project is licensed under the MIT License.

## Author

Zuhri
