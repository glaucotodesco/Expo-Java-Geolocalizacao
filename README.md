# Expo + Java - Geolocalizacao com OpenStreetMap

Exemplo didatico pequeno: o aplicativo Expo captura uma coordenada pelo GPS, mostra-a em um mapa e a salva no Spring Boot/H2. **Nao exige Google Cloud, chave de API do Google Maps nem cartao de credito.**

## Arquitetura e tecnologias

- `mobile/`: Expo SDK 57, TypeScript e `expo-location` para permissao e GPS.
- O mapa usa **OpenStreetMap + Leaflet**. No Android/iOS, Leaflet roda em uma `react-native-webview`; no navegador, Leaflet e renderizado diretamente.
- `backend/`: Java 21, Spring Boot, Spring Data JPA e H2.

GPS determina coordenadas; o mapa apenas desenha essas coordenadas e seus arredores. Nenhuma coordenada e enviada ao servidor antes de tocar em **Salvar localizacao**.

## Executar

Inicie o backend (JDK 21 e Maven 3.9+):

```bash
cd backend
mvn spring-boot:run
```

A API fica em `http://localhost:8080`. Endpoints didaticos:

```bash
curl http://localhost:8080/api/locations
curl -X POST http://localhost:8080/api/locations -H "Content-Type: application/json" -d '{"name":"Teste","latitude":-23.5003,"longitude":-47.4582}'
```

Para o app:

```bash
cd mobile
npm install
npx expo install --check
npm start
```

Abra pelo Expo Go em Android/iOS ou pressione `w` para executar no navegador. Antes de usar um celular, copie `mobile/.env.example` para `.env` e ajuste `EXPO_PUBLIC_API_BASE_URL` para o IP LAN do computador (por exemplo `http://192.168.1.10:8080`); celular e computador devem estar na mesma rede e a porta 8080 deve estar liberada. No navegador, `localhost` pode ser usado se o backend estiver na mesma maquina.

## Roteiro de teste

1. Inicie backend e Expo.
2. Toque em **Minha localizacao** e conceda a permissao.
3. Confira latitude, longitude, precisao e o marcador azul centralizado.
4. Toque em **Salvar localizacao**; depois em **Carregar locais**.
5. Confirme os marcadores vermelhos e seus pop-ups com nome e coordenadas.
6. Negue a permissao ou desligue GPS/rede para observar as mensagens de erro.

`POST /api/locations` aceita latitude de -90 a 90 e longitude de -180 a 180; valores invalidos retornam 400. `GET /api/locations` pode retornar uma lista vazia.

## Observacoes importantes

O navegador exige permissao de localizacao e contexto seguro (HTTPS ou `localhost`). Em dispositivos, GPS desativado, permissao negada, rede indisponivel ou uma captura superior a 20 segundos geram tratamento amigavel; tente novamente depois de corrigir a causa.

Os tiles vem dos servidores publicos do OpenStreetMap, com atribuicao visivel. Eles dependem de conectividade, nao possuem SLA ou capacidade ilimitada e nao devem ser usados para pre-carregar/baixar mapas em massa. Este exemplo faz somente as requisicoes normais do mapa interativo e nao oferece modo offline.

O backend nao tem autenticacao e deve ser usado apenas em rede local confiavel para fins didaticos.
