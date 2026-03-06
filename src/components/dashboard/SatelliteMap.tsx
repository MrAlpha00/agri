"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polygon, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Map as MapIcon, Info } from "lucide-react";

// Fix for default Leaflet marker icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: '/leaflet/marker-icon-2x.png',
    iconUrl: '/leaflet/marker-icon.png',
    shadowUrl: '/leaflet/marker-shadow.png',
});

// Mock farm coordinates (Polygon) representing different fields
const farmPolygons = [
    {
        id: 1,
        positions: [
            [41.878, -93.097],
            [41.878, -93.095],
            [41.876, -93.095],
            [41.876, -93.097],
        ] as [number, number][],
        health: "Healthy",
        ndvi: 0.82, // High NDVI = green/healthy
        color: "#10b981", // Emerald
        crop: "Corn"
    },
    {
        id: 2,
        positions: [
            [41.876, -93.097],
            [41.876, -93.095],
            [41.874, -93.095],
            [41.874, -93.097],
        ] as [number, number][],
        health: "Stressed",
        ndvi: 0.45, // Low NDVI = stressed/yellow
        color: "#f59e0b", // Amber
        crop: "Soybean"
    },
    {
        id: 3,
        positions: [
            [41.878, -93.095],
            [41.878, -93.093],
            [41.874, -93.093],
            [41.874, -93.095],
        ] as [number, number][],
        health: "Critical",
        ndvi: 0.25, // Very Low NDVI = bare soil/dead
        color: "#f43f5e", // Rose
        crop: "Wheat"
    }
];

export default function SatelliteMap() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="glass-card p-6 border-slate-200 bg-white h-full flex flex-col justify-center items-center">
                <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin mb-2" />
                <p className="text-slate-500 text-sm">Loading Satellite View...</p>
            </div>
        );
    }

    return (
        <div className="glass-card p-0 border-slate-200 bg-white flex flex-col h-[400px] overflow-hidden relative">
            <div className="absolute top-4 left-4 z-[1000] bg-white/90 backdrop-blur-sm p-3 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2">
                <MapIcon className="w-5 h-5 text-brand-500" />
                <h3 className="text-sm font-semibold text-slate-900">NDVI Satellite Monitor</h3>
            </div>

            <MapContainer
                center={[41.876, -93.095]}
                zoom={15}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%', zIndex: 10 }}
            >
                {/* 
                  Using Esri World Imagery for a satellite look. 
                  In a real world app, usually require an API key (e.g. Mapbox Satellite)
                */}
                <TileLayer
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
                />

                {farmPolygons.map(farm => (
                    <Polygon
                        key={farm.id}
                        positions={farm.positions}
                        pathOptions={{
                            fillColor: farm.color,
                            fillOpacity: 0.6,
                            color: farm.color,
                            weight: 2
                        }}
                    >
                        <Popup>
                            <div className="p-1">
                                <h4 className="font-bold text-slate-900 mb-1">Field {farm.id} ({farm.crop})</h4>
                                <div className="space-y-1 text-sm">
                                    <div className="flex justify-between gap-4 border-b border-slate-100 pb-1">
                                        <span className="text-slate-500">Status:</span>
                                        <span className="font-medium" style={{ color: farm.color }}>{farm.health}</span>
                                    </div>
                                    <div className="flex justify-between gap-4">
                                        <span className="text-slate-500">NDVI:</span>
                                        <span className="font-medium text-slate-900">{farm.ndvi}</span>
                                    </div>
                                </div>
                            </div>
                        </Popup>
                    </Polygon>
                ))}
            </MapContainer>

            <div className="absolute bottom-4 left-4 z-[1000] bg-white/90 backdrop-blur-sm p-2 rounded-lg border border-slate-200 shadow-sm flex items-center gap-3 text-xs font-medium">
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-emerald-500"></div>Healthy</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-amber-500"></div>Stressed</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-rose-500"></div>Critical</div>
            </div>
        </div>
    );
}
