'use strict';

const express = require('express'),
    https = require('https'),
    { Server } = require('socket.io'),
    fs = require('fs'),
    path = require('path');

const app = express();
const server = https.createServer(app);
const io = new Server(server);
const port = 3000;

const geoJSONFilePath = path.join(__dirname, 'locations.geoJSON');

if (!fs.existsSync(geoJSONFilePath)) {
  fs.writeFileSync(geoJSONFilePath, JSON.stringify({ type: 'FeatureCollection', features: [] }));
}

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('locationUpdate', (location) => {
    console.log('Location update received:', location);

    const geoJSONData = JSON.parse(fs.readFileSync(geoJSONFilePath));
    geoJSONData.features.push({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [location.longitude, location.latitude]
      },
      properties: {}
    });

    fs.writeFileSync(geoJSONFilePath, JSON.stringify(geoJSONData));
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})