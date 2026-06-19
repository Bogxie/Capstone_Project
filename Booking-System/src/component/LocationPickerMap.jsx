import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { deliveryOption } from "../assets/utils/deliveryOptions";

const CAVITE_CENTER = [14.3, 120.9];
const DEFAULT_ZOOM = 11;

const CAVITE_BOUNDS = {
    minLat: 14.0, maxLat: 14.7,
    minLng: 120.6, maxLng: 121.2,
};

const isInsideCavite = (lat, lng) =>
    lat >= CAVITE_BOUNDS.minLat && lat <= CAVITE_BOUNDS.maxLat &&
    lng >= CAVITE_BOUNDS.minLng && lng <= CAVITE_BOUNDS.maxLng;

const normalize = (str) =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

const MUNICIPALITY_KEYWORDS = deliveryOption.map((d) => ({
    name: d.municipality,
    keywords: [d.municipality.toLowerCase(), normalize(d.municipality)],
}));

const detectMunicipality = (addressObj) => {
    if (!addressObj) return null;

    const targetFields = [
        addressObj.municipality,
        addressObj.town,
        addressObj.city,
        addressObj.village,
        addressObj.suburb,
        addressObj.neighbourhood
    ].filter(Boolean).map(val => normalize(val));

    for (const entry of MUNICIPALITY_KEYWORDS) {
        const cleanName = normalize(entry.name);
        const hasExactMatch = targetFields.some(field => field === cleanName);
        if (hasExactMatch) return entry.name;
    }

    for (const entry of MUNICIPALITY_KEYWORDS) {
        const cleanName = normalize(entry.name);
        const hasPartialMatch = targetFields.some(field => field.includes(cleanName));
        if (hasPartialMatch) return entry.name;
    }

    return null;
};

export const LocationPickerMap = ({ onLocationSelect, initialVenue = "", initialLat = null, initialLng = null }) => {
    const mapRef = useRef(null);
    const leafletMap = useRef(null);
    const markerRef = useRef(null);
    const searchTimeoutRef = useRef(null);
    const searchBarRef = useRef(null);

    // Iniimbak ang panimulang lat/lng sa isang ref para ma-access sa loob ng useEffect nang hindi nag-ti-trigger ng re-run
    const initialPropsRef = useRef({ initialLat, initialLng });

    const [searchQuery, setSearchQuery] = useState(initialVenue || "");
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(initialVenue || "");
    const [detectedMunicipality, setDetectedMunicipality] = useState(null);
    const [isPinned, setIsPinned] = useState(!!initialVenue && !!initialLat);
    const [outOfBounds, setOutOfBounds] = useState(false);
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });

    useEffect(() => {
        if (searchResults.length === 0) return;

        const updatePosition = () => {
            if (!searchBarRef.current) return;

            const rect = searchBarRef.current.getBoundingClientRect();

            setDropdownPos({
                top: rect.bottom,
                left: rect.left,
                width: rect.width,
            });
        };
         updatePosition();

    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
        window.removeEventListener("scroll", updatePosition, true);
        window.removeEventListener("resize", updatePosition);
    };
    
    }, [searchResults]);

    const placeMarker = async (L, map, lat, lng, triggerGeocode = true) => {
        if (markerRef.current) markerRef.current.remove();

        const marker = L.marker([lat, lng], { draggable: true }).addTo(map);
        markerRef.current = marker;

        marker.on("dragend", async () => {
            const pos = marker.getLatLng();
            if (!isInsideCavite(pos.lat, pos.lng)) {
                setOutOfBounds(true);
                marker.setLatLng(CAVITE_CENTER);
                leafletMap.current.setView(CAVITE_CENTER, DEFAULT_ZOOM);
                setTimeout(() => setOutOfBounds(false), 3000);
                return;
            }
            await reverseGeocode(pos.lat, pos.lng);
        });

        const currentZoom = map.getZoom();
        const targetZoom = currentZoom <= DEFAULT_ZOOM ? 16 : currentZoom;

        map.setView([lat, lng], targetZoom);

        if (triggerGeocode) {
            await reverseGeocode(lat, lng);
        }
        setIsPinned(true);
    };

    const reverseGeocode = async (lat, lng) => {
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
                { headers: { "Accept-Language": "en" } }
            );
            const data = await res.json();
            const displayName = data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
            const municipality = detectMunicipality(data.address);
            setSelectedAddress(displayName);
            setDetectedMunicipality(municipality);
            onLocationSelect({ venue: displayName, lat, lng, municipality: municipality || "" });
        } catch {
            const fallback = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
            setSelectedAddress(fallback);
            onLocationSelect({ venue: fallback, lat, lng, municipality: "" });
        }
    };

    useEffect(() => {
        let mapInstance = null;
        let isCleanedUp = false; // Flag para pigilan ang async race condition

        const initMap = async () => {
            // 1. Kung may umiiral nang instance sa ref, burahin muna agad
            if (leafletMap.current) {
                leafletMap.current.remove();
                leafletMap.current = null;
            }

            if (!document.getElementById("leaflet-css")) {
                const link = document.createElement("link");
                link.id = "leaflet-css";
                link.rel = "stylesheet";
                link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
                document.head.appendChild(link);
            }

            // Isara ang execution kung nag-unmount na habang naglo-load ang CSS
            if (isCleanedUp) return;

            const L = await import("leaflet");

            // Isara ulit kung nag-unmount habang nag-a-await ng import
            if (isCleanedUp || !mapRef.current) return;

            // Double safety check: Siguraduhing walang nakakabit na map property sa HTML element
            if (mapRef.current._leaflet_id) {
                return;
            }

            delete L.Icon.Default.prototype._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
                iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
                shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",

            });

            const { initialLat: startLat, initialLng: startLng } = initialPropsRef.current;
            const startCenter = startLat && startLng ? [parseFloat(startLat), parseFloat(startLng)] : CAVITE_CENTER;
            const startZoom = startLat && startLng ? 16 : DEFAULT_ZOOM;

            // Likhain ang map instance
            mapInstance = L.map(mapRef.current).setView(startCenter, startZoom);

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a>',
                maxZoom: 19,
            }).addTo(mapInstance);

            mapInstance.on("click", async (e) => {
                const { lat, lng } = e.latlng;
                if (!isInsideCavite(lat, lng)) {
                    setOutOfBounds(true);
                    mapInstance.setView(CAVITE_CENTER, DEFAULT_ZOOM);
                    setTimeout(() => setOutOfBounds(false), 3000);
                    return;
                }
                setOutOfBounds(false);
                await placeMarker(L, mapInstance, lat, lng, true);
            });

            leafletMap.current = mapInstance;
            window._leafletL = L;

            setTimeout(async () => {
                // Siguraduhing buhay pa ang mapInstance bago mag invalidate o mag geocode
                if (mapInstance && !isCleanedUp) {
                    mapInstance.invalidateSize();

                    if (startLat && startLng) {
                        const numericLat = parseFloat(startLat);
                        const numericLng = parseFloat(startLng);

                        await placeMarker(L, mapInstance, numericLat, numericLng, false);

                        try {
                            const res = await fetch(
                                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${numericLat}&lon=${numericLng}&addressdetails=1`,
                                { headers: { "Accept-Language": "en" } }
                            );
                            const data = await res.json();
                            setDetectedMunicipality(detectMunicipality(data.address));
                        } catch {
                            // silent pass
                        }
                    }
                }
            }, 350);
        };

        initMap();

        // ANG CRITICAL CLEANUP: Dito natin sinasakal ang memory leaks
        return () => {
            isCleanedUp = true; // Haharangan lahat ng tumatakbong async tasks sa itaas
            if (mapInstance) {
                mapInstance.off(); // Alisin lahat ng event listeners
                mapInstance.remove(); // Wasakin ang map state sa DOM
            }
            leafletMap.current = null;
        };
    }, []); // Isang beses lang mag-ru-run para iwas map destruction at blink habang nag-eedit

    const handleSearch = async (query) => {
        if (!query.trim() || query.length < 3) { setSearchResults([]); return; }
        setIsSearching(true);
        try {
            let finalQuery = query;

            if (query.includes(",")) {
                const cleanParts = query.split(",").map(p => p.trim()).filter(p => p.toLowerCase() !== "philippines");
                finalQuery = cleanParts.length > 3
                    ? `${cleanParts.slice(-3).join(", ")}, Philippines`
                    : `${cleanParts.join(", ")}, Philippines`;
            } else {
                if (!query.toLowerCase().includes("cavite")) finalQuery += " Cavite";
                if (!query.toLowerCase().includes("philippines")) finalQuery += " Philippines";
            }

            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(finalQuery)}&limit=5&addressdetails=1`,
                { headers: { "Accept-Language": "en" } }
            );
            const data = await res.json();
            const dataInsideCavite = data.filter(({ lat, lon }) => isInsideCavite(parseFloat(lat), parseFloat(lon)));

            setSearchResults(dataInsideCavite.length === 0 && data.length > 0 ? data.slice(0, 5) : dataInsideCavite);
        } catch {
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSearchInput = (e) => {
        const val = e.target.value;
        setSearchQuery(val);
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = setTimeout(() => handleSearch(val), 500);
    };

    const handleResultClick = async (result) => {
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);
        const L = window._leafletL;
        if (!L || !leafletMap.current) return;
        setSearchQuery(result.display_name);
        setSearchResults([]);
        await placeMarker(L, leafletMap.current, lat, lng, true);
    };

    return (
        <div className="w-full">
            {/* Search Bar */}
            <div className="mb-2" ref={searchBarRef}>
                <div className="flex">
                    <div className="flex items-center px-3 bg-zinc-900 border border-zinc-700 border-r-0 rounded-l-md text-amber-400">
                        🔍
                    </div>
                    <input
                        type="text"
                        placeholder="Search venue address (e.g. Sahud Ulan Tanza)..."
                        value={searchQuery}
                        onChange={handleSearchInput}
                        autoComplete="off"
                        className="flex-1 bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    {isSearching && (
                        <div className="flex items-center px-3 bg-zinc-900 border border-zinc-700 border-l-0 rounded-r-md">
                            <div className="h-4 w-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                        </div>
                    )}
                </div>

                {/* Portal Dropdown */}
                {searchResults.length > 0 && createPortal(
                    <div
                        style={{
                            position: 'fixed',
                            top: dropdownPos.top,
                            left: dropdownPos.left,
                            width: dropdownPos.width,
                            zIndex: 99999,
                        }}
                        className="rounded-b-lg border border-zinc-700 bg-zinc-900 shadow-xl overflow-hidden"
                    >
                        {searchResults.map((r) => (
                            <button
                                key={r.place_id}
                                type="button"
                                onClick={() => handleResultClick(r)}
                                className="flex w-full items-start px-3 py-2 text-left text-sm text-zinc-300 border-b border-zinc-800 hover:bg-zinc-800 transition-colors last:border-0"
                            >
                                <span className="text-amber-400 mr-2 shrink-0">📍</span>
                                <span>{r.display_name}</span>
                            </button>
                        ))}
                    </div>,
                    document.body
                )}
            </div>

            {/* Map */}
            <div
                ref={mapRef}
                className="h-[260px] w-full rounded-lg border border-zinc-700"
            />

            {/* Out of Bounds */}
            {outOfBounds && (
                <div className="mt-2 flex items-center gap-2 rounded-lg border border-red-500 bg-red-500/10 px-3 py-2 text-red-300">
                    ⚠️ <span className="text-sm">Service area is <strong>Cavite only</strong>. Map has been reset.</span>
                </div>
            )}

            {/* Hint */}
            {!isPinned && (
                <p className="mt-2 text-xs text-zinc-400">
                    ℹ️ Search or click the map to pin your exact venue.
                </p>
            )}

            {/* Result */}
            {isPinned && selectedAddress && (
                <div className="mt-3 rounded-lg border border-amber-500/25 bg-amber-500/10 p-3">
                    <div className="flex items-start gap-2">
                        <span className="text-amber-400 mt-0.5 shrink-0">📌</span>
                        <div className="flex-1">
                            <div className="text-sm text-black break-words">{selectedAddress}</div>
                            {detectedMunicipality ? (
                                <span className="mt-2 inline-flex rounded-full bg-amber-400 px-2.5 py-1 text-xs font-medium text-black">
                                    📍 {detectedMunicipality} — delivery fee auto-set
                                </span>
                            ) : (
                                <span className="mt-2 inline-flex rounded-full bg-zinc-700 px-2.5 py-1 text-xs font-medium text-white">
                                    ⚠ Municipality not in delivery list — fee set to ₱0
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};