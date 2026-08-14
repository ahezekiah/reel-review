export default function ReviewCard({ review }) {
    return (
        <article className="review-card">
            <div className="review-card-top">
                <div>
                    <p className="eyebrow">
                        Movie review
                    </p>

                    <h2>{review.movieTitle}</h2>
                </div>

                <p
                    className="rating"
                    aria-label={`${review.rating} out of 5 stars`}
                >
                    {'★'.repeat(review.rating)}
                    {'☆'.repeat(5 - review.rating)}
                </p>
            </div>

            <p className="review-text">
                “{review.reviewText}”
            </p>

            <footer>
                <strong>{review.reviewerName}</strong>

                <span>
                    {new Date(
                        review.createdAt
                    ).toLocaleDateString()}
                </span>
            </footer>
        </article>
    );
}