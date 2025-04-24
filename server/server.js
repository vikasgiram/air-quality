const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serial port setup for Arduino on COM3
const port = new SerialPort({ path: 'COM3', baudRate: 9600 });
const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

// Serve static files from the "public" directory
app.use(express.static('public'));

// Handle serial port data
parser.on('data', (data) => {
  const match = data.match(/PPM:\s*([\d.]+)/); // Match the PPM value
  if (match) {
    const ppm = parseFloat(match[1]); // Extract the numeric value
    console.log(`PPM: ${ppm}`);
    if (!isNaN(ppm)) {
      io.emit('ppmUpdate', { ppm, status: ppm >= 1000 ? 'Bad' : 'Good' });
    }
  } else {
    console.log('No valid PPM value found');
  }
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log('Frontend connected');
  socket.on('disconnect', () => {
    console.log('Frontend disconnected');
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});