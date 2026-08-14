import express from 'express';
import { randomUUID } from 'node:crypto';

import {
    addReview,
    getReviews
} from './reviewStore.js';

const app = express();

const PORT = process.env.PORT || 4000;

const FRONTEND_URL =
    process.env.FRONTEND_URL ||
    'http://localhost:3000';

app.use((req, res, next) => {
    res.header(
        'Access-Control-Allow-Origin',
        FRONTEND_URL
    );

    res.header(
        'Access-Control-Allow-Headers',
        'Content-Type'
    );

    res.header(
        'Access-Control-Allow-Methods',
        'GET,POST,OPTIONS'
    );

    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }

    next();
});

app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: 'Movie Review API is running.'
    });
});

app.get('/api/reviews', async (req, res, next) => {
    try {
        const search = String(
            req.query.search || ''
        )
            .trim()
            .toLowerCase();

        const reviews = await getReviews();

        const results = search
            ? reviews.filter((review) =>
                review.movieTitle
                    .toLowerCase()
                    .includes(search)
            )
            : reviews;

        results.sort(
            (a, b) =>
                new Date(b.createdAt) -
                new Date(a.createdAt)
        );

        res.json(results);
    } catch (error) {
        next(error);
    }
});

app.get('/api/reviews/:id', async (req, res, next) => {
    try {
        const reviews = await getReviews();

        const review = reviews.find(
            (item) => item.id === req.params.id
        );

        if (!review) {
            return res.status(404).json({
                error: 'Review not found.'
            });
        }

        res.json(review);
    } catch (error) {
        next(error);
    }
});

app.post('/api/reviews', async (req, res, next) => {
    try {
        const movieTitle = String(
            req.body.movieTitle || ''
        ).trim();

        const reviewText = String(
            req.body.reviewText || ''
        ).trim();

        const reviewerName = String(
            req.body.reviewerName || ''
        ).trim();

        const rating = Number(req.body.rating);

        if (
            !movieTitle ||
            !reviewText ||
            !reviewerName
        ) {
            return res.status(400).json({
                error:
                    'Movie title, reviewer name, and review are required.'
            });
        }

        if (
            !Number.isInteger(rating) ||
            rating < 1 ||
            rating > 5
        ) {
            return res.status(400).json({
                error:
                    'Rating must be a whole number from 1 to 5.'
            });
        }

        const review = {
            id: randomUUID(),
            movieTitle,
            rating,
            reviewText,
            reviewerName,
            createdAt: new Date().toISOString()
        };

        await addReview(review);

        res.status(201).json(review);
    } catch (error) {
        next(error);
    }
});

app.use((error, req, res, next) => {
    console.error(error);

    res.status(500).json({
        error: 'Something went wrong on the server.'
    });
});

app.listen(PORT, () => {
    console.log(
        `Movie Review API running at http://localhost:${PORT}`
    );
});