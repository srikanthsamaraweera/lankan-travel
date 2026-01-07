"use client";

import dynamic from "next/dynamic";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default Leaflet icon missing in Webpack/Next.js
const iconUrl = "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png";
const shadowUrl = "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png";

// Small helper to make inline SVG pins so we don't depend on external icon files.
const makePinIconUrl = (color: string, label: string) => {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' width='64' height='64'>
  <path fill='${color}' d='M32 2c-9.94 0-18 8.06-18 18 0 12 18 32 18 32s18-20 18-32c0-9.94-8.06-18-18-18z'/>
  <circle cx='32' cy='22' r='10' fill='white' opacity='0.92'/>
  <text x='32' y='27' text-anchor='middle' font-family='Arial, sans-serif' font-size='14' font-weight='700' fill='${color}'>${label}</text>
</svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

// Plane icon for transport (inline SVG path instead of text label)
const makePlaneIconUrl = (color: string, accent: string) => {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' width='64' height='64'>
  <path fill='${accent}' d='M32 2c-9.94 0-18 8.06-18 18 0 12 18 32 18 32s18-20 18-32c0-9.94-8.06-18-18-18z'/>
  <path fill='${color}' d='M30.5 33.5 24 39l-2-2 6.5-7.5-11-1.5-2-2 13 1-5-12 2 0.5 7 10 6.5-7.5c1-.9 2.6-.8 3.5.1l0.9 0.9c0.9 0.9 1 2.5 0.1 3.5L34 29l10 7-2 2-11.5-6.5z'/>
</svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

// DEFINE YOUR CUSTOM ATTRACTIVE ICONS HERE (inline SVGs)
const beachIcon = L.icon({
    iconUrl: makePinIconUrl("#0EA5E9", "B"), // Beach #0EA5E9
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
});

const wildlifeIcon = L.icon({
    iconUrl: makePinIconUrl("#10B981", "W"), // Beach
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
});

const cultureIcon = L.icon({
    iconUrl: makePinIconUrl("#F97316", "C"), // Culture
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
});

const transportIcon = L.icon({
    iconUrl: makePlaneIconUrl("#ffffff", "#0F172A"), // Airport
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
});

// Fallback default icon
const defaultIcon = L.icon({
    iconUrl: iconUrl,
    shadowUrl: shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

type Location = {
    id: number;
    name: string;
    lat: number;
    lng: number;
    type: "beach" | "culture" | "wildlife" | "nature" | "transport";
    description: string;
};

// DATA: You would typically fetch this from your WP backend, but here is static data
const locations: Location[] = [
    {
        id: 1,
        name: "Sigiriya Lion Rock",
        lat: 7.9570,
        lng: 80.7603,
        type: "culture",
        description: "Ancient palace on a rock."
    },
    {
        id: 2,
        name: "Arugam Bay",
        lat: 6.8404,
        lng: 81.8368,
        type: "beach",
        description: "Surfer's paradise."
    },
    {
        id: 3,
        name: "Galle Fort",
        lat: 6.0305,
        lng: 80.2150,
        type: "culture",
        description: "Historic Dutch fort."
    },
    {
        id: 4,
        name: "Yala National Park",
        lat: 6.3653, // Adjusted to more accurate park entrance coordinates
        lng: 81.5168,
        type: "wildlife",
        description: "Leopards and elephants."
    },

    // --- NEW ADDITIONS ---
    // Culture
    {
        id: 5,
        name: "Dambulla Cave Temple",
        lat: 7.8565,
        lng: 80.6489,
        type: "culture",
        description: "The largest and best-preserved cave temple complex in Sri Lanka."
    },
    {
        id: 6,
        name: "Polonnaruwa Ancient City",
        lat: 7.9403,
        lng: 81.0188,
        type: "culture",
        description: "Explore the ruins of the 12th-century Garden City of kings."
    },
    {
        id: 7,
        name: "Temple of the Sacred Tooth",
        lat: 7.2936,
        lng: 80.6413,
        type: "culture",
        description: "Kandy's holiest shrine housing the relic of the Buddha."
    },

    // Nature & Hills
    {
        id: 8,
        name: "Nine Arch Bridge",
        lat: 6.8768,
        lng: 81.0608,
        type: "nature",
        description: "The iconic colonial railway bridge in the misty hills of Ella."
    },
    {
        id: 9,
        name: "Nuwara Eliya (Little England)",
        lat: 6.9497,
        lng: 80.7891,
        type: "nature",
        description: "Colonial bungalows, tea plantations, and cool mountain air."
    },
    {
        id: 10,
        name: "Horton Plains (World's End)",
        lat: 6.8028,
        lng: 80.8091,
        type: "nature",
        description: "A sheer cliff drop of 870m offering stunning panoramic views."
    },

    // Beaches
    {
        id: 11,
        name: "Mirissa Beach",
        lat: 5.9482,
        lng: 80.4551,
        type: "beach",
        description: "Golden sands, whale watching, and Coconut Tree Hill."
    },
    {
        id: 12,
        name: "Unawatuna",
        lat: 6.0116,
        lng: 80.2483,
        type: "beach",
        description: "A popular banana-shaped bay perfect for swimming and dining."
    },
    {
        id: 13,
        name: "Trincomalee (Nilaveli)",
        lat: 8.6757,
        lng: 81.1968,
        type: "beach",
        description: "White sands and crystal clear waters on the East Coast."
    },

    // Wildlife
    {
        id: 14,
        name: "Udawalawe National Park",
        lat: 6.4740,
        lng: 80.8778,
        type: "wildlife",
        description: "Guaranteed wild elephant sightings in open plains."
    },
    {
        id: 15,
        name: "Minneriya National Park",
        lat: 8.0315,
        lng: 80.8365,
        type: "wildlife",
        description: "Famous for 'The Gathering' - the largest meeting of Asian elephants."
    },

    // Transport
    {
        id: 16,
        name: "Bandaranaike Int. Airport",
        lat: 7.1808,
        lng: 79.8841,
        type: "transport",
        description: "The main international gateway to Sri Lanka."
    },
    {
        id: 17,
        name: "Adam's Peak (Sri Pada)",
        lat: 6.8096,
        lng: 80.4994,
        type: "nature",
        description: "Sacred pilgrimage mountain peak."
    },
    {
        id: 18,
        name: "Anuradhapura",
        lat: 8.3114,
        lng: 80.4037,
        type: "culture",
        description: "First ancient capital of Sri Lanka."
    },
    {
        id: 19,
        name: "Bentota Beach",
        lat: 6.4251,
        lng: 79.9952,
        type: "beach",
        description: "Luxury resorts and water sports."
    },
    {
        id: 20,
        name: "Royal Botanical Gardens",
        lat: 7.2682,
        lng: 80.5966,
        type: "nature",
        description: "Famous royal gardens in Peradeniya."
    },
    {
        id: 21,
        name: "Nallur Kandaswamy Kovil",
        lat: 9.6749,
        lng: 80.0292,
        type: "culture",
        description: "Iconic Hindu temple in Jaffna (North)."
    }

];

const LoadingMap = () => <div className="h-[800px] w-full bg-gray-100 animate-pulse" />;
const colomboAirportOrigin = "7.1808,79.8848";

function InteractiveMapContent() {
    return (
        <MapContainer
            center={[7.8731, 80.7718]} // Center of Sri Lanka
            zoom={8}
            scrollWheelZoom={false}
            className="h-[800px] w-full rounded-3xl z-0"
        >
            {/* THE "ATTRACTIVE" MAP LAYER 
         Using CartoDB Voyager for a clean, travel-blog aesthetic (Free)
      */}
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />

            {locations.map((loc) => (
                <Marker
                    key={loc.id}
                    position={[loc.lat, loc.lng]}
                    // Switch icon based on type
                    icon={
                        loc.type === "beach"
                            ? beachIcon
                            : loc.type === "culture"
                                ? cultureIcon
                                : loc.type === "wildlife"
                                    ? wildlifeIcon
                                    : loc.type === "transport"
                                        ? transportIcon
                                        : defaultIcon
                    }
                >
                    <Popup className="custom-popup">
                        <div className="p-2">
                            <h3 className="font-bold text-lg">{loc.name}</h3>
                            <p className="text-sm text-gray-600">{loc.description}</p>
                            <a
                                href={`https://www.google.com/maps/dir/?api=1&origin=${colomboAirportOrigin}&destination=${loc.lat},${loc.lng}`}
                                className="text-blue-600 text-xs font-semibold mt-2 block"
                                target="_blank"
                                rel="noreferrer noopener"
                            >
                                Directions from Colombo Airport &rarr;
                            </a>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}

const InteractiveMap = dynamic(() => Promise.resolve(InteractiveMapContent), {
    ssr: false,
    loading: () => <LoadingMap />,
});

export default InteractiveMap;
