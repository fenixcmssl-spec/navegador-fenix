export interface TorHopNode {
  id: string;
  name: string;
  type: 'guard' | 'middle' | 'exit';
  ip: string;
  country: string;
  countryCode: string;
  flag: string;
  city: string;
  latencyMs: number;
  bandwidth: string;
  uptime: string;
  fingerprint: string;
}

export interface TorServerLocation {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  flag: string;
  city: string;
  ip: string;
  latencyMs: number;
  loadPercent: number;
  isP2PAllowed: boolean;
  isStreamingOptimized: boolean;
  features: string[];
}

export interface TorCircuitState {
  enabled: boolean;
  isConnecting: boolean;
  currentIp: string;
  selectedLocation: TorServerLocation;
  guardNode: TorHopNode;
  middleNode: TorHopNode;
  exitNode: TorHopNode;
  protocol: 'Tor Onion v3' | 'Fénix Zero-Knowledge Mesh' | 'Snowflake Obfs4';
  encryption: string;
  totalSwitches: number;
  circuitUptimeSeconds: number;
  bytesReceivedKB: number;
  bytesSentKB: number;
  bridgesEnabled: boolean;
  dnsLeakProtection: boolean;
  autoSwitchIntervalMinutes: number; // 0 = manual, 10, 30, 60
}

export const TOR_SERVER_LOCATIONS: TorServerLocation[] = [
  {
    id: 'loc-de',
    name: 'Alemania (Fráncfort)',
    country: 'Alemania',
    countryCode: 'DE',
    flag: '🇩🇪',
    city: 'Fráncfort',
    ip: '185.220.101.5',
    latencyMs: 24,
    loadPercent: 38,
    isP2PAllowed: true,
    isStreamingOptimized: true,
    features: ['Ultra Rápido', 'Anti-DDoS', 'No Logs'],
  },
  {
    id: 'loc-ch',
    name: 'Suiza (Zúrich)',
    country: 'Suiza',
    countryCode: 'CH',
    flag: '🇨🇭',
    city: 'Zúrich',
    ip: '194.126.177.12',
    latencyMs: 18,
    loadPercent: 25,
    isP2PAllowed: true,
    isStreamingOptimized: true,
    features: ['Leyes de Privacidad Suizas', 'Zero Metadata', 'Gúardian Onion'],
  },
  {
    id: 'loc-is',
    name: 'Islandia (Reikiavik)',
    country: 'Islandia',
    countryCode: 'IS',
    flag: '🇮🇸',
    city: 'Reikiavik',
    ip: '185.100.87.45',
    latencyMs: 32,
    loadPercent: 20,
    isP2PAllowed: true,
    isStreamingOptimized: false,
    features: ['Sin Retención de Datos', '100% Energía Renovable', 'P2P Libre'],
  },
  {
    id: 'loc-se',
    name: 'Suecia (Estocolmo)',
    country: 'Suecia',
    countryCode: 'SE',
    flag: '🇸🇪',
    city: 'Estocolmo',
    ip: '193.187.91.22',
    latencyMs: 28,
    loadPercent: 42,
    isP2PAllowed: true,
    isStreamingOptimized: true,
    features: ['Red Nórdica Encriptada', 'Alta Disponibilidad'],
  },
  {
    id: 'loc-nl',
    name: 'Países Bajos (Ámsterdam)',
    country: 'Países Bajos',
    countryCode: 'NL',
    flag: '🇳🇱',
    city: 'Ámsterdam',
    ip: '185.220.102.8',
    latencyMs: 21,
    loadPercent: 55,
    isP2PAllowed: true,
    isStreamingOptimized: true,
    features: ['Nodo Central AMS-IX', 'Ancho de Banda 10Gbps'],
  },
  {
    id: 'loc-no',
    name: 'Noruega (Oslo)',
    country: 'Noruega',
    countryCode: 'NO',
    flag: '🇳🇴',
    city: 'Oslo',
    ip: '195.154.122.9',
    latencyMs: 30,
    loadPercent: 31,
    isP2PAllowed: true,
    isStreamingOptimized: true,
    features: ['Fjord Secure Shield', 'Privacidad Nórdica'],
  },
  {
    id: 'loc-ca',
    name: 'Canadá (Montreal)',
    country: 'Canadá',
    countryCode: 'CA',
    flag: '🇨🇦',
    city: 'Montreal',
    ip: '198.98.56.24',
    latencyMs: 65,
    loadPercent: 47,
    isP2PAllowed: true,
    isStreamingOptimized: true,
    features: ['Transatlántico Rápido', 'Anti-Censura'],
  },
  {
    id: 'loc-jp',
    name: 'Japón (Tokio)',
    country: 'Japón',
    countryCode: 'JP',
    flag: '🇯🇵',
    city: 'Tokio',
    ip: '103.208.220.14',
    latencyMs: 120,
    loadPercent: 60,
    isP2PAllowed: true,
    isStreamingOptimized: true,
    features: ['Asia-Pacífico Gateway', 'Bypass Geo-bloqueos'],
  },
];
