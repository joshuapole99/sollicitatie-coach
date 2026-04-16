import type { Metadata } from 'next';
import './globals.css';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Sollicitatie Coach — AI CV Analyse & Motivatiebrief',
  description: 'Schrijf in 30 seconden een professionele motivatiebrief op maat. Analyseer je CV op een vacature, bereid je voor op interviews en volg je sollicitaties. Gratis proberen.',
  keywords: 'motivatiebrief schrijven, CV analyse, sollicitatiebrief AI, interview voorbereiding, sollicitatie coach',
  openGraph: {
    title: 'Sollicitatie Coach — AI CV Analyse & Motivatiebrief',
    description: 'AI-powered sollicitatiecoach. Beter CV, betere brieven, meer interviews.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <head>
        <meta name="google-site-verification" content="ryj8EEkXeSiHPluEDmeKREf6RJj9WhQjFtCgCwgOEDU" />
      </head>
      <body className="min-h-screen flex flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
