import { useEffect, useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import type { LocationMapProps } from './LocationMap.types';

const INITIAL = { latitude: -23.5003, longitude: -47.4582 };
const toScriptJson = (value: unknown) => JSON.stringify(value).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');

export default function LocationMap({ position, savedLocations, focusToken }: LocationMapProps) {
  const webView = useRef<WebView>(null); const lastFocus = useRef(focusToken); const html = useMemo(createMapHtml, []);
  useEffect(() => {
    const center = focusToken !== lastFocus.current; lastFocus.current = focusToken;
    // The page only accepts the validated JSON message handled in its message listener.
    webView.current?.injectJavaScript(`window.postMessage(${toScriptJson(JSON.stringify({ type: 'locations', position, savedLocations, center }))}, '*'); true;`);
  }, [position, savedLocations, focusToken]);
  return <View style={styles.map}><WebView ref={webView} originWhitelist={['*']} source={{ html }} javaScriptEnabled domStorageEnabled /></View>;
}
function createMapHtml() { return `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"><style>html,body,#map{height:100%;margin:0}.current,.saved{border:3px solid white;border-radius:50%;width:14px;height:14px}.current{background:#1976d2}.saved{background:#d32f2f}</style></head><body><div id="map"></div><script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script><script>(function(){var map=L.map('map').setView([${INITIAL.latitude},${INITIAL.longitude}],13),markers=L.layerGroup().addTo(map);L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);function valid(p){return p&&Number.isFinite(p.latitude)&&Number.isFinite(p.longitude)&&p.latitude>=-90&&p.latitude<=90&&p.longitude>=-180&&p.longitude<=180}function mark(p,c,text){return L.marker([p.latitude,p.longitude],{icon:L.divIcon({className:'',html:'<div class="'+c+'"></div>',iconSize:[20,20],iconAnchor:[10,10]})}).bindPopup(text)}window.updateLocations=function(d){if(!d||d.type!=='locations'||!Array.isArray(d.savedLocations))return;markers.clearLayers();if(valid(d.position)){mark(d.position,'current','<b>Minha localizacao</b><br>'+d.position.latitude.toFixed(6)+', '+d.position.longitude.toFixed(6)).addTo(markers);if(d.center)map.setView([d.position.latitude,d.position.longitude],16)}d.savedLocations.forEach(function(p){if(valid(p))mark(p,'saved','<b>'+String(p.name||('Local '+p.id)).replace(/[&<>]/g,'')+'</b><br>'+p.latitude.toFixed(6)+', '+p.longitude.toFixed(6)).addTo(markers)})};function receive(e){try{window.updateLocations(JSON.parse(e.data))}catch(_){}}document.addEventListener('message',receive);window.addEventListener('message',receive)})();</script></body></html>`; }
const styles = StyleSheet.create({ map: { flex: 1, minHeight: 180, width: '100%' } });
