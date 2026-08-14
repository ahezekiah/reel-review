import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(
    __dirname,
    '..',
    'data',
    'reviews.json'
);

async function ensureDataFile() {
    try {
        await fs.access(DATA_FILE);
    } catch {
        await fs.mkdir(path.dirname(DATA_FILE), {
            recursive: true
        });

        await fs.writeFile(
            DATA_FILE,
            '[]',
            'utf8'
        );
    }
}

export async function getReviews() {
    await ensureDataFile();

    const rawData = await fs.readFile(
        DATA_FILE,
        'utf8'
    );

    try {
        const reviews = JSON.parse(rawData);

        return Array.isArray(reviews)
            ? reviews
            : [];
    } catch {
        await fs.writeFile(
            DATA_FILE,
            '[]',
            'utf8'
        );

        return [];
    }
}

export async function saveReviews(reviews) {
    await fs.writeFile(
        DATA_FILE,
        JSON.stringify(reviews, null, 2),
        'utf8'
    );
}

export async function addReview(review) {
    const reviews = await getReviews();

    reviews.push(review);

    await saveReviews(reviews);

    return review;
}