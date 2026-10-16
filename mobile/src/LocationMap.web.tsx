import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './LocationMap.web.css';
import type { LocationMapProps } from './LocationMap.types';
const INITIAL: L.LatLngExpression = [-23.5003, -47.4582];
const icon = (className: string) => L.divIcon({ className: '', html: `<div class="${className}"></div>`, iconSize: [20, 20], iconAnchor: [10, 10] });
export default function LocationMap({ position, savedLocations, focusToken }: LocationMapProps) {
  const element = useRef<HTMLDivElement>(null); const map = useRef<L.Map | null>(null); const markers = useRef<L.LayerGroup | null>(null); const previousFocus = useRef(focusToken);
  useEffect(() => { if (!element.current || map.current) return; map.current = L.map(element.current).setView(INITIAL, 13); L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }).addTo(map.current); markers.current = L.layerGroup().addTo(map.current); return () => { map.current?.remove(); map.current = null; }; }, []);
  useEffect(() => { if (!map.current || !markers.current) return; markers.current.clearLayers(); if (position) { L.marker([position.latitude, position.longitude], { icon: icon('location-current') }).bindPopup(`Minha localizacao<br>${position.latitude.toFixed(6)}, ${position.longitude.toFixed(6)}`).addTo(markers.current); if (focusToken !== previousFocus.current) map.current.setView([position.latitude, position.longitude], 16); } previousFocus.current = focusToken; savedLocations.forEach((item) => L.marker([item.latitude, item.longitude], { icon: icon('location-saved') }).bindPopup(`${item.name ?? `Local ${item.id}`}<br>${item.latitude.toFixed(6)}, ${item.longitude.toFixed(6)}`).addTo(markers.current!)); }, [position, savedLocations, focusToken]);
  return <div ref={element} style={{ flex: 1, minHeight: 180, width: '100%' }} />;
}
