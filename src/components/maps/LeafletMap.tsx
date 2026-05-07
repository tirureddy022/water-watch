import { useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import type { DeviceStatus } from "@/lib/mock-devices";

function FitBounds({ devices }: { devices: DeviceStatus[] }) {
  const map = useMap();
  useEffect(() => {
    if (!devices.length) return;
    const lats = devices.map((d) => d.lat);
    const lngs = devices.map((d) => d.lng);
    map.fitBounds(
      [
        [Math.min(...lats), Math.min(...lngs)],
        [Math.max(...lats), Math.max(...lngs)],
      ],
      { padding: [40, 40] },
    );
  }, [devices, map]);
  return null;
}

function colorFor(d: DeviceStatus): string {
  if (!d.online) return "#dc2626";
  if (d.motorOn) return "#f59e0b";
  if (d.powerOn) return "#2563eb";
  return "#64748b";
}

export function LeafletMap({ devices }: { devices: DeviceStatus[] }) {
  return (
    <MapContainer
      center={[15, 78]}
      zoom={5}
      scrollWheelZoom
      style={{ height: "60vh", width: "100%" }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds devices={devices} />
      {devices.map((d) => (
        <CircleMarker
          key={d.id}
          center={[d.lat, d.lng]}
          radius={6}
          pathOptions={{
            color: "white",
            weight: 1.5,
            fillColor: colorFor(d),
            fillOpacity: 0.9,
          }}
        >
          <Popup>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, lineHeight: 1.6 }}>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>{d.id}</div>
              <div><b>State:</b> {d.state}</div>
              <div><b>District:</b> {d.district}</div>
              <div><b>Lat:</b> {d.lat.toFixed(4)}</div>
              <div><b>Lng:</b> {d.lng.toFixed(4)}</div>
              <div><b>Status:</b> {d.online ? "ONLINE" : "OFFLINE"}</div>
              <div><b>Power:</b> {d.powerOn ? "ON" : "OFF"}</div>
              <div><b>Motor:</b> {d.motorOn ? "ON" : "OFF"}</div>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
