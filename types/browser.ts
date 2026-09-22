export type SearchEngine = 'google' | 'duckduckgo' | 'bing' | 'ecosia' | 'searx' | 'brave';

export type BrowserTheme =
  | 'debian-dark'
  | 'chrome-classic'
  | 'nordic-slate'
  | 'material-dark'
  | 'paper-light';

export interface ShieldStats {
  blockedAds: number;
  trackersBlocked: number;
  httpsUpgraded: boolean;
  bandwidthSavedKB: number;
  fingerprintsBlocked: number;
}

export interface Tab {
  id: string;
  title: string;
  url: string;
  displayUrl?: string;
  favicon?: string;
  isLoading: boolean;
  loadingProgress: number; // 0 to 100
  history: string[];
  historyIndex: number;
  isMuted: boolean;
  isPinned: boolean;
  isIncognito: boolean;
  shieldStats: ShieldStats;
  readerModeActive: boolean;
  zoomLevel: number; // e.g. 100
  memoryMB: number; // RAM usage in MB
  cpuPercent: number;
  pageContent?: {
    html?: string;
    title?: string;
    description?: string;
    author?: string;
    readTime?: string;
    plainText?: string;
    images?: string[];
    isMock?: boolean;
    hasError?: boolean;
    errorMessage?: string;
  };
}

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  folderId?: string;
  createdAt: number;
  tags?: string[];
}

export interface BookmarkFolder {
  id: string;
  name: string;
  parentId?: string;
}

export interface HistoryItem {
  id: string;
  title: string;
  url: string;
  timestamp: number;
  favicon?: string;
  visitCount: number;
}

export interface DownloadItem {
  id: string;
  fileName: string;
  fileSize: string;
  totalBytes: number;
  downloadedBytes: number;
  mimeType: string;
  url: string;
  progress: number;
  status: 'downloading' | 'completed' | 'paused' | 'failed' | 'cancelled';
  speed: string;
  startTime: number;
  completedTime?: number;
  blobData?: string;
}

export interface Extension {
  id: string;
  name: string;
  description: string;
  version: string;
  icon: string;
  enabled: boolean;
  type:
    | 'adblocker'
    | 'darkreader'
    | 'ai_summarizer'
    | 'translator'
    | 'passwords'
    | 'json_viewer'
    | 'screenshot'
    | 'memory_booster';
  author: string;
  rating: number;
  users: string;
}

export interface BrowserSettings {
  defaultSearchEngine: SearchEngine;
  theme: BrowserTheme;
  alwaysIncognito: boolean; // Modo Oculto Permanente
  clearSessionOnClose: boolean;
  adblockEnabled: boolean;
  trackingProtection: 'strict' | 'standard' | 'off';
  turboDataSaver: boolean;
  memorySaverMode: boolean;
  maxMemoryThresholdMB: number;
  openNewTabAction: 'speed-dial' | 'blank' | 'custom';
  customStartUrl: string;
  fontSize: number;
  showBookmarksBar: boolean;
  showDebianStats: boolean;
  smoothScrolling: boolean;
  hardwareAcceleration: boolean;
  javascriptEnabled: boolean;
  doNotTrack: boolean;
  language: 'es' | 'en' | 'it' | 'fr' | 'de';
}

export interface ConsoleLog {
  id: string;
  type: 'log' | 'info' | 'warn' | 'error';
  message: string;
  timestamp: string;
}

export interface NetworkRequest {
  id: string;
  url: string;
  method: string;
  status: number;
  type: string;
  size: string;
  time: string;
}

export interface DevToolsState {
  isOpen: boolean;
  activeTab: 'elements' | 'console' | 'network' | 'sources' | 'memory' | 'security';
  height: number;
  consoleLogs: ConsoleLog[];
  networkRequests: NetworkRequest[];
}
