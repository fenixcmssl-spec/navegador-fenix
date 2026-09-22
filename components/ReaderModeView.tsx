'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  Volume2,
  VolumeX,
  Sparkles,
  Type,
  Sun,
  Moon,
  Coffee,
  X,
  Share2,
  Clock,
  User,
} from 'lucide-react';

interface ReaderModeViewProps {
  title: string;
  url: string;
  plainText?: string;
  author?: string;
  readTime?: string;
  onClose: () => void;
  onAskAiSummary: () => void;
}

export default function ReaderModeView({
  title,
  url,
  plainText = '',
  author = 'Redacción',
  readTime = '3 min',
  onClose,
  onAskAiSummary,
}: ReaderModeViewProps) {
  const [theme, setTheme] = useState<'light' | 'sepia' | 'dark'>('sepia');
  const [fontSize, setFontSize] = useState<number>(18);
  const [fontFamily, setFontFamily] = useState<'serif' | 'sans' | 'mono'>('serif');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const toggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('La síntesis de voz no está soportada en este entorno.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(plainText || title);
      utterance.lang = 'es-ES';
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const getThemeClasses = () => {
    switch (theme) {
      case 'sepia':
        return 'bg-[#fbf0d9] text-[#5f4b32]';
      case 'dark':
        return 'bg-[#121212] text-[#e0e0e0]';
      default:
        return 'bg-white text-[#202124]';
    }
  };

  const getFontFamilyClass = () => {
    switch (fontFamily) {
      case 'serif':
        return 'font-serif';
      case 'mono':
        return 'font-mono';
      default:
        return 'font-sans';
    }
  };

  // Convert plainText into paragraphs
  const paragraphs = (plainText || '')
    .split(/\n\s*\n|\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  return (
    <div className={`w-full min-h-full transition-colors duration-200 ${getThemeClasses()}`}>
      {/* Floating Reader Toolbar */}
      <div className="sticky top-0 z-40 backdrop-blur-md bg-opacity-90 border-b border-black/10 dark:border-white/10 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold">
          <BookOpen className="w-4 h-4 text-red-600" />
          <span>Modo Lectura de Fénix</span>
        </div>

        {/* Reader Customization Controls */}
        <div className="flex items-center gap-3 text-xs">
          {/* AI Summary Button */}
          <button
            onClick={onAskAiSummary}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold hover:bg-amber-500/30 transition-colors"
            title="Resumen con Gemini IA"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">Resumir con IA</span>
          </button>

          {/* Text to Speech */}
          <button
            onClick={toggleSpeech}
            className={`p-1.5 rounded-lg border transition-colors ${
              isSpeaking
                ? 'bg-red-600 text-white border-red-600 animate-pulse'
                : 'border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5'
            }`}
            title={isSpeaking ? 'Pausar locución' : 'Leer en voz alta'}
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Font Family Selector */}
          <div className="flex items-center border border-black/10 dark:border-white/10 rounded-lg overflow-hidden">
            <button
              onClick={() => setFontFamily('serif')}
              className={`px-2 py-1 font-serif text-xs ${fontFamily === 'serif' ? 'bg-black/10 dark:bg-white/10 font-bold' : ''}`}
            >
              Serif
            </button>
            <button
              onClick={() => setFontFamily('sans')}
              className={`px-2 py-1 font-sans text-xs ${fontFamily === 'sans' ? 'bg-black/10 dark:bg-white/10 font-bold' : ''}`}
            >
              Sans
            </button>
            <button
              onClick={() => setFontFamily('mono')}
              className={`px-2 py-1 font-mono text-xs ${fontFamily === 'mono' ? 'bg-black/10 dark:bg-white/10 font-bold' : ''}`}
            >
              Mono
            </button>
          </div>

          {/* Font Size +/- */}
          <div className="flex items-center border border-black/10 dark:border-white/10 rounded-lg overflow-hidden">
            <button
              onClick={() => setFontSize(Math.max(14, fontSize - 2))}
              className="px-2 py-1 hover:bg-black/5 dark:hover:bg-white/5 font-bold"
            >
              A-
            </button>
            <span className="px-1 text-[11px] font-mono">{fontSize}</span>
            <button
              onClick={() => setFontSize(Math.min(28, fontSize + 2))}
              className="px-2 py-1 hover:bg-black/5 dark:hover:bg-white/5 font-bold"
            >
              A+
            </button>
          </div>

          {/* Theme Palette */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setTheme('light')}
              className={`w-6 h-6 rounded-full bg-white border border-slate-300 shadow-xs flex items-center justify-center text-[10px] ${
                theme === 'light' ? 'ring-2 ring-red-500' : ''
              }`}
              title="Tema Claro"
            >
              <Sun className="w-3 h-3 text-slate-700" />
            </button>
            <button
              onClick={() => setTheme('sepia')}
              className={`w-6 h-6 rounded-full bg-[#fbf0d9] border border-[#d8c39d] shadow-xs flex items-center justify-center text-[10px] ${
                theme === 'sepia' ? 'ring-2 ring-red-500' : ''
              }`}
              title="Tema Sepia Cómodo"
            >
              <Coffee className="w-3 h-3 text-[#5f4b32]" />
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`w-6 h-6 rounded-full bg-[#121212] border border-zinc-700 shadow-xs flex items-center justify-center text-[10px] ${
                theme === 'dark' ? 'ring-2 ring-red-500' : ''
              }`}
              title="Tema Oscuro OLED"
            >
              <Moon className="w-3 h-3 text-zinc-300" />
            </button>
          </div>

          {/* Exit Reader Mode */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            title="Salir del modo lectura"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Reader Article Body */}
      <article className={`max-w-2xl mx-auto py-12 px-6 ${getFontFamilyClass()}`}>
        <header className="mb-8 pb-6 border-b border-black/10 dark:border-white/10">
          <h1
            className="font-bold tracking-tight leading-tight mb-4"
            style={{ fontSize: `${fontSize * 1.6}px` }}
          >
            {title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs opacity-70">
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              <span>{author}</span>
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Tiempo de lectura estimado: {readTime}</span>
            </span>
            <span className="font-mono truncate max-w-[200px]">{url}</span>
          </div>
        </header>

        {/* Content Paragraphs */}
        <div className="space-y-6 leading-relaxed" style={{ fontSize: `${fontSize}px` }}>
          {paragraphs.length === 0 ? (
            <p className="italic opacity-70">
              No se pudo extraer texto formateado para este documento. Puedes ver la versión completa en modo estándar.
            </p>
          ) : (
            paragraphs.map((p, idx) => (
              <p key={idx} className="leading-relaxed">
                {p}
              </p>
            ))
          )}
        </div>
      </article>
    </div>
  );
}
