import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Eventide Sign-Up',
  description: 'Event registration page',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen bg-background">
        <header className="py-4 px-4 sm:px-6 md:px-8 border-b border-border">
          <div className="container mx-auto">
            <Link href="/" className="cursor-pointer">
              <h1 className="font-headline text-2xl md:text-3xl font-bold text-primary">Eventide</h1>
              <p className="text-muted-foreground text-md">Problem Statements</p>
            </Link>
          </div>
        </header>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
