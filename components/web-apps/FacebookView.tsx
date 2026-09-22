'use client';

import React, { useState } from 'react';
import {
  ThumbsUp,
  Heart,
  Smile,
  MessageCircle,
  Share2,
  Image as ImageIcon,
  SmilePlus,
  MoreHorizontal,
  Search,
  Home,
  Users,
  Tv,
  Store,
  Compass,
  Bell,
  MessageSquare,
  ShieldCheck,
  EyeOff,
  Sparkles,
  Send,
  X,
  Bookmark,
  Calendar,
  CheckCircle2,
} from 'lucide-react';

interface FeedPost {
  id: string;
  author: string;
  avatar: string;
  isVerified?: boolean;
  timeAgo: string;
  privacy: 'public' | 'friends' | 'incognito';
  content: string;
  image?: string;
  tag?: string;
  likes: number;
  loveCount: number;
  hahaCount: number;
  commentsCount: number;
  sharesCount: number;
  userReaction?: 'like' | 'love' | 'haha' | 'wow' | null;
  comments: {
    id: string;
    author: string;
    avatar: string;
    text: string;
    time: string;
    likes: number;
  }[];
}

const INITIAL_POSTS: FeedPost[] = [
  {
    id: 'p-1',
    author: 'Comunidad Debian GNU/Linux en Español',
    avatar: '🌀',
    isVerified: true,
    timeAgo: 'hace 45 min',
    privacy: 'public',
    content:
      '🎉 ¡Gran actualización! Debian 12 "Bookworm" ha demostrado ser la distribución más estable y con menor huella de consumo energético del año. Navegar con Fénix Navegador permite ahorrar hasta un 92% de memoria RAM comparado con Google Chrome estándar.',
    tag: 'Tecnología & Software Libre',
    likes: 342,
    loveCount: 189,
    hahaCount: 12,
    commentsCount: 56,
    sharesCount: 88,
    userReaction: null,
    comments: [
      {
        id: 'c-fb-1',
        author: 'Roberto Martínez',
        avatar: '👨‍💻',
        text: 'Totalmente de acuerdo, en mi servidor y en la laptop Debian vuela.',
        time: 'hace 30 min',
        likes: 24,
      },
      {
        id: 'c-fb-2',
        author: 'Laura Sánchez',
        avatar: '👩‍🔬',
        text: '¡Y lo mejor es que en Fénix no nos rastrean los clics ni el feed!',
        time: 'hace 15 min',
        likes: 18,
      },
    ],
  },
  {
    id: 'p-2',
    author: 'Tech Innovations & Open Source',
    avatar: '🚀',
    isVerified: true,
    timeAgo: 'hace 3 horas',
    privacy: 'public',
    content:
      '💡 ¿Sabías que el Modo Oculto Permanente (Zero Fingerprint) aísla el LocalStorage y los tokens de sesión de manera que los sitios no puedan triangular tu perfil con otros dispositivos? Seguridad de nivel kernel en tu navegador.',
    likes: 512,
    loveCount: 240,
    hahaCount: 5,
    commentsCount: 78,
    sharesCount: 130,
    userReaction: 'love',
    comments: [
      {
        id: 'c-fb-3',
        author: 'Diego Fernández',
        avatar: '🛡️',
        text: 'Es la única forma de usar redes sociales hoy en día sin regalar toda tu privacidad.',
        time: 'hace 1 hora',
        likes: 42,
      },
    ],
  },
  {
    id: 'p-3',
    author: 'Linux Gaming & Emulación',
    avatar: '🎮',
    timeAgo: 'hace 6 horas',
    privacy: 'friends',
    content:
      '🎮 Probando renderizado WebGL2 y aceleración de gráficos VA-API en Debian. La tasa de refresco a 144Hz se mantiene sólida sin caídas de frames.',
    likes: 204,
    loveCount: 95,
    hahaCount: 8,
    commentsCount: 31,
    sharesCount: 19,
    userReaction: null,
    comments: [],
  },
];

interface FacebookViewProps {
  onNavigate?: (url: string) => void;
  onAskAiSummary?: () => void;
}

export default function FacebookView({ onNavigate, onAskAiSummary }: FacebookViewProps) {
  const [activeNavTab, setActiveNavTab] = useState<'feed' | 'friends' | 'watch' | 'market'>('feed');
  const [posts, setPosts] = useState<FeedPost[]>(INITIAL_POSTS);
  const [newPostText, setNewPostText] = useState('');
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentInputText, setCommentInputText] = useState('');
  const [showChatModal, setShowChatModal] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<{ sender: string; text: string }[]>([
    { sender: 'Carlos Debian', text: '¡Hola! ¿Probaste la última versión de Fénix en Debian?' },
    { sender: 'Tú', text: '¡Sí! Va increíblemente rápida y no consume casi nada de memoria.' },
  ]);
  const [newChatInput, setNewChatInput] = useState('');

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const newPost: FeedPost = {
      id: `p-${Date.now()}`,
      author: 'Usuario Fénix (Modo Oculto)',
      avatar: '🕶️',
      timeAgo: 'ahora mismo',
      privacy: 'incognito',
      content: newPostText.trim(),
      likes: 1,
      loveCount: 1,
      hahaCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      userReaction: 'love',
      comments: [],
    };

    setPosts([newPost, ...posts]);
    setNewPostText('');
  };

  const handleReaction = (postId: string, reactionType: 'like' | 'love' | 'haha') => {
    setPosts(
      posts.map((p) => {
        if (p.id !== postId) return p;
        const current = p.userReaction;
        if (current === reactionType) {
          // unreact
          return {
            ...p,
            userReaction: null,
            likes: reactionType === 'like' ? p.likes - 1 : p.likes,
            loveCount: reactionType === 'love' ? p.loveCount - 1 : p.loveCount,
            hahaCount: reactionType === 'haha' ? p.hahaCount - 1 : p.hahaCount,
          };
        } else {
          // new reaction
          return {
            ...p,
            userReaction: reactionType,
            likes: reactionType === 'like' ? p.likes + 1 : (current === 'like' ? p.likes - 1 : p.likes),
            loveCount: reactionType === 'love' ? p.loveCount + 1 : (current === 'love' ? p.loveCount - 1 : p.loveCount),
            hahaCount: reactionType === 'haha' ? p.hahaCount + 1 : (current === 'haha' ? p.hahaCount - 1 : p.hahaCount),
          };
        }
      })
    );
  };

  const handleAddComment = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInputText.trim()) return;

    setPosts(
      posts.map((p) => {
        if (p.id !== postId) return p;
        return {
          ...p,
          commentsCount: p.commentsCount + 1,
          comments: [
            ...p.comments,
            {
              id: `c-${Date.now()}`,
              author: 'Tú (Modo Oculto)',
              avatar: '🕶️',
              text: commentInputText.trim(),
              time: 'ahora mismo',
              likes: 1,
            },
          ],
        };
      })
    );
    setCommentInputText('');
  };

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatInput.trim()) return;
    setChatMessages([...chatMessages, { sender: 'Tú', text: newChatInput.trim() }]);
    setNewChatInput('');
  };

  return (
    <div className="w-full min-h-full bg-slate-100 dark:bg-zinc-950 text-slate-800 dark:text-slate-100 font-sans flex flex-col">
      {/* Facebook Top Navigation Header */}
      <header className="sticky top-0 z-30 bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 px-4 py-2 flex items-center justify-between shadow-2xs">
        {/* Left: Logo & Search */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-2xl shadow-sm cursor-pointer">
            f
          </div>

          <div className="relative hidden sm:flex items-center">
            <input
              type="text"
              placeholder="Buscar en Facebook..."
              className="py-1.5 pl-8 pr-4 rounded-full bg-slate-100 dark:bg-zinc-800 border-none text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 w-44 md:w-56"
            />
            <Search className="w-3.5 h-3.5 absolute left-2.5 text-slate-400" />
          </div>

          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-950/40 border border-purple-800/40 text-purple-300 text-[10px] font-mono">
            <EyeOff className="w-3 h-3" />
            <span className="hidden md:inline">Modo Oculto</span>
          </div>
        </div>

        {/* Center: Main View Navigation */}
        <div className="flex items-center gap-1 md:gap-4">
          <button
            onClick={() => setActiveNavTab('feed')}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-xs font-semibold ${
              activeNavTab === 'feed'
                ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400'
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-800'
            }`}
          >
            <Home className="w-4 h-4" />
            <span className="hidden md:inline">Inicio</span>
          </button>

          <button
            onClick={() => setActiveNavTab('friends')}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-xs font-semibold ${
              activeNavTab === 'friends'
                ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400'
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span className="hidden md:inline">Amigos</span>
          </button>

          <button
            onClick={() => setActiveNavTab('watch')}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-xs font-semibold ${
              activeNavTab === 'watch'
                ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400'
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-800'
            }`}
          >
            <Tv className="w-4 h-4" />
            <span className="hidden md:inline">Video</span>
          </button>

          <button
            onClick={() => setActiveNavTab('market')}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-xs font-semibold ${
              activeNavTab === 'market'
                ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400'
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-800'
            }`}
          >
            <Store className="w-4 h-4" />
            <span className="hidden md:inline">Marketplace</span>
          </button>
        </div>

        {/* Right: Quick Tools & Avatar */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden lg:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 text-[10px] font-mono">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Pixel Meta Bloqueado</span>
          </div>

          <button
            onClick={() => setShowChatModal(showChatModal ? null : 'Carlos Debian')}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 flex items-center justify-center text-slate-700 dark:text-slate-200 relative transition-colors"
            title="Mensajes directos"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-blue-500 absolute top-1 right-1" />
          </button>

          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-sm font-bold text-white shadow-sm border border-blue-400/40">
            🕶️
          </div>
        </div>
      </header>

      {/* Main Container Layout */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-4 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-6">
        {/* Left Sidebar: Shortcuts */}
        <div className="hidden md:block space-y-2 text-xs">
          <div className="p-3 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 space-y-1">
            <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 cursor-pointer font-semibold">
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
                🕶️
              </div>
              <span>Usuario Modo Oculto</span>
            </div>

            <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 cursor-pointer text-slate-600 dark:text-slate-300">
              <span className="text-base">🌀</span>
              <span>Debian Users Group</span>
            </div>

            <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 cursor-pointer text-slate-600 dark:text-slate-300">
              <Bookmark className="w-4 h-4 text-purple-500" />
              <span>Guardados</span>
            </div>

            <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 cursor-pointer text-slate-600 dark:text-slate-300">
              <Calendar className="w-4 h-4 text-rose-500" />
              <span>Eventos Linux</span>
            </div>
          </div>

          {/* Privacy Shield Card */}
          <div className="p-3.5 bg-gradient-to-br from-emerald-950/30 to-zinc-900 rounded-2xl border border-emerald-900/30 text-[11px] text-slate-300 space-y-1.5">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Privacidad FénixShield</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Tus publicaciones y chats están aislados en memoria local. Ningún rastreador de anuncios puede crear un perfil publicitario.
            </p>
          </div>
        </div>

        {/* Center: Main News Feed */}
        <div className="md:col-span-3 lg:col-span-2 space-y-4">
          {/* Stories Carousel */}
          <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
            <div className="w-24 h-36 rounded-2xl bg-gradient-to-b from-blue-600 to-indigo-700 p-2.5 flex flex-col justify-between shrink-0 shadow-sm cursor-pointer hover:scale-102 transition-transform text-white">
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
                +
              </div>
              <span className="text-[11px] font-semibold leading-tight">Crear historia</span>
            </div>

            <div className="w-24 h-36 rounded-2xl bg-zinc-800 p-2.5 flex flex-col justify-between shrink-0 shadow-sm cursor-pointer hover:scale-102 transition-transform text-white border border-zinc-700">
              <div className="w-7 h-7 rounded-full bg-red-600 flex items-center justify-center text-xs">
                🌀
              </div>
              <span className="text-[11px] font-semibold leading-tight">Debian 12 Tips</span>
            </div>

            <div className="w-24 h-36 rounded-2xl bg-zinc-800 p-2.5 flex flex-col justify-between shrink-0 shadow-sm cursor-pointer hover:scale-102 transition-transform text-white border border-zinc-700">
              <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-xs">
                🐧
              </div>
              <span className="text-[11px] font-semibold leading-tight">Kernel 6.12</span>
            </div>

            <div className="w-24 h-36 rounded-2xl bg-zinc-800 p-2.5 flex flex-col justify-between shrink-0 shadow-sm cursor-pointer hover:scale-102 transition-transform text-white border border-zinc-700">
              <div className="w-7 h-7 rounded-full bg-amber-600 flex items-center justify-center text-xs">
                ⚡
              </div>
              <span className="text-[11px] font-semibold leading-tight">Fénix Speed</span>
            </div>
          </div>

          {/* Create Post Box */}
          <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-2xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold text-white shrink-0">
                🕶️
              </div>
              <input
                type="text"
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                placeholder="¿Qué estás pensando? (Publicación en Modo Oculto)"
                className="flex-1 py-2 px-4 rounded-full bg-slate-100 dark:bg-zinc-800 border-none text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setNewPostText((prev) => prev + ' 📸 [Foto adjunta]')}
                  className="flex items-center gap-1.5 hover:text-emerald-500 transition-colors"
                >
                  <ImageIcon className="w-4 h-4 text-emerald-500" />
                  <span>Foto/video</span>
                </button>
                <button
                  type="button"
                  onClick={() => setNewPostText((prev) => prev + ' 🔥 Me siento motivado con Debian')}
                  className="flex items-center gap-1.5 hover:text-amber-500 transition-colors"
                >
                  <SmilePlus className="w-4 h-4 text-amber-500" />
                  <span>Sentimiento</span>
                </button>
              </div>

              <button
                onClick={handleCreatePost}
                disabled={!newPostText.trim()}
                className="px-4 py-1.5 rounded-full bg-blue-600 disabled:bg-slate-200 dark:disabled:bg-zinc-800 disabled:text-slate-400 text-white text-xs font-semibold hover:bg-blue-700 transition-colors shadow-2xs"
              >
                Publicar
              </button>
            </div>
          </div>

          {/* Posts Feed */}
          <div className="space-y-4">
            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-2xs p-4 space-y-3"
              >
                {/* Post Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 flex items-center justify-center text-xl shadow-xs">
                      {post.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <h4 className="font-bold text-xs md:text-sm text-slate-900 dark:text-white">
                          {post.author}
                        </h4>
                        {post.isVerified && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                        <span>{post.timeAgo}</span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5">
                          {post.privacy === 'incognito' ? (
                            <EyeOff className="w-3 h-3 text-purple-400" />
                          ) : (
                            <span>🌐</span>
                          )}
                          <span className="capitalize">{post.privacy}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>

                {/* Post Content */}
                <p className="text-xs md:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                  {post.content}
                </p>

                {/* Engagement Counters */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-b border-slate-100 dark:border-zinc-800 pb-2">
                  <div className="flex items-center gap-1">
                    <span className="flex items-center -space-x-1">
                      <span className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[9px]">
                        👍
                      </span>
                      <span className="w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center text-[9px]">
                        ❤️
                      </span>
                    </span>
                    <span className="ml-1 font-medium">{post.likes + post.loveCount}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span>{post.commentsCount} comentarios</span>
                    <span>{post.sharesCount} veces compartido</span>
                  </div>
                </div>

                {/* Action Buttons: Like, Comment, Share */}
                <div className="grid grid-cols-3 gap-1 pt-0.5 text-xs text-slate-600 dark:text-slate-400 font-medium">
                  <button
                    onClick={() => handleReaction(post.id, post.userReaction === 'love' ? 'love' : 'like')}
                    className={`py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 flex items-center justify-center gap-1.5 transition-colors ${
                      post.userReaction === 'like'
                        ? 'text-blue-600 dark:text-blue-400 font-bold'
                        : post.userReaction === 'love'
                        ? 'text-rose-600 dark:text-rose-400 font-bold'
                        : ''
                    }`}
                  >
                    <ThumbsUp
                      className={`w-4 h-4 ${post.userReaction ? 'fill-current' : ''}`}
                    />
                    <span>{post.userReaction ? 'Me gusta' : 'Reaccionar'}</span>
                  </button>

                  <button
                    onClick={() =>
                      setActiveCommentPostId(
                        activeCommentPostId === post.id ? null : post.id
                      )
                    }
                    className="py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Comentar</span>
                  </button>

                  <button
                    onClick={() => alert('Publicación compartida con éxito en tu muro privado')}
                    className="py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Compartir</span>
                  </button>
                </div>

                {/* Comments Thread Section */}
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-zinc-800/80">
                  {post.comments.map((cmt) => (
                    <div key={cmt.id} className="flex gap-2.5 text-xs">
                      <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-zinc-800 flex items-center justify-center text-xs shrink-0">
                        {cmt.avatar}
                      </div>
                      <div className="flex-1 bg-slate-100 dark:bg-zinc-800/80 p-2.5 rounded-2xl">
                        <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
                          {cmt.author}
                        </span>
                        <p className="text-slate-700 dark:text-slate-200">{cmt.text}</p>
                      </div>
                    </div>
                  ))}

                  {/* Comment Input */}
                  <form
                    onSubmit={(e) => handleAddComment(post.id, e)}
                    className="flex items-center gap-2 pt-1"
                  >
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs shrink-0">
                      🕶️
                    </div>
                    <input
                      type="text"
                      value={commentInputText}
                      onChange={(e) => setCommentInputText(e.target.value)}
                      placeholder="Escribe una respuesta en modo oculto..."
                      className="flex-1 py-1.5 px-3 rounded-full bg-slate-100 dark:bg-zinc-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      disabled={!commentInputText.trim()}
                      className="p-1.5 rounded-full text-blue-600 hover:bg-blue-50 dark:hover:bg-zinc-800 disabled:opacity-40"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Right Sidebar: Active Contacts & Friends */}
        <div className="hidden lg:block space-y-3 text-xs">
          <div className="p-3 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 space-y-2">
            <h4 className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
              Contactos Activos (P2P Encriptado)
            </h4>

            <div
              onClick={() => setShowChatModal('Carlos Debian')}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 cursor-pointer"
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-zinc-800 flex items-center justify-center text-sm">
                  👨‍💻
                </div>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute bottom-0 right-0 ring-2 ring-white dark:ring-zinc-900" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">Carlos Debian</p>
                <p className="text-[10px] text-emerald-500 truncate">En línea en Debian 12</p>
              </div>
            </div>

            <div
              onClick={() => setShowChatModal('Laura Sysadmin')}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 cursor-pointer"
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-zinc-800 flex items-center justify-center text-sm">
                  👩‍🔬
                </div>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute bottom-0 right-0 ring-2 ring-white dark:ring-zinc-900" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">Laura Sysadmin</p>
                <p className="text-[10px] text-slate-400 truncate">En línea hace 5 min</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Chat Floating Modal (if open) */}
      {showChatModal && (
        <div className="fixed bottom-4 right-6 w-80 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-2xl shadow-2xl z-40 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-3 bg-blue-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base">👨‍💻</span>
              <span className="font-bold text-xs">{showChatModal}</span>
            </div>
            <button
              onClick={() => setShowChatModal(null)}
              className="p-1 hover:bg-blue-700 rounded-full"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Messages */}
          <div className="p-3 h-52 overflow-y-auto space-y-2 text-xs">
            {chatMessages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.sender === 'Tú' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`p-2 rounded-xl max-w-[80%] leading-relaxed ${
                    m.sender === 'Tú'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-slate-100'
                  }`}
                >
                  <p>{m.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendChatMessage} className="p-2 border-t border-slate-200 dark:border-zinc-800 flex gap-1">
            <input
              type="text"
              value={newChatInput}
              onChange={(e) => setNewChatInput(e.target.value)}
              placeholder="Escribe un mensaje privado..."
              className="flex-1 py-1 px-3 bg-slate-100 dark:bg-zinc-800 rounded-full text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
            />
            <button
              type="submit"
              className="p-1.5 rounded-full bg-blue-600 text-white hover:bg-blue-700"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
