// import { promises as fs } from 'node:fs';
// import path from 'node:path';
// import { fileURLToPath } from 'node:url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const DATA_FILE = path.join(
//     __dirname,
//     '..',
//     'data',
//     'reviews.json'
// );

// async function ensureDataFile() {
//     try {
//         await fs.access(DATA_FILE);
//     } catch {
//         await fs.mkdir(path.dirname(DATA_FILE), {
//             recursive: true
//         });

//         await fs.writeFile(
//             DATA_FILE,
//             '[]',
//             'utf8'
//         );
//     }
// }

// export async function getReviews() {
//     await ensureDataFile();

//     const rawData = await fs.readFile(
//         DATA_FILE,
//         'utf8'
//     );

//     try {
//         const reviews = JSON.parse(rawData);

//         return Array.isArray(reviews)
//             ? reviews
//             : [];
//     } catch {
//         await fs.writeFile(
//             DATA_FILE,
//             '[]',
//             'utf8'
//         );

//         return [];
//     }
// }

// export async function saveReviews(reviews) {
//     await fs.writeFile(
//         DATA_FILE,
//         JSON.stringify(reviews, null, 2),
//         'utf8'
//     );
// }

// export async function addReview(review) {
//     const reviews = await getReviews();

//     reviews.push(review);

//     await saveReviews(reviews);

//     return review;
// }

import supabase from './supabase.js';

function mapReview(row) {
    return {
        id: row.id,
        movieTitle: row.movie_title,
        reviewerName: row.reviewer_name,
        rating: row.rating,
        reviewText: row.review_text,
        createdAt: row.created_at
    };
}

export async function getReviews() {
    const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', {
            ascending: false
        });

    if (error) {
        throw new Error(
            `Unable to load reviews: ${error.message}`
        );
    }

    return data.map(mapReview);
}

export async function addReview(review) {
    const { data, error } = await supabase
        .from('reviews')
        .insert({
            id: review.id,
            movie_title: review.movieTitle,
            reviewer_name: review.reviewerName,
            rating: review.rating,
            review_text: review.reviewText,
            created_at: review.createdAt
        })
        .select()
        .single();

    if (error) {
        throw new Error(
            `Unable to save review: ${error.message}`
        );
    }

    return mapReview(data);
}