import SearchReviews from '../../components/SearchReviews';

export default function SearchReviewsPage() {
    return (
        <section className="page-section">
            <p className="eyebrow">
                Find an opinion
            </p>

            <h1>Search reviews</h1>

            <p className="page-intro">
                Enter any part of a movie title.
                Capitalization does not matter.
            </p>

            <SearchReviews />
        </section>
    );
}