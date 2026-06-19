import { useEffect, useRef } from "react";


export const AdminMapView = ({ lat, lng, venue, municipality }) => {
    const mapRef = useRef(null);
    const leafletMap = useRef(null);

    const hasCoords = lat != null && lng != null;

    useEffect(() => {
        if (!hasCoords) return;

        const initMap = async () => {
            if (leafletMap.current) return;

            if (!document.getElementById("leaflet-css")) {
                const link = document.createElement("link");
                link.id = "leaflet-css";
                link.rel = "stylesheet";
                link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
                document.head.appendChild(link);
            }

            const L = await import("leaflet");
            delete L.Icon.Default.prototype._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
                iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
                shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
            });

            if (!mapRef.current) return;

            const map = L.map(mapRef.current, {
                zoomControl: true,
                dragging: true,
                scrollWheelZoom: false,
            }).setView([lat, lng], 16);

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a>',
                maxZoom: 19,
            }).addTo(map);

            L.marker([lat, lng])
                .addTo(map)
                .bindPopup(venue || "Event Venue")
                .openPopup();

            leafletMap.current = map;
        };

        initMap();

        return () => {
            if (leafletMap.current) {
                leafletMap.current.remove();
                leafletMap.current = null;
            }
        };
    }, [lat, lng, hasCoords, venue]);

    return (
        <div>
            {/* Address */}
            <div className="flex items-start gap-2 p-2 mb-2 rounded-lg bg-cyan-400/10 border border-cyan-400/20">
                <span className="text-cyan-400 mt-0.5 shrink-0">📍</span>
                <div>
                    <div className="text-white text-xs">{venue || "No address provided"}</div>
                    {municipality && (
                        <span className="inline-block mt-1 bg-cyan-400 text-black text-[10px] font-semibold px-2 py-0.5 rounded-full">
                            📍 {municipality}
                        </span>
                    )}
                </div>
            </div>

            {/* Map */}
            {hasCoords ? (
                <div
                    ref={mapRef}
                    className="w-full rounded-lg border border-[#444]"
                    style={{ height: "220px" }}
                />
            ) : (
                <div className="flex items-center justify-content-center text-gray-500 rounded-lg bg-[#1a1a1a] border border-dashed border-[#444]"
                    style={{ height: "120px" }}
                >
                    <span className="text-sm">🗺️ No map coordinates saved for this booking.</span>
                </div>
            )}

            {/* Attribution */}
            {hasCoords && (
                <p className="text-gray-500 mt-1 mb-0" style={{ fontSize: "0.7rem" }}>
                    Map data © OpenStreetMap contributors
                </p>
            )}
        </div>
    );
};