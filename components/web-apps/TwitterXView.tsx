'use client';

import React, { useState } from 'react';
import {
  Heart,
  Repeat2,
  MessageCircle,
  Share,
  Search,
  Sparkles,
  ShieldCheck,
  EyeOff,
  Flame,
  CheckCircle2,
  Send,
} from 'lucide-react';

interface Tweet {
  id: string;
  author: string;
  handle: string;
  avatar: string;
  time: string;
  text: string;
  tag?: string;
  likes: number;
  retweets: number;
  replies: number;
  userLiked?: boolean;
  userRetweeted?: boolean;
}

const INITIAL_TWEETS: Tweet[] = [
  {
    id: 'tw-1',
    author: 'Debian Project',
    handle: '@debian',
    avatar: '🌀',
    time: '2h',
    text: 'Debian 12 "Bookworm" is officially the benchmark for Linux stability. Over 59,000 packages ready with zero telemetry tracking.',
    tag: '#Debian #Linux',
    likes: 1840,
    retweets: 420,
    replies: 94,
  },
  {
    id: 'tw-2',
    author: 'Fénix Browser Lab',
    handle: '@fenix_browser',
    avatar: '🔥',
    time: '4h',
    text: '🚀 Modo Oculto Permanente is now active by default in Fénix. Seamless zero-fingerprint web navigation on YouTube, Facebook, and modern SPAs using only ~35MB RAM.',
    tag: '#WebPrivacy #Debian',
    likes: 3120,
    retweets: 890,
    replies: 154,
  },
  {
    id: 'tw-3',
    author: 'Linux Kernel Org',
    handle: '@kernel_org',
    avatar: '🐧',
    time: '7h',
    text: 'Linux 6.12 kernel brings enhanced scheduler optimizations and real-time audio/video decoding for lightweight desktop environments.',
    tag: '#Kernel #OpenSource',
    likes: 950,
    retweets: 210,
    replies: 45,
  },
];

interface TwitterXViewProps {
  onNavigate?: (url: string) => void;
  onAskAiSummary?: () => void;
}

export default function TwitterXView({ onNavigate, onAskAiSummary }: TwitterXViewProps) {
  const [tweets, setTweets] = useState<Tweet[]>(INITIAL_TWEETS);
  const [newTweetText, setNewTweetText] = useState('');

  const handlePostTweet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTweetText.trim()) return;

    const newTweet: Tweet = {
      id: `tw-${Date.now()}`,
      author: 'Usuario Fénix',
      handle: '@modo_oculto',
      avatar: '🕶️',
      time: 'ahora',
      text: newTweetText.trim(),
      likes: 1,
      retweets: 0,
      replies: 0,
      userLiked: true,
    };

    setTweets([newTweet, ...tweets]);
    setNewTweetText('');
  };

  const handleLike = (id: string) => {
    setTweets(
      tweets.map((t) =>
        t.id === id
          ? {
              ...t,
              userLiked: !t.userLiked,
              likes: t.userLiked ? t.likes - 1 : t.likes + 1,
            }
          : t
      )
    );
  };

  const handleRetweet = (id: string) => {
    setTweets(
      tweets.map((t) =>
        t.id === id
          ? {
              ...t,
              userRetweeted: !t.userRetweeted,
              retweets: t.userRetweeted ? t.retweets - 1 : t.retweets + 1,
            }
          : t
      )
    );
  };

  return (
    <div className="w-full min-h-full bg-black text-white font-sans flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-20 bg-black/90 backdrop-blur-md border-b border-zinc-800 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold font-mono">𝕏</span>
          <span className="text-xs text-zinc-400">/ Twitter</span>
          <span className="ml-2 px-2 py-0.5 rounded-full bg-purple-950 border border-purple-800 text-purple-300 text-[10px] font-mono">
            🕶️ Modo Oculto
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Sin Rastreo de Anuncios</span>
          </div>
        </div>
      </header>

      {/* Main Feed Container */}
      <div className="max-w-2xl mx-auto w-full p-4 space-y-4">
        {/* Post Tweet Form */}
        <form
          onSubmit={handlePostTweet}
          className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3"
        >
          <div className="flex gap-3">
            <div className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center text-sm shrink-0">
              🕶️
            </div>
            <textarea
              rows={2}
              value={newTweetText}
              onChange={(e) => setNewTweetText(e.target.value)}
              placeholder="¿Qué está pasando? (Post anónimo en Modo Oculto)"
              className="w-full bg-transparent text-xs text-white placeholder:text-zinc-500 focus:outline-none resize-none"
            />
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-zinc-800 text-xs">
            <span className="text-zinc-500 text-[11px]">Fénix Anti-Tracking Activo</span>
            <button
              type="submit"
              disabled={!newTweetText.trim()}
              className="px-4 py-1.5 rounded-full bg-white text-black font-bold disabled:opacity-40 hover:bg-zinc-200 transition-colors"
            >
              Postear
            </button>
          </div>
        </form>

        {/* Timeline Tweets */}
        <div className="space-y-3">
          {tweets.map((t) => (
            <div
              key={t.id}
              className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-colors space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{t.avatar}</span>
                  <div>
                    <span className="font-bold text-xs text-white mr-1">{t.author}</span>
                    <span className="text-zinc-500 text-xs">{t.handle}</span>
                  </div>
                </div>
                <span className="text-zinc-500 text-xs">{t.time}</span>
              </div>

              <p className="text-xs text-zinc-200 leading-relaxed">{t.text}</p>
              {t.tag && <span className="text-blue-400 text-xs block">{t.tag}</span>}

              <div className="flex items-center justify-between pt-2 text-zinc-500 text-xs max-w-sm">
                <button className="flex items-center gap-1 hover:text-blue-400">
                  <MessageCircle className="w-4 h-4" />
                  <span>{t.replies}</span>
                </button>
                <button
                  onClick={() => handleRetweet(t.id)}
                  className={`flex items-center gap-1 hover:text-emerald-400 ${
                    t.userRetweeted ? 'text-emerald-400 font-bold' : ''
                  }`}
                >
                  <Repeat2 className="w-4 h-4" />
                  <span>{t.retweets}</span>
                </button>
                <button
                  onClick={() => handleLike(t.id)}
                  className={`flex items-center gap-1 hover:text-rose-400 ${
                    t.userLiked ? 'text-rose-500 font-bold' : ''
                  }`}
                >
                  <Heart className={`w-4 h-4 ${t.userLiked ? 'fill-rose-500' : ''}`} />
                  <span>{t.likes}</span>
                </button>
                <button className="hover:text-blue-400">
                  <Share className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
