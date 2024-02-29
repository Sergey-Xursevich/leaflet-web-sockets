import L from 'leaflet';
import { useMap } from 'react-leaflet';
import { useEffect, useRef } from 'react';

import 'leaflet-routing-machine';
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

const RoutingMachine = ({ waypoints }) => {
    const map = useMap();
    const routingControlRef = useRef(null);

    useEffect(() => {
        if (!routingControlRef.current) {
            routingControlRef.current = L.Routing.control({
                waypoints: waypoints,
                routeWhileDragging: true,
                show: false,
            }).addTo(map);
        } else {
            routingControlRef.current.setWaypoints(waypoints);
        }

        return () => {
            if (routingControlRef.current) {
                map.removeControl(routingControlRef.current);
                routingControlRef.current = null;
            }
        };
    }, [waypoints, map]);

    return null;
};

export default RoutingMachine;