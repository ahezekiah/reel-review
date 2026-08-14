import Link from 'next/link';

import ReviewList from '../components/ReviewList';
import { getReviews } from '../lib/api';

export default async function HomePage() {
  let reviews = [];
  let loadError = '';

  try {
    reviews = await getReviews();
  } catch (error) {
    loadError = error.message;
  }

  return (
    <>
      <section className="hero">
        <p className="eyebrow">
          Your movie journal
        </p>

        <h1>
          Rate it. Review it. Find it later.
        </h1>

        <p>
          Reel Reviews stores your movie
          opinions in an Express backend and
          displays them through a Next.js
          frontend.
        </p>

        <div className="hero-actions">
          <Link
            href="/add-review"
            className="button-link"
          >
            Write a Review
          </Link>

          <Link
            href="/search-reviews"
            className="text-link"
          >
            Search Reviews →
          </Link>
        </div>
      </section>

      <section className="section-heading">
        <div>
          <p className="eyebrow">
            Recently Added
          </p>

          <h2>Latest Reviews</h2>
        </div>

        <Link href="/reviews">
          View All →
        </Link>
      </section>

      {loadError ? (
        <p className="error-message">
          {loadError}
        </p>
      ) : (
        <ReviewList
          reviews={reviews.slice(0, 3)}
        />
      )}
    </>
  );
}