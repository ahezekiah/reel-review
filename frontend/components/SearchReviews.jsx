'use client';

import { useState } from 'react';

import ReviewList from './ReviewList';
import { API_URL } from '../lib/api';

export default function SearchReviews() {
    const [query, setQuery] = useState('');

    const [reviews, setReviews] = useState([]);

    const [hasSearched, setHasSearched] =
        useState(false);

    const [isLoading, setIsLoading] =
        useState(false);

    const [error, setError] = useState('');

    async function handleSubmit(event) {
        event.preventDefault();

        const trimmedQuery = query.trim();

        if (!trimmedQuery) {
            setError(
                'Enter part of a movie title before searching.'
            );

            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await fetch(
                `${API_URL}/api/reviews?search=${encodeURIComponent(
                    trimmedQuery
                )}`
            );

            if (!response.ok) {
                throw new Error(
                    'Could not search reviews.'
                );
            }

            const data = await response.json();

            setReviews(data);
            setHasSearched(true);
        } catch (searchError) {
            setError(searchError.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <form
                className="search-form"
                onSubmit={handleSubmit}
            >
                <label htmlFor="movie-search">
                    Search by movie title
                </label>

                <div className="search-row">
                    <input
                        id="movie-search"
                        type="text"
                        value={query}
                        onChange={(event) =>
                            setQuery(event.target.value)
                        }
                        placeholder="Try spider, hunger, or avatar"
                    />

                    <button
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading
                            ? 'Searching...'
                            : 'Search'}
                    </button>
                </div>

                <p className="helper-text">
                    Search is case-insensitive and
                    supports partial titles.
                </p>
            </form>

            {error && (
                <p
                    className="error-message"
                    role="alert"
                >
                    {error}
                </p>
            )}

            {hasSearched && (
                <ReviewList
                    reviews={reviews}
                    emptyMessage={`No reviews matched “${query.trim()}”.`}
                />
            )}
        </>
    );
}