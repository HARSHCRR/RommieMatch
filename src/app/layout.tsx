import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'RoomieMatch - Find Your Perfect Roommate',
  description: 'Swipe to find compatible roommates with shared interests and lifestyle preferences.',
  keywords: 'roommate, find roommate, housing, shared living, compatibility',
  authors: [{ name: 'RoomieMatch Team' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full antialiased`}>
        <div id="root" className="h-full">
          {children}
        </div>
      </body>
    </html>
  );
}
