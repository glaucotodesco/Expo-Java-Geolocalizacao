# Expo + Java — Geolocalização e Mapas

Exemplo didático mínimo para o projeto FieldOps: **capturar a localização atual, salvar no Spring Boot/H2, recuperar e mostrar marcadores em um mapa**. Não é um sistema de inspeções.

## Estrutura

- `mobile/`: Expo + React Native + TypeScript, `expo-location`, `react-native-maps` (Android/iOS com Expo Go).
- `backend/`: Java 21 + Spring Boot 3.5 + JPA + H2 persistente.

## 1. Iniciar o backend

Instale JDK 21 e Maven 3.9+. Em um terminal:

```bash
cd backend
mvn spring-boot:run
```

A API estará em `http://localhost:8080`; H2 persistirá em `backend/data/` (ignorado pelo Git).
Teste:

```bash
curl http://localhost:8080/api/locations
curl -X POST http://localhost:8080/api/locations -H "Content-Type: application/json" -d '{"name":"Teste","latitude":-23.5003,"longitude":-47.4582}'
```

## 2. Iniciar o mobile

Instale Node.js 22.13+ e Expo Go no dispositivo. O projeto usa **Expo SDK 57**.

```bash
cd mobile
npm install
npx expo install --check
npm start
```

Antes de abrir o aplicativo, defina o IP LAN do computador que executa o Java em `mobile/src/api.ts` (constante `API_BASE_URL`). **Não use localhost no dispositivo**. Celular e computador devem estar na mesma rede; libere a porta TCP 8080 no firewall, se necessário.

No Expo Go: **Minha localização → Salvar localização → Carregar locais**. O GPS requer permissão do sistema. Pressionar um marcador exibe seu nome. Nenhuma coordenada é enviada sem tocar em Salvar.

> Esta versão usa **mapas nativos Android/iOS**. O navegador não é alvo desse exemplo mínimo: `react-native-maps` não implementa Web. Caso a turma precise de Web, incluir uma implementação separada (ex.: Leaflet).

## API

- `POST /api/locations` com JSON `{"name":"Local A","latitude":-23.5,"longitude":-47.45}` → 201 e registro salvo.
- `GET /api/locations` → lista de registros em JSON, possivelmente vazia.

Validação: latitude -90..90; longitude -180..180. Endpoints **didáticos e sem autenticação**: use somente em rede local confiável.

## Exercício FieldOps

No projeto FieldOps dos alunos, escolher uma inspeção, registrar coordenadas com consentimento, persistir na arquitetura existente e renderizar marcador ao recuperar a inspeção. **Não copiar diretamente a entidade didática nem substituir o fluxo Offline First**.

## Documentação

[Material no Notion](https://app.notion.com/p/3fa5d52a81f581a5a8cafe55df835106) · [Expo Location](https://docs.expo.dev/versions/latest/sdk/location/) · [React Native Maps](https://docs.expo.dev/versions/latest/sdk/map-view/)
