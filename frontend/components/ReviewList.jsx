import ReviewCard from './ReviewCard';

export default function ReviewList({
    reviews,
    emptyMessage = 'No reviews found.'
}) {
    if (!reviews.length) {
        return (
            <div className="empty-state">
                <p>{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="review-grid">
            {reviews.map((review) => (
                <ReviewCard
                    key={review.id}
                    review={review}
                />
            ))}
        </div>
    );
}