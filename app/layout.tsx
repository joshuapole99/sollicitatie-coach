import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Sollicitatie Coach — AI CV Analyse & Motivatiebrief',
  description: 'Schrijf in 30 seconden een professionele motivatiebrief op maat. Analyseer je CV, bereid je voor op interviews en volg je sollicitaties.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <head>
        <meta name="google-site-verification" content="ryj8EEkXeSiHPluEDmeKREf6RJj9WhQjFtCgCwgOEDU" />
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
