import './globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'The Nomikai Club',
  description: 'Supabase-backed community for Tokyo whisky and vinyl bars.'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <h1>The Nomikai Club</h1>
          <nav>
            <a href="/">Home</a>
            <a href="/login">Login / Register</a>
            <a href="/reviews/new">Create Review</a>
          </nav>
        </header>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
