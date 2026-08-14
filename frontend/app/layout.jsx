import './globals.css';

import NavBar from '../components/NavBar';

export const metadata = {
  title: 'Reel Reviews',
  description:
    'Save, browse, and search movie reviews.'
};

export default function RootLayout({
  children
}) {
  return (
    <html lang="en">
      <body>
        <NavBar />

        <main className="container main-content">
          {children}
        </main>

        <footer className="site-footer">
          <div className="container">
            &copy; {new Date().getFullYear()} Reel Reviews · Amanda Hezekiah
          </div>
        </footer>
      </body>
    </html>
  );
}
