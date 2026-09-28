import './globals.css';

export const metadata = {
  title: 'MoltenStar — Open-Source Projects & Design Hub',
  description: 'Official project hub for ExteraMS (Material Design 3 Telegram Client for Android) and kdeMS (Android 15/16 Customization Suite for KDE Plasma 6).',
  icons: {
    icon: '/logo.svg',
    apple: '/logo.svg',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFBFF' },
    { media: '(prefers-color-scheme: dark)', color: '#0E0807' },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru" data-theme="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Outfit:wght@400;500;600;700;800&family=Roboto+Flex:opsz,wght@8..144,300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,300..700,0..1,-50..200&display=block"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
