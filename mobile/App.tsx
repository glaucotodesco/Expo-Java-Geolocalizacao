import React, { useState } from 'react';
import { ActivityIndicator, Alert, Button, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import LocationMap from './src/LocationMap';
import { getLocations, saveLocation, type SavedLocation } from './src/api';

type Point = { latitude: number; longitude: number; accuracy: number | null };

function withTimeout<T>(promise: Promise<T>, milliseconds: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('A localizacao demorou muito para responder. Verifique o GPS e tente novamente.')), milliseconds)),
  ]);
}

export default function App() {
  const [position, setPosition] = useState<Point | null>(null);
  const [saved, setSaved] = useState<SavedLocation[]>([]);
  const [busy, setBusy] = useState(false);
  const [focusToken, setFocusToken] = useState(0);
  const [message, setMessage] = useState('Autorize o GPS para obter sua localizacao.');

  async function run(action: () => Promise<void>) {
    setBusy(true);
    try { await action(); }
    catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      setMessage(msg);
      Alert.alert('Nao foi possivel concluir', msg);
    } finally { setBusy(false); }
  }

  function currentLocation() {
    void run(async () => {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status !== 'granted') {
        setMessage('Permissao negada. Autorize a localizacao nas configuracoes do dispositivo ou navegador.');
        return;
      }
      const result = await withTimeout(Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High }), 20_000);
      const point = { latitude: result.coords.latitude, longitude: result.coords.longitude, accuracy: result.coords.accuracy };
      setPosition(point);
      setFocusToken((value) => value + 1);
      setMessage('Localizacao atual obtida. Toque em Salvar para enviar ao servidor.');
    });
  }

  function persistLocation() {
    if (!position) { Alert.alert('Localizacao', 'Obtenha sua localizacao antes de salvar.'); return; }
    void run(async () => {
      const newPoint = await saveLocation({ name: `Ponto ${new Date().toLocaleString('pt-BR')}`, latitude: position.latitude, longitude: position.longitude });
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

  return <SafeAreaView style={styles.container}>
    <Text style={styles.title}>Meus Locais - GPS + Java</Text>
    <Text style={styles.info}>{position ? `Lat: ${position.latitude.toFixed(6)} | Lon: ${position.longitude.toFixed(6)} | Precisao: ${position.accuracy?.toFixed(0) ?? '?'} m` : 'Posicao ainda nao capturada'}</Text>
    <LocationMap position={position} savedLocations={saved} focusToken={focusToken} />
    <View style={styles.buttons}>
      <Button title="Minha localizacao" onPress={currentLocation} disabled={busy} />
      <Button title="Salvar localizacao" onPress={persistLocation} disabled={busy || !position} />
      <Button title="Carregar locais" onPress={loadLocations} disabled={busy} />
    </View>
    {busy && <ActivityIndicator />}
    <Text style={styles.message}>{message}</Text>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' }, title: { fontSize: 21, fontWeight: '700', margin: 12, textAlign: 'center' },
  info: { fontSize: 12, paddingHorizontal: 12, paddingBottom: 8, textAlign: 'center' }, buttons: { padding: 10, gap: 6 },
  message: { paddingHorizontal: 12, paddingBottom: 12, fontSize: 13, textAlign: 'center' },
});
