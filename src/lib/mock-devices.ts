/**
 * Mock device dataset used by the Reports and Maps modules.
 * In production this would come from the Spring Boot backend.
 */
import { DISTRICTS_BY_STATE, STATES } from "./reference-data";

export type DeviceStatus = {
  id: string;
  state: string;
  district: string;
  lat: number;
  lng: number;
  online: boolean;
  inUse: boolean;
  powerOn: boolean;
  motorOn: boolean;
};

// Approx centroids for the demo states (lat, lng)
const STATE_CENTROIDS: Record<string, [number, number]> = {
  "Andhra Pradesh": [15.9129, 79.74],
  Karnataka: [15.3173, 75.7139],
  Kerala: [10.8505, 76.2711],
  Maharashtra: [19.7515, 75.7139],
  "Tamil Nadu": [11.1271, 78.6569],
  Telangana: [17.385, 78.4867],
};

function rand(seed: number) {
  // deterministic pseudo-random
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export const DEVICES: DeviceStatus[] = (() => {
  const list: DeviceStatus[] = [];
  let i = 1;
  const r = rand(42);
  for (const state of STATES) {
    const centroid = STATE_CENTROIDS[state];
    const districts = DISTRICTS_BY_STATE[state] ?? [];
    for (const d of districts) {
      const count = 3 + Math.floor(r() * 4);
      for (let k = 0; k < count; k++) {
        const online = r() > 0.18;
        const powerOn = online ? r() > 0.15 : r() > 0.6;
        const motorOn = powerOn && r() > 0.35;
        const inUse = online;
        list.push({
          id: `WSM-${String(i).padStart(4, "0")}`,
          state,
          district: d,
          lat: centroid[0] + (r() - 0.5) * 2,
          lng: centroid[1] + (r() - 0.5) * 2,
          online,
          inUse,
          powerOn,
          motorOn,
        });
        i++;
      }
    }
  }
  return list;
})();

export type DeviceFilterKey =
  | "all"
  | "online"
  | "offline"
  | "notInUse"
  | "powerOn"
  | "powerOff"
  | "motorOn"
  | "motorOff";

export function filterDevices(
  devices: DeviceStatus[],
  key: DeviceFilterKey,
): DeviceStatus[] {
  switch (key) {
    case "online":
      return devices.filter((d) => d.online);
    case "offline":
      return devices.filter((d) => !d.online);
    case "notInUse":
      return devices.filter((d) => !d.inUse);
    case "powerOn":
      return devices.filter((d) => d.powerOn);
    case "powerOff":
      return devices.filter((d) => !d.powerOn);
    case "motorOn":
      return devices.filter((d) => d.motorOn);
    case "motorOff":
      return devices.filter((d) => !d.motorOn);
    default:
      return devices;
  }
}
