import './globals.css';

export const metadata = {
  title: 'MoltenStar',
  description: 'AI Chat powered by Grok'
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>
        {children}
      </body>
    </html>
  );
}
