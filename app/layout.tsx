import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Fénix Navegador - Navegador Ultraligero para Debian Linux',
  description:
    'Navegador ultraligero estilo Google Chrome optimizado para Debian Linux con pestañas, omnibox inteligente, bloqueador de anuncios FénixShield, modo lectura, descargas, historial y herramientas para desarrolladores.',
  openGraph: {
    title: 'Fénix Navegador - Navegador Ultraligero para Debian Linux',
    description:
      'Navegador ultraligero estilo Google Chrome optimizado para Debian Linux con pestañas, omnibox inteligente, bloqueador de anuncios FénixShield, modo lectura, descargas, historial y herramientas para desarrolladores.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fénix Navegador - Navegador Ultraligero para Debian Linux',
    description:
      'Navegador ultraligero estilo Google Chrome optimizado para Debian Linux con pestañas, omnibox inteligente, bloqueador de anuncios FénixShield, modo lectura, descargas, historial y herramientas para desarrolladores.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
