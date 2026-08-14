'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { API_URL } from '../lib/api';

const initialForm = {
    movieTitle: '',
    reviewerName: '',
    rating: '5',
    reviewText: ''
};

export default function AddReviewForm() {
    const [form, setForm] = useState(initialForm);

    const [error, setError] = useState('');

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    const router = useRouter();

    function handleChange(event) {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setError('');
        setIsSubmitting(true);

        try {
            const response = await fetch(
                `${API_URL}/api/reviews`,
                {
                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json'
                    },

                    body: JSON.stringify({
                        ...form,
                        rating: Number(form.rating)
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error ||
                    'Could not save the review.'
                );
            }

            setForm(initialForm);

            router.push('/reviews?added=true');

            router.refresh();
        } catch (submitError) {
            setError(submitError.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form
            className="review-form"
            onSubmit={handleSubmit}
        >
            <label>
                Movie title

                <input
                    type="text"
                    name="movieTitle"
                    value={form.movieTitle}
                    onChange={handleChange}
                    required
                />
            </label>

            <div className="form-row">
                <label>
                    Your name

                    <input
                        type="text"
                        name="reviewerName"
                        value={form.reviewerName}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Rating

                    <select
                        name="rating"
                        value={form.rating}
                        onChange={handleChange}
                    >
                        <option value="5">
                            5 - Excellent
                        </option>

                        <option value="4">
                            4 - Great
                        </option>

                        <option value="3">
                            3 - Good
                        </option>

                        <option value="2">
                            2 - Fair
                        </option>

                        <option value="1">
                            1 - Poor
                        </option>
                    </select>
                </label>
            </div>

            <label>
                Review

                <textarea
                    name="reviewText"
                    rows="7"
                    value={form.reviewText}
                    onChange={handleChange}
                    required
                />
            </label>

            {error && (
                <p
                    className="error-message"
                    role="alert"
                >
                    {error}
                </p>
            )}

            <button
                type="submit"
                disabled={isSubmitting}
            >
                {isSubmitting
                    ? 'Submitting...'
                    : 'Submit Review'}
            </button>
        </form>
    );
}