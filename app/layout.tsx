import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Fénix Navegador - Navegador Ultraligero para Debian Linux',
  description:
    'Navegador ultraligero estilo Google Chrome optimizado para Debian Linux con pestañas, omnibox inteligente, bloqueador de anuncios FénixShield, modo lectura, descargas, historial y herramientas para desarrolladores.',
  icons: {
    icon: [
      { url: '/fenix-logo.png', sizes: 'any' },
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.png', type: 'image/png' }
    ],
    shortcut: ['/fenix-logo.png'],
    apple: [
      { url: '/fenix-logo.png' }
    ]
  },
  openGraph: {
    title: 'Fénix Navegador - Navegador Ultraligero para Debian Linux',
    description:
      'Navegador ultraligero estilo Google Chrome optimizado para Debian Linux con pestañas, omnibox inteligente, bloqueador de anuncios FénixShield, modo lectura, descargas, historial y herramientas para desarrolladores.',
    images: ['/fenix-logo.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fénix Navegador - Navegador Ultraligero para Debian Linux',
    description:
      'Navegador ultraligero estilo Google Chrome optimizado para Debian Linux con pestañas, omnibox inteligente, bloqueador de anuncios FénixShield, modo lectura, descargas, historial y herramientas para desarrolladores.',
    images: ['/fenix-logo.png'],
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/fenix-logo.png" type="image/png" />
        <link rel="shortcut icon" href="/fenix-logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/fenix-logo.png" />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
