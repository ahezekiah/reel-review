export const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:4000';

export async function getReviews(search = '') {
    const query = search
        ? `?search=${encodeURIComponent(search)}`
        : '';

    const response = await fetch(
        `${API_URL}/api/reviews${query}`,
        {
            cache: 'no-store'
        }
    );

    if (!response.ok) {
        throw new Error(
            'Unable to load reviews. Make sure the Express server is running.'
        );
    }

    return response.json();
}