import ReviewList from '../../components/ReviewList';
import { getReviews } from '../../lib/api';

export default async function ReviewsPage({
    searchParams
}) {
    let reviews = [];
    let loadError = '';

    const params = await searchParams;

    try {
        reviews = await getReviews();
    } catch (error) {
        loadError = error.message;
    }

    return (
        <section className="page-section">
            <p className="eyebrow">
                The full collection
            </p>

            <h1>All reviews</h1>

            <p className="page-intro">
                Every saved review is loaded from the
                Express backend.
            </p>

            {params?.added === 'true' && (
                <p className="success-message">
                    Your review was saved successfully.
                </p>
            )}

            {loadError ? (
                <p className="error-message">
                    {loadError}
                </p>
            ) : (
                <ReviewList reviews={reviews} />
            )}
        </section>
    );
}