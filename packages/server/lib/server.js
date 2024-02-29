'use strict';

const fs = require("fs");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const express = require("express");
const locationHandlers = require("./socket/locationHandlers");

const port = 4000;
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const geoJSONFilePath = path.join(__dirname, "locations.geoJSON");

if (!fs.existsSync(geoJSONFilePath)) {
  fs.writeFileSync(geoJSONFilePath, JSON.stringify({ type: "FeatureCollection", features: [] }));
}

const onConnection = (socket) => {
  console.log("User connected");
  locationHandlers(io, socket)
}

io.on("connection", onConnection);

server.listen(port, () => {
  console.log(`Listening on port ${port}`)
})