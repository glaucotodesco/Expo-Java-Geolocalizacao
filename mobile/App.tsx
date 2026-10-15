import React, { useRef, useState } from 'react';
import { ActivityIndicator, Alert, Button, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, type Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { getLocations, saveLocation, type SavedLocation } from './src/api';

type Point = { latitude: number; longitude: number; accuracy: number | null };
const INITIAL_REGION: Region = {
  latitude: -23.5003,
  longitude: -47.4582,
  latitudeDelta: 0.03,
  longitudeDelta: 0.03,
};

export default function App() {
  const mapRef = useRef<MapView>(null);
  const [position, setPosition] = useState<Point | null>(null);
  const [saved, setSaved] = useState<SavedLocation[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('Autorize o GPS para obter sua localização.');

  async function run(action: () => Promise<void>) {
    setBusy(true);
    try { await action(); }
    catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      setMessage(msg);
      Alert.alert('Não foi possível concluir', msg);
    } finally { setBusy(false); }
  }

  function currentLocation() {
    void run(async () => {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status !== 'granted') {
        setMessage('Permissão negada. Autorize a localização nas configurações do dispositivo.');
        return;
      }
      const result = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const point = {
        latitude: result.coords.latitude,
        longitude: result.coords.longitude,
        accuracy: result.coords.accuracy,
      };
      setPosition(point);
      mapRef.current?.animateToRegion({ ...point, latitudeDelta: 0.015, longitudeDelta: 0.015 }, 500);
      setMessage('Localização atual obtida. Toque em Salvar para enviar ao servidor.');
    });
  }

  function persistLocation() {
    if (!position) { Alert.alert('Localização', 'Obtenha sua localização antes de salvar.'); return; }
    void run(async () => {
      const newPoint = await saveLocation({
        name: `Ponto ${new Date().toLocaleString('pt-BR')}`,
        latitude: position.latitude,
        longitude: position.longitude,
      });
      setSaved((old) => [...old, newPoint]);
      setMessage(`Local ${newPoint.id} salvo no H2.`);
    });
  }

  function loadLocations() {
    void run(async () => {
      const points = await getLocations();
      setSaved(points);
      setMessage(`${points.length} local(is) carregado(s) do H2.`);
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Meus Locais — GPS + Java</Text>
      <Text style={styles.info}>
        {position
          ? `Lat: ${position.latitude.toFixed(6)} | Lon: ${position.longitude.toFixed(6)} | Precisão: ${position.accuracy?.toFixed(0) ?? '?'} m`
          : 'Posição ainda não capturada'}
      </Text>
      <MapView ref={mapRef} style={styles.map} initialRegion={INITIAL_REGION} showsUserLocation={false}>
        {position && <Marker coordinate={position} title="Minha localização" pinColor="blue" />}
        {saved.map((item) => (
          <Marker
            key={item.id}
            coordinate={{ latitude: item.latitude, longitude: item.longitude }}
            title={item.name || `Local ${item.id}`}
            description={`${item.latitude.toFixed(6)}, ${item.longitude.toFixed(6)}`}
          />
        ))}
      </MapView>
      <View style={styles.buttons}>
        <Button title="Minha localização" onPress={currentLocation} disabled={busy} />
        <Button title="Salvar localização" onPress={persistLocation} disabled={busy || !position} />
        <Button title="Carregar locais" onPress={loadLocations} disabled={busy} />
      </View>
      {busy && <ActivityIndicator />}
      <Text style={styles.message}>{message}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  title: { fontSize: 21, fontWeight: '700', margin: 12, textAlign: 'center' },
  info: { fontSize: 12, paddingHorizontal: 12, paddingBottom: 8, textAlign: 'center' },
  map: { flex: 1, minHeight: 180 },
  buttons: { padding: 10, gap: 6 },
  message: { paddingHorizontal: 12, paddingBottom: 12, fontSize: 13, textAlign: 'center' },
});
