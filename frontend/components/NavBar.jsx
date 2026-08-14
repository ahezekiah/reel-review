import Link from 'next/link';

const links = [
    {
        href: '/',
        label: 'Home'
    },
    {
        href: '/add-review',
        label: 'Add Review'
    },
    {
        href: '/search-reviews',
        label: 'Search Reviews'
    },
    {
        href: '/reviews',
        label: 'All Reviews'
    }
];

export default function NavBar() {
    return (
        <header className="site-header">
            <nav
                className="nav container"
                aria-label="Main navigation"
            >
                <Link href="/" className="brand">
                    Reel Reviews
                </Link>

                <div className="nav-links">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            </nav>
        </header>
    );
}