import L from 'leaflet';
import {useEffect, useState} from "react";
import socketIOClient from "socket.io-client";
import {LayersControl, MapContainer, TileLayer, Marker} from "react-leaflet";

import {RoutingControl} from "./index";

const Map = () => {
    const endpoint = "http://localhost:4000";
    const socket = socketIOClient(endpoint);
    const [position, setPosition] = useState([0, 0])
    const [waypoints, setWaypoints] = useState(undefined);

    useEffect(() => {
        try {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const { latitude, longitude } = position.coords;
                        setPosition([latitude, longitude]);
                        socket.emit("locationUpdate", { latitude, longitude });
                        await socket.emit("createRoute");
                    },
                    (err) => {
                        console.error("Error getting location: ", err);
                    })
            }
        } catch (err) {
            console.error(err);
        }
    }, []);

    useEffect(() => {
        socket.on('getRoute', (position)=> {
            const { features } = JSON.parse(position);
            const newPosition = features.reduce((acc, item) => {
                const [long, lang] = item?.geometry?.coordinates;
                acc.push(L.latLng(long, lang));
                return acc;
            }, []);

            setWaypoints(newPosition);
        })
    }, []);

    return (
        <>
            <MapContainer
                center={position}
                zoom={3}
                zoomControl={false}
                style={{ height: "100vh", width: "100%", padding: 0 }}
            >
                <RoutingControl waypoints={waypoints} />
                <LayersControl position="topright">
                    <LayersControl.BaseLayer checked name="Map">
                        <TileLayer
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                    </LayersControl.BaseLayer>
                </LayersControl>
                <Marker position={position} />
            </MapContainer>
        </>
    )
}

export default Map;