"use client";

import { useEffect, useState } from "react";
import { CloudRain, Wind, Thermometer, Droplets, AlertTriangle } from "lucide-react";

interface WeatherData {
    temperature: number;
    humidity: number;
    precipitation: number;
    windSpeed: number;
}

export default function WeatherWidget() {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Default to a central agricultural region if geolocation fails/denied
    // For demo purposes, we will just use a fixed location (e.g., Kansas/Midwest or India) to simulate
    // Let's use a dynamic approach by trying geolocation first.

    useEffect(() => {
        const fetchWeather = async (lat: number, lon: number) => {
            try {
                // Open-Meteo free API
                const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m`);
                if (!res.ok) throw new Error("Failed to fetch weather data");

                const data = await res.json();

                setWeather({
                    temperature: data.current.temperature_2m,
                    humidity: data.current.relative_humidity_2m,
                    precipitation: data.current.precipitation,
                    windSpeed: data.current.wind_speed_10m
                });
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    fetchWeather(position.coords.latitude, position.coords.longitude);
                },
                () => {
                    // Fallback to a default agricultural region (e.g., Iowa, USA)
                    fetchWeather(41.8780, -93.0977);
                }
            );
        } else {
            // Fallback
            fetchWeather(41.8780, -93.0977);
        }
    }, []);

    if (loading) {
        return (
            <div className="glass-card p-6 border-slate-200 bg-white h-full flex flex-col justify-center items-center">
                <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin mb-2" />
                <p className="text-slate-500 text-sm">Fetching weather patterns...</p>
            </div>
        );
    }

    if (error || !weather) {
        return (
            <div className="glass-card p-6 border-slate-200 bg-white h-full flex items-center justify-center text-slate-500 text-sm">
                Unavailable to load weather intelligence.
            </div>
        );
    }

    // Disease Risk Logic
    let riskLevel = "Low";
    let warningMessage = "";

    // Simple heuristic model for Blight/Fungal infection risk
    if (weather.humidity > 80 && weather.temperature > 20 && weather.temperature < 30) {
        riskLevel = "High";
        warningMessage = "High risk of fungal infection (like Blight) due to elevated humidity and optimal temperatures.";
    } else if (weather.humidity > 70 || weather.precipitation > 0) {
        riskLevel = "Moderate";
        warningMessage = "Moderate disease risk due to moisture.";
    } else if (weather.temperature > 35 && weather.precipitation === 0) {
        riskLevel = "Moderate";
        warningMessage = "Heat stress risk. Ensure adequate irrigation.";
    } else {
        warningMessage = "Conditions are optimal. Disease risk is low.";
    }

    return (
        <div className="glass-card p-6 border-slate-200 bg-white flex flex-col h-full">
            <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <CloudRain className="w-5 h-5 text-brand-500" />
                Local Weather Intelligence
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex flex-col">
                    <div className="flex items-center gap-2 text-slate-500 mb-1">
                        <Thermometer className="w-4 h-4" />
                        <span className="text-xs uppercase font-medium">Temperature</span>
                    </div>
                    <span className="text-2xl font-bold text-slate-900">{weather.temperature}°C</span>
                </div>
                <div className="flex flex-col">
                    <div className="flex items-center gap-2 text-slate-500 mb-1">
                        <Droplets className="w-4 h-4" />
                        <span className="text-xs uppercase font-medium">Humidity</span>
                    </div>
                    <span className="text-2xl font-bold text-slate-900">{weather.humidity}%</span>
                </div>
                <div className="flex flex-col">
                    <div className="flex items-center gap-2 text-slate-500 mb-1">
                        <CloudRain className="w-4 h-4" />
                        <span className="text-xs uppercase font-medium">Rainfall</span>
                    </div>
                    <span className="text-2xl font-bold text-slate-900">{weather.precipitation} mm</span>
                </div>
                <div className="flex flex-col">
                    <div className="flex items-center gap-2 text-slate-500 mb-1">
                        <Wind className="w-4 h-4" />
                        <span className="text-xs uppercase font-medium">Wind</span>
                    </div>
                    <span className="text-2xl font-bold text-slate-900">{weather.windSpeed} km/h</span>
                </div>
            </div>

            {/* AI Risk Assessment */}
            <div className={`mt-auto p-4 rounded-xl border ${riskLevel === 'High' ? 'bg-rose-50 border-rose-100 text-rose-800' : riskLevel === 'Moderate' ? 'bg-amber-50 border-amber-100 text-amber-800' : 'bg-emerald-50 border-emerald-100 text-emerald-800'}`}>
                <div className="flex items-start gap-3">
                    <AlertTriangle className={`w-5 h-5 mt-0.5 shrink-0 ${riskLevel === 'High' ? 'text-rose-500' : riskLevel === 'Moderate' ? 'text-amber-500' : 'text-emerald-500'}`} />
                    <div>
                        <p className="font-semibold text-sm mb-1">Disease Risk: {riskLevel}</p>
                        <p className="text-xs opacity-90 leading-relaxed">{warningMessage}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
