module.exports = {
  expo: {
    name: 'Geolocalizacao + Java', slug: 'expo-java-geolocalizacao', version: '1.0.0', orientation: 'portrait', userInterfaceStyle: 'light',
    platforms: ['ios', 'android', 'web'],
    ios: { supportsTablet: true, infoPlist: { NSLocationWhenInUseUsageDescription: 'Sua localizacao sera usada somente para mostrar a posicao e salvar locais quando voce solicitar.' } },
    android: { package: 'br.edu.exemplo.geolocalizacao', permissions: ['ACCESS_COARSE_LOCATION', 'ACCESS_FINE_LOCATION'] },
  },
};
