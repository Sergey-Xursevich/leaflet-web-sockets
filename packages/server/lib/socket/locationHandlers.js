const fs = require("fs");
const path = require("path");

module.exports = (io, socket) => {
    const geoJSONFilePath = path.join(__dirname, "../locations.geoJSON");

    const randFloat = (min, max) => {
        return Math.random() * (max - min) + min;
    }

    const disconnect = () => {
        console.log("User disconnected");
        fs.writeFileSync(geoJSONFilePath, JSON.stringify({ type: "FeatureCollection", features: [] }));
    }

    const setLocation = (location) => {
        console.log("Location update received:", location);

        const geoJSONData = JSON.parse(fs.readFileSync(geoJSONFilePath));
        geoJSONData.features.push({
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [location.longitude, location.latitude]
            },
            properties: {}
        });

        fs.writeFileSync(geoJSONFilePath, JSON.stringify(geoJSONData));
    }

    const createRoute = () => {
        return new Promise((resolve, reject) => {
            let count = 0;

            const intervalId = setInterval(() => {
                count++;

                const longitude = randFloat(17, 52);
                const latitude = randFloat(16, 52);
                setLocation({latitude, longitude});

                if (count === 3) {
                    clearInterval(intervalId);
                    fs.readFile(geoJSONFilePath, { encoding: "utf8", flag: "r" }, (err, data) => {
                        if (err) {
                            reject(err);
                        } else {
                            socket.emit("getRoute", data);
                            resolve(data);
                        }
                    });
                }
            }, 2000);
        })
    }

    socket.on("disconnect", disconnect);
    socket.on("setLocation", setLocation);
    socket.on("createRoute", createRoute);
}