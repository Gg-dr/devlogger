import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Layout/Navbar';
import { AuthProvider } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'DevLogger - Track Your Developer Journey',
  description: 'A dashboard to track your coding activities and progress',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen bg-gray-500">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}