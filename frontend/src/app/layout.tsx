import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import { cn } from "@/lib/utils";
import './globals.css';

const outfit = Outfit({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'VIT Bhopal Anonymous Chat',
  description: 'Exclusive random chat & video platform for VIT Bhopal students.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={cn(outfit.className, "dark antialiased bg-black")}>
        <div className="bg-noise"></div>
        {children}
      </body>
    </html>
  );
}
