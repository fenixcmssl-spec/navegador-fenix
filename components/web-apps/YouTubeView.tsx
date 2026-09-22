'use client';

import React, { useState } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Download,
  BookmarkPlus,
  ShieldCheck,
  EyeOff,
  Sparkles,
  Search,
  Bell,
  MessageSquare,
  CheckCircle2,
  Film,
  Radio,
  Sliders,
  Flame,
} from 'lucide-react';

interface VideoItem {
  id: string;
  embedId: string;
  title: string;
  channel: string;
  subscribers: string;
  channelAvatar: string;
  views: string;
  uploadedAt: string;
  duration: string;
  likes: number;
  description: string;
  category: string;
  commentsCount: number;
}

const FEATURED_VIDEOS: VideoItem[] = [
  {
    id: 'v-debian-12',
    embedId: 'dQw4w9WgXcQ', // safe embed
    title: 'Debian 12 "Bookworm" — El Sistema Operativo Más Estable del Mundo (Guía Completa 2026)',
    channel: 'Debian Linux Channel',
    subscribers: '482 K suscriptores',
    channelAvatar: '🌀',
    views: '1.2 M vistas',
    uploadedAt: 'hace 3 semanas',
    duration: '18:45',
    likes: 42800,
    description:
      'Exploramos a fondo todas las características del nuevo Debian 12 Bookworm: Kernel Linux 6.1 LTS, soporte Wayland por defecto, gestión de repositorios no libres y cómo optimizar la memoria RAM para mantener tu equipo volando.',
    category: 'Linux Debian',
    commentsCount: 318,
  },
  {
    id: 'v-lofi-beats',
    embedId: 'jfKfPfyJRdk',
    title: 'Lofi Hip Hop Radio 📚 - Beats para Estudiar, Programar y Relajarse [24/7 Live Stream]',
    channel: 'Lofi Girl & Tech Beats',
    subscribers: '14.2 M suscriptores',
    channelAvatar: '🎧',
    views: '84.5 M vistas',
    uploadedAt: 'En directo',
    duration: 'LIVE',
    likes: 185000,
    description:
      'Música lo-fi tranquila y continua sin interrupciones ni anuncios publicitarios gracias al bloqueador FénixShield integrado en Fénix Navegador.',
    category: 'Música',
    commentsCount: 1420,
  },
  {
    id: 'v-chrome-vs-fenix',
    embedId: 'M7lc1UVf-VE',
    title: '¿Por qué Google Chrome consume tanta RAM? Comparativa de Rendimiento con Navegadores Ligeros',
    channel: 'Linux Performance Lab',
    subscribers: '290 K suscriptores',
    channelAvatar: '⚡',
    views: '340 K vistas',
    uploadedAt: 'hace 5 días',
    duration: '12:10',
    likes: 19400,
    description:
      'Desglosamos el consumo de memoria del motor Blink y V8: telemetría continua, precarga de anuncios y procesos sandbox duplicados vs arquitectura ultraligera con bloqueador C++.',
    category: 'Tecnología',
    commentsCount: 204,
  },
  {
    id: 'v-nature-4k',
    embedId: 'LXb3EKWsInQ',
    title: 'Naturaleza en 4K Ultra HD 60fps — Paisajes de Montañas, Ríos y Bosques con Sonido Envolvente',
    channel: 'Earth Exploration 4K',
    subscribers: '3.1 M suscriptores',
    channelAvatar: '🌲',
    views: '5.9 M vistas',
    uploadedAt: 'hace 2 meses',
    duration: '24:30',
    likes: 87000,
    description:
      'Imágenes panorámicas de la naturaleza en ultra alta definición con reproducción fluida por aceleración de hardware en Debian Linux.',
    category: 'Naturaleza',
    commentsCount: 450,
  },
];

interface CommentItem {
  id: string;
  author: string;
  avatar: string;
  time: string;
  text: string;
  likes: number;
  userLiked?: boolean;
}

const INITIAL_COMMENTS: CommentItem[] = [
  {
    id: 'c-1',
    author: 'Carlos Debianero',
    avatar: '🐧',
    time: 'hace 2 horas',
    text: '¡Increíble la fluidez de YouTube en Fénix! En Chrome normal la CPU se ponía al 60% y aquí va al 8% sin un solo anuncio.',
    likes: 142,
  },
  {
    id: 'c-2',
    author: 'Elena Dev',
    avatar: '👩‍💻',
    time: 'hace 5 horas',
    text: 'Tener modo oculto siempre activo y que no me bombardee el algoritmo con recomendaciones invasivas es exactamente lo que necesitaba.',
    likes: 89,
  },
  {
    id: 'c-3',
    author: 'Sysadmin Linuxero',
    avatar: '🛡️',
    time: 'hace 1 día',
    text: 'Probado en Debian 12 con XFCE en una laptop antigua de 4GB de RAM y corre a 1080p sin perder ni un frame.',
    likes: 64,
  },
];

const CATEGORIES = [
  'Todo',
  'Linux Debian',
  'Tecnología',
  'Música',
  'Programación',
  'En vivo',
  'Naturaleza',
];

interface YouTubeViewProps {
  onNavigate?: (url: string) => void;
  onAskAiSummary?: () => void;
}

export default function YouTubeView({ onNavigate, onAskAiSummary }: YouTubeViewProps) {
  const [selectedVideo, setSelectedVideo] = useState<VideoItem>(FEATURED_VIDEOS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todo');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasDisliked, setHasDisliked] = useState(false);
  const [likesCount, setLikesCount] = useState(selectedVideo.likes);
  const [comments, setComments] = useState<CommentItem[]>(INITIAL_COMMENTS);
  const [newCommentText, setNewCommentText] = useState('');
  const [showShareToast, setShowShareToast] = useState(false);
  const [qualityMode, setQualityMode] = useState<'1080p' | '720p' | '480p'>('1080p');

  const handleVideoSelect = (video: VideoItem) => {
    setSelectedVideo(video);
    setLikesCount(video.likes);
    setHasLiked(false);
    setHasDisliked(false);
    setIsSubscribed(false);
  };

  const handleToggleLike = () => {
    if (hasLiked) {
      setHasLiked(false);
      setLikesCount((prev) => prev - 1);
    } else {
      setHasLiked(true);
      if (hasDisliked) setHasDisliked(false);
      setLikesCount((prev) => prev + 1);
    }
  };

  const handleToggleDislike = () => {
    if (hasDisliked) {
      setHasDisliked(false);
    } else {
      setHasDisliked(true);
      if (hasLiked) {
        setHasLiked(false);
        setLikesCount((prev) => prev - 1);
      }
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment: CommentItem = {
      id: `c-${Date.now()}`,
      author: 'Usuario Anónimo (Modo Oculto)',
      avatar: '🕶️',
      time: 'ahora mismo',
      text: newCommentText.trim(),
      likes: 1,
      userLiked: true,
    };

    setComments([newComment, ...comments]);
    setNewCommentText('');
  };

  const filteredVideos = FEATURED_VIDEOS.filter((v) => {
    const matchesCategory =
      selectedCategory === 'Todo' || v.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.channel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full min-h-full bg-zinc-950 text-zinc-100 font-sans flex flex-col">
      {/* YouTube Top Bar */}
      <header className="sticky top-0 z-20 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800/80 px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5 cursor-pointer">
            <div className="w-7 h-5 bg-red-600 rounded-md flex items-center justify-center text-white text-xs font-bold shadow-sm">
              <Play className="w-3 h-3 fill-white ml-0.5" />
            </div>
            <span className="font-bold text-lg tracking-tighter text-white">
              YouTube <span className="text-[10px] text-zinc-400 font-normal ml-0.5">ES</span>
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-purple-950/60 border border-purple-800/60 text-purple-300 text-[10px] font-mono">
            <EyeOff className="w-3 h-3" />
            <span>Modo Oculto</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl">
          <div className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar videos en YouTube..."
              className="w-full py-1.5 pl-4 pr-10 rounded-full bg-zinc-900 border border-zinc-700 text-xs text-zinc-100 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder:text-zinc-500"
            />
            <button className="absolute right-3 text-zinc-400 hover:text-white">
              <Search className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Badges & Tools */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-800/50 text-emerald-400 text-[11px] font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>0 Anuncios</span>
          </div>

          {onAskAiSummary && (
            <button
              onClick={onAskAiSummary}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 text-xs font-medium transition-colors"
              title="Resumir video con IA"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Resumen IA</span>
            </button>
          )}

          <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-300 border border-zinc-700">
            🕶️
          </div>
        </div>
      </header>

      {/* Category Pills Bar */}
      <div className="px-4 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-zinc-800/50 bg-zinc-900/40">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-white text-zinc-900 font-semibold'
                : 'bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Privacy & Adblock Banner */}
      <div className="mx-4 mt-3 p-2.5 rounded-xl bg-gradient-to-r from-red-950/40 via-zinc-900 to-purple-950/40 border border-red-900/30 flex items-center justify-between text-xs text-zinc-300">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>FénixShield Activo:</strong> Bloqueo nativo de publicidad de YouTube y telemetría de Google. Reproducción a 60fps con bajo consumo de RAM.
          </span>
        </div>
        <span className="hidden lg:inline-flex px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px]">
          RAM: ~32 MB
        </span>
      </div>

      {/* Main YouTube Layout */}
      <div className="flex-1 p-4 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left / Main Column (Video Player + Info + Comments) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Main Video Viewport */}
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-zinc-800 shadow-xl group">
            {/* Embedded Responsive Player */}
            <div className="w-full h-full flex flex-col items-center justify-center relative bg-zinc-900">
              {/* Fallback Animated Canvas / Embed Screen */}
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-950 to-red-950/20 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg mb-3 hover:scale-110 transition-transform cursor-pointer">
                  <Play className="w-7 h-7 fill-white ml-1" />
                </div>
                <h3 className="text-base font-bold text-white max-w-md line-clamp-2">
                  {selectedVideo.title}
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Reproduciendo en HD 1080p • Aceleración VA-API (Debian Linux)
                </p>

                {/* Status Pills */}
                <div className="flex items-center gap-2 mt-4 text-[11px] font-mono">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Cero Anuncios
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-purple-950 border border-purple-800 text-purple-300 flex items-center gap-1">
                    <EyeOff className="w-3 h-3" /> Modo Oculto
                  </span>
                </div>
              </div>

              {/* Bottom Video Controls Overlay */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 flex flex-col gap-2">
                {/* Progress bar */}
                <div className="w-full h-1 bg-zinc-700 rounded-full overflow-hidden cursor-pointer">
                  <div className="w-1/3 h-full bg-red-600 rounded-full" />
                </div>

                <div className="flex items-center justify-between text-xs text-zinc-300">
                  <div className="flex items-center gap-3">
                    <button className="text-white hover:text-red-500">
                      <Play className="w-4 h-4 fill-white" />
                    </button>
                    <button className="text-white hover:text-red-500">
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <span className="text-[11px] font-mono">03:42 / {selectedVideo.duration}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <select
                      value={qualityMode}
                      onChange={(e) => setQualityMode(e.target.value as '1080p' | '720p' | '480p')}
                      className="bg-zinc-800 border border-zinc-700 text-[10px] rounded px-1.5 py-0.5 text-zinc-300 focus:outline-none"
                    >
                      <option value="1080p">1080p HD</option>
                      <option value="720p">720p HD</option>
                      <option value="480p">480p Ahorro Datos</option>
                    </select>

                    <button className="text-white hover:text-red-500" title="Pantalla completa">
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Video Title & Actions */}
          <div>
            <h1 className="text-lg md:text-xl font-bold text-white leading-snug">
              {selectedVideo.title}
            </h1>

            <div className="flex flex-wrap items-center justify-between gap-4 mt-3 pb-4 border-b border-zinc-800">
              {/* Channel Info */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xl shadow-sm">
                  {selectedVideo.channelAvatar}
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-white flex items-center gap-1">
                    <span>{selectedVideo.channel}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400" />
                  </h3>
                  <p className="text-xs text-zinc-400">{selectedVideo.subscribers}</p>
                </div>

                <button
                  onClick={() => setIsSubscribed(!isSubscribed)}
                  className={`ml-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    isSubscribed
                      ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700'
                      : 'bg-white hover:bg-zinc-200 text-zinc-950 shadow-sm'
                  }`}
                >
                  {isSubscribed ? 'Suscrito' : 'Suscribirse'}
                </button>
              </div>

              {/* Engagement Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Like / Dislike Pill */}
                <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-full overflow-hidden">
                  <button
                    onClick={handleToggleLike}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-zinc-800 ${
                      hasLiked ? 'text-red-500 font-bold' : 'text-zinc-200'
                    }`}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${hasLiked ? 'fill-red-500' : ''}`} />
                    <span>{likesCount.toLocaleString()}</span>
                  </button>
                  <div className="w-px h-4 bg-zinc-800" />
                  <button
                    onClick={handleToggleDislike}
                    className={`px-3 py-1.5 text-xs transition-colors hover:bg-zinc-800 ${
                      hasDisliked ? 'text-red-500 font-bold' : 'text-zinc-400'
                    }`}
                  >
                    <ThumbsDown className={`w-3.5 h-3.5 ${hasDisliked ? 'fill-red-500' : ''}`} />
                  </button>
                </div>

                {/* Share */}
                <button
                  onClick={() => {
                    setShowShareToast(true);
                    setTimeout(() => setShowShareToast(false), 2500);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-medium text-zinc-200 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Compartir</span>
                </button>

                {/* Download */}
                <button
                  onClick={() => alert('Descarga en formato MP4 libre iniciada en ~/Descargas/')}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-medium text-zinc-200 transition-colors"
                  title="Descargar video para ver offline"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Descargar</span>
                </button>
              </div>
            </div>
          </div>

          {/* Video Description Box */}
          <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800/80 text-xs text-zinc-300 space-y-2">
            <div className="flex items-center gap-3 font-semibold text-zinc-200">
              <span>{selectedVideo.views}</span>
              <span>•</span>
              <span>{selectedVideo.uploadedAt}</span>
              <span className="px-2 py-0.5 rounded bg-red-950/60 text-red-400 text-[10px] font-mono">
                #{selectedVideo.category}
              </span>
            </div>
            <p className="leading-relaxed whitespace-pre-line">{selectedVideo.description}</p>
          </div>

          {/* Interactive Comments Section */}
          <div className="pt-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-red-500" />
                <span>{comments.length} Comentarios</span>
              </h3>
              <span className="text-xs text-zinc-500">Modo Oculto: Comentarios Anónimos</span>
            </div>

            {/* Post Comment Input */}
            <form onSubmit={handleAddComment} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-sm shrink-0">
                🕶️
              </div>
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder="Escribe un comentario público en modo incógnito..."
                  className="w-full pb-1 bg-transparent border-b border-zinc-700 text-xs text-zinc-100 focus:outline-none focus:border-red-500 transition-colors"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setNewCommentText('')}
                    className="px-3 py-1 rounded-full text-xs text-zinc-400 hover:text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={!newCommentText.trim()}
                    className="px-3.5 py-1 rounded-full bg-red-600 disabled:bg-zinc-800 disabled:text-zinc-600 text-white text-xs font-semibold hover:bg-red-700 transition-colors"
                  >
                    Comentar
                  </button>
                </div>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-3.5 pt-2">
              {comments.map((cmt) => (
                <div key={cmt.id} className="flex gap-3 text-xs">
                  <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-sm shrink-0">
                    {cmt.avatar}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-zinc-200">{cmt.author}</span>
                      <span className="text-[10px] text-zinc-500">{cmt.time}</span>
                    </div>
                    <p className="text-zinc-300 leading-relaxed">{cmt.text}</p>
                    <div className="flex items-center gap-3 pt-0.5 text-zinc-400">
                      <button className="flex items-center gap-1 hover:text-red-400">
                        <ThumbsUp className="w-3 h-3" />
                        <span>{cmt.likes}</span>
                      </button>
                      <button className="hover:text-red-400">
                        <ThumbsDown className="w-3 h-3" />
                      </button>
                      <button className="text-[11px] hover:text-white">Responder</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Related Videos Playlist */}
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-zinc-200 flex items-center justify-between">
            <span>Videos Relacionados</span>
            <span className="text-[11px] text-red-400 font-normal">Autoplay off</span>
          </h3>

          <div className="space-y-2.5">
            {filteredVideos.map((vid) => {
              const isCurrent = vid.id === selectedVideo.id;
              return (
                <div
                  key={vid.id}
                  onClick={() => handleVideoSelect(vid)}
                  className={`flex gap-3 p-2 rounded-xl transition-all cursor-pointer border ${
                    isCurrent
                      ? 'bg-zinc-900 border-red-500/50 shadow-sm'
                      : 'bg-zinc-950 hover:bg-zinc-900/80 border-transparent hover:border-zinc-800'
                  }`}
                >
                  {/* Video Thumbnail */}
                  <div className="relative w-36 aspect-video bg-zinc-900 rounded-lg overflow-hidden shrink-0 border border-zinc-800 flex items-center justify-center">
                    <span className="text-2xl opacity-60">{vid.channelAvatar}</span>
                    <span className="absolute bottom-1 right-1 px-1 py-0.5 bg-black/80 text-white font-mono text-[9px] rounded">
                      {vid.duration}
                    </span>
                    {isCurrent && (
                      <div className="absolute inset-0 bg-red-600/20 flex items-center justify-center">
                        <Play className="w-4 h-4 fill-white text-white" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <h4 className="font-medium text-xs text-white line-clamp-2 leading-snug">
                      {vid.title}
                    </h4>
                    <div className="text-[11px] text-zinc-400 mt-1">
                      <p className="truncate">{vid.channel}</p>
                      <p className="text-[10px] text-zinc-500">
                        {vid.views} • {vid.uploadedAt}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Share Toast */}
      {showShareToast && (
        <div className="fixed bottom-10 right-10 bg-zinc-900 border border-emerald-500 text-white px-4 py-2 rounded-xl shadow-2xl flex items-center gap-2 text-xs z-50 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>¡Enlace copiado al portapapeles en modo privado!</span>
        </div>
      )}
    </div>
  );
}
