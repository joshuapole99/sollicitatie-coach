import type { Metadata } from 'next';
import './globals.css';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Sollicitatie Coach — AI CV Analyse & Motivatiebrief',
  description: 'Schrijf in 30 seconden een professionele motivatiebrief op maat. Analyseer je CV, bereid je voor op interviews en volg je sollicitaties.',
  keywords: 'motivatiebrief schrijven, CV analyse, sollicitatiebrief AI, interview voorbereiding',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <head>
        <meta name="google-site-verification" content="ryj8EEkXeSiHPluEDmeKREf6RJj9WhQjFtCgCwgOEDU" />
      </head>
      <body>
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
