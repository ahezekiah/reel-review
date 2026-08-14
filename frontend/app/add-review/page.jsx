import AddReviewForm from '../../components/AddReviewForm';

export default function AddReviewPage() {
    return (
        <section className="page-section narrow">
            <p className="eyebrow">
                Add to the Collection
            </p>

            <h1>Write a Movie Review</h1>

            <p className="page-intro">
                Give the movie a rating from 1–5 and
                share what you thought.
            </p>

            <AddReviewForm />
        </section>
    );
}