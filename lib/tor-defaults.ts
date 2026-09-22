import { TorCircuitState, TOR_SERVER_LOCATIONS, TorHopNode, TorServerLocation } from '@/types/tor';

export { TOR_SERVER_LOCATIONS };

export function createRandomHopNode(type: 'guard' | 'middle' | 'exit', location?: TorServerLocation): TorHopNode {
  const loc = location || TOR_SERVER_LOCATIONS[Math.floor(Math.random() * TOR_SERVER_LOCATIONS.length)];
  const randomOctet = Math.floor(Math.random() * 250) + 2;
  const ipParts = loc.ip.split('.');
  const hopIp = `${ipParts[0]}.${ipParts[1]}.${Math.floor(Math.random() * 200) + 10}.${randomOctet}`;

  const nodeNames = {
    guard: ['FenixGuard-Alpha', 'OnionSentry-01', 'DebianShield-Entry', 'NordicGate-04'],
    middle: ['OnionRelay-Echo', 'CryptoMesh-Middle', 'ZeroTrace-Hop', 'FenixTransit-09'],
    exit: [`ExitNode-${loc.countryCode}`, `OnionEgress-${loc.city}`, `FenixGateway-${loc.countryCode}`, `Anonymizer-${loc.city}`],
  };

  const nameList = nodeNames[type];
  const name = nameList[Math.floor(Math.random() * nameList.length)];

  return {
    id: `hop-${type}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    name,
    type,
    ip: type === 'exit' ? loc.ip : hopIp,
    country: loc.country,
    countryCode: loc.countryCode,
    flag: loc.flag,
    city: loc.city,
    latencyMs: Math.max(12, Math.round(loc.latencyMs + (Math.random() * 10 - 5))),
    bandwidth: `${Math.floor(Math.random() * 80 + 20)} MB/s`,
    uptime: `${Math.floor(Math.random() * 40 + 5)} días`,
    fingerprint: Array.from({ length: 4 }, () => Math.random().toString(16).substring(2, 6).toUpperCase()).join(':'),
  };
}

export function generateFreshCircuit(targetLocation?: TorServerLocation): TorCircuitState {
  const selectedLocation = targetLocation || TOR_SERVER_LOCATIONS[0];
  const guard = createRandomHopNode('guard', TOR_SERVER_LOCATIONS[1]); // e.g. Switzerland
  const middle = createRandomHopNode('middle', TOR_SERVER_LOCATIONS[2]); // e.g. Iceland
  const exit = createRandomHopNode('exit', selectedLocation);

  return {
    enabled: true,
    isConnecting: false,
    currentIp: exit.ip,
    selectedLocation,
    guardNode: guard,
    middleNode: middle,
    exitNode: exit,
    protocol: 'Tor Onion v3',
    encryption: '3-Layer Multi-Hop (AES-256-GCM + Curve25519)',
    totalSwitches: 1,
    circuitUptimeSeconds: 0,
    bytesReceivedKB: 1420,
    bytesSentKB: 480,
    bridgesEnabled: false,
    dnsLeakProtection: true,
    autoSwitchIntervalMinutes: 0,
  };
}

export const generateRandomCircuit = generateFreshCircuit;

export const INITIAL_TOR_STATE: TorCircuitState = generateFreshCircuit(TOR_SERVER_LOCATIONS[0]);

