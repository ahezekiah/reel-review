# Reel Reviews

Reel Reviews is a full-stack movie review application built with **Next.js, React, JavaScript, and Express**.

Users can:

* Browse recently added movie reviews
* View all saved reviews
* Write new movie reviews
* Give movies a rating from 1–5 stars
* Search reviews by movie title
* Search using partial titles
* Search without worrying about capitalization
* Persist reviews through an Express backend
* View reviewer names and review dates

The application uses a **Next.js frontend** and a separate **Express REST API**.

Reviews are currently stored in a local JSON file rather than a traditional database.

---

# Project Overview

The application follows a simple client/server architecture:

```text
User
 ↓
Next.js Frontend
 ↓
Express REST API
 ↓
reviews.json
```

The frontend handles:

* Page rendering
* Navigation
* Review forms
* Search
* Displaying reviews
* Validation feedback

The backend handles:

* Loading reviews
* Searching reviews
* Creating reviews
* Review validation
* Generating review IDs
* Writing reviews to disk

---

# Technology Stack

## Frontend

```text
Next.js 16.3.1
React 19.2.8
React DOM 19.2.8
JavaScript
CSS
Next.js App Router
```

## Backend

```text
Node.js
Express 5.1
JavaScript ES Modules
Node File System API
Node Crypto API
```

## Storage

```text
JSON File Storage
backend/data/reviews.json
```

## Development Tools

```text
npm
ESLint 9
eslint-config-next
Node --watch
```

---

# Application Architecture

```text
┌──────────────────────────────────────┐
│        Next.js Frontend              │
│                                      │
│  Home                                │
│  Add Review                          │
│  Search Reviews                      │
│  All Reviews                         │
└──────────────────┬───────────────────┘
                   │
                   │ HTTP
                   ▼
┌──────────────────────────────────────┐
│         Express Backend              │
│                                      │
│ GET  /api/reviews                    │
│ GET  /api/reviews/:id                │
│ POST /api/reviews                    │
└──────────────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│        reviews.json                  │
│                                      │
│ Persistent review storage            │
└──────────────────────────────────────┘
```

---

# Project Structure

The repository is divided into separate frontend and backend applications.

```text
reel-review-main/
│
├── frontend/
│   │
│   ├── app/
│   │   ├── add-review/
│   │   │   └── page.jsx
│   │   │
│   │   ├── reviews/
│   │   │   └── page.jsx
│   │   │
│   │   ├── search-reviews/
│   │   │   └── page.jsx
│   │   │
│   │   ├── globals.css
│   │   ├── layout.jsx
│   │   └── page.jsx
│   │
│   ├── components/
│   │   ├── AddReviewForm.jsx
│   │   ├── NavBar.jsx
│   │   ├── ReviewCard.jsx
│   │   ├── ReviewList.jsx
│   │   └── SearchReviews.jsx
│   │
│   ├── lib/
│   │   └── api.js
│   │
│   ├── eslint.config.mjs
│   ├── jsconfig.json
│   ├── next.config.mjs
│   ├── package.json
│   ├── package-lock.json
│   └── README.md
│
└── backend/
    │
    ├── data/
    │   └── reviews.json
    │
    ├── src/
    │   ├── reviewStore.js
    │   └── server.js
    │
    ├── package.json
    ├── package-lock.json
    └── .gitignore
```

---

# Frontend Routes

The application uses the **Next.js App Router**.

Current routes are:

```text
/
├── /add-review
├── /reviews
└── /search-reviews
```

---

# Home Page

The home page is:

```text
/
```

and is implemented in:

```text
frontend/app/page.jsx
```

The page contains the main hero:

```text
Your movie journal

Rate it. Review it. Find it later.
```

It provides buttons for:

```text
Write a Review
Search Reviews
```

The page also displays the three most recently added reviews.

---

# Loading Recent Reviews

The home page calls:

```js
reviews = await getReviews();
```

and then displays:

```js
reviews.slice(0, 3)
```

The backend sorts reviews by newest date first, so these represent the latest three reviews.

---

# Navigation

The reusable navigation component is:

```text
frontend/components/NavBar.jsx
```

The navigation contains:

```text
Reel Reviews
Home
Add Review
Search Reviews
All Reviews
```

Navigation uses:

```js
import Link from 'next/link';
```

so moving between pages uses Next.js navigation.

---

# All Reviews

All reviews are available at:

```text
/reviews
```

The page is implemented in:

```text
frontend/app/reviews/page.jsx
```

It retrieves all reviews through:

```js
getReviews();
```

and passes them to:

```jsx
<ReviewList reviews={reviews} />
```

---

# Successful Review Message

After a new review is submitted, the user is redirected to:

```text
/reviews?added=true
```

The reviews page checks:

```js
params?.added === 'true'
```

and displays:

```text
Your review was saved successfully.
```

---

# Add Review

New reviews are created at:

```text
/add-review
```

The page uses:

```text
frontend/components/AddReviewForm.jsx
```

---

# Review Form

The form contains:

```text
Movie Title
Reviewer Name
Rating
Review Text
```

The default rating is:

```text
5 - Excellent
```

Users can select:

```text
5 - Excellent
4 - Great
3 - Good
2 - Fair
1 - Poor
```

---

# Review Form State

The form begins with:

```js
const initialForm = {
    movieTitle: '',
    reviewerName: '',
    rating: '5',
    reviewText: ''
};
```

React state tracks all fields.

---

# Submitting a Review

When the form is submitted, the frontend sends:

```http
POST /api/reviews
```

to the Express API.

The request contains JSON such as:

```json
{
  "movieTitle": "Interstellar",
  "reviewerName": "Amanda",
  "rating": 5,
  "reviewText": "One of my favorite science-fiction movies."
}
```

---

# Review Submission Flow

```text
User completes form
       ↓
Submit Review
       ↓
POST /api/reviews
       ↓
Express validates request
       ↓
Generate UUID
       ↓
Add creation timestamp
       ↓
Read reviews.json
       ↓
Append new review
       ↓
Write reviews.json
       ↓
Return HTTP 201
       ↓
Redirect to /reviews?added=true
```

---

# Backend Validation

The backend validates several fields.

These fields are required:

```text
Movie Title
Reviewer Name
Review Text
```

If one is missing:

```json
{
  "error": "Movie title, reviewer name, and review are required."
}
```

The API returns:

```text
HTTP 400 Bad Request
```

---

# Rating Validation

The backend requires the rating to be:

```text
A whole number
between 1 and 5
```

The validation is:

```js
if (
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 5
)
```

Invalid ratings return:

```json
{
  "error": "Rating must be a whole number from 1 to 5."
}
```

---

# Review IDs

Each new review receives a unique identifier using Node's:

```js
randomUUID()
```

from:

```js
node:crypto
```

For example:

```text
4fa576cd-bc07-4380-a687-9d827bd563ba
```

---

# Review Creation Date

The server adds:

```js
createdAt: new Date().toISOString()
```

to every review.

Example:

```text
2026-08-14T12:20:27.053Z
```

---

# Review Object

A stored review has this structure:

```json
{
  "id": "unique-id",
  "movieTitle": "Avengers: Endgame",
  "rating": 5,
  "reviewText": "My review...",
  "reviewerName": "Marvel Fan",
  "createdAt": "2026-08-14T12:20:27.053Z"
}
```

---

# Review Cards

Reviews are displayed using:

```text
frontend/components/ReviewCard.jsx
```

Each card displays:

```text
Movie Title
Star Rating
Review Text
Reviewer Name
Date
```

---

# Star Rating Display

Ratings are converted into stars using:

```js
'★'.repeat(review.rating)
```

and empty stars using:

```js
'☆'.repeat(5 - review.rating)
```

For example:

```text
Rating 5

★★★★★
```

```text
Rating 3

★★★☆☆
```

---

# Review Date

The ISO date stored by the backend is formatted using:

```js
new Date(
    review.createdAt
).toLocaleDateString()
```

This provides a human-readable date based on the browser/server locale.

---

# Review List

The reusable review collection component is:

```text
frontend/components/ReviewList.jsx
```

It maps reviews into:

```jsx
<ReviewCard />
```

components.

If no reviews exist, it displays:

```text
No reviews found.
```

---

# Search Reviews

Review search is available at:

```text
/search-reviews
```

and implemented by:

```text
frontend/components/SearchReviews.jsx
```

---

# Search Behavior

Users search by entering all or part of a movie title.

For example:

```text
spider
```

can match:

```text
Spider-Man: Into the Spider-Verse
```

Likewise:

```text
hunger
```

can match:

```text
The Hunger Games
```

---

# Case-Insensitive Search

Search is case-insensitive.

The backend converts the search value to lowercase:

```js
const search = String(
    req.query.search || ''
)
    .trim()
    .toLowerCase();
```

It then checks:

```js
review.movieTitle
    .toLowerCase()
    .includes(search)
```

That means all of these work:

```text
SPIDER
Spider
spider
spi
```

---

# Partial Search

Because the backend uses:

```js
.includes(search)
```

users do not need to type an exact movie title.

For example:

```text
ave
```

can match:

```text
Avengers: Endgame
```

---

# Empty Search Validation

The frontend prevents blank searches.

If the user submits an empty search, it displays:

```text
Enter part of a movie title before searching.
```

---

# No Results

If a search succeeds but returns no matching reviews, the page displays a message similar to:

```text
No reviews matched “Batman”.
```

---

# Backend

The backend is a separate Express application.

Main file:

```text
backend/src/server.js
```

The backend uses:

```js
import express from 'express';
```

and runs on:

```text
http://localhost:4000
```

by default.

---

# Backend Port

The server uses:

```js
const PORT =
    process.env.PORT || 4000;
```

This means a custom port can be provided through:

```text
PORT
```

otherwise:

```text
4000
```

is used.

---

# API Root

The server provides:

```http
GET /
```

which returns:

```json
{
  "message": "Movie Review API is running."
}
```

This is useful for confirming that the backend is running.

---

# REST API

The current API contains:

```text
GET  /api/reviews
GET  /api/reviews/:id
POST /api/reviews
```

---

# Get All Reviews

```http
GET /api/reviews
```

Returns every review.

The backend sorts the reviews by:

```text
Newest → Oldest
```

using:

```js
results.sort(
    (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
);
```

---

# Search Reviews API

Search is performed using the same endpoint with a query parameter.

Example:

```http
GET /api/reviews?search=spider
```

Another example:

```http
GET /api/reviews?search=endgame
```

---

# Get One Review

The API supports retrieving an individual review:

```http
GET /api/reviews/:id
```

Example:

```http
GET /api/reviews/sample-review-1
```

If found, the review is returned.

If the review does not exist:

```json
{
  "error": "Review not found."
}
```

with:

```text
HTTP 404
```

---

# Create Review

```http
POST /api/reviews
```

The API validates the request, creates a UUID, adds the current date, and writes the review to storage.

A successful request returns:

```text
HTTP 201 Created
```

---

# Current CRUD Support

The current API supports:

```text
Create
Read
Search
```

It does not currently support:

```text
Update
Delete
```

There are no:

```text
PUT
PATCH
DELETE
```

review routes.

---

# JSON Storage

Review persistence is handled by:

```text
backend/src/reviewStore.js
```

The data file is:

```text
backend/data/reviews.json
```

---

# Reading Reviews

The backend loads reviews using Node's promise-based File System API:

```js
import {
    promises as fs
} from 'node:fs';
```

The main function is:

```js
getReviews()
```

---

# Automatic Data File Creation

If:

```text
reviews.json
```

does not exist, the backend automatically creates it.

The initial contents are:

```json
[]
```

This behavior is handled by:

```js
ensureDataFile()
```

---

# Invalid JSON Recovery

If the JSON data cannot be parsed, the current code resets the file to:

```json
[]
```

and returns an empty review list.

This prevents the API from crashing because of invalid JSON.

However, it can also mean corrupted review data is overwritten.

A production system should back up or report corrupted data instead of silently replacing it.

---

# Saving Reviews

When a new review is created:

```text
Read current reviews
        ↓
Push new review
        ↓
JSON.stringify(...)
        ↓
Write reviews.json
```

The file is formatted using:

```js
JSON.stringify(
    reviews,
    null,
    2
)
```

which keeps it human-readable.

---

# Sample Data

The repository currently contains several review records.

Examples include:

```text
Spider-Man: Into the Spider-Verse
The Hunger Games
Silence of the Lambs
Avengers: Endgame
```

The sample data demonstrates:

```text
Different ratings
Different reviewers
Different creation dates
```

---

# No Database Required

The application currently does **not** use:

```text
MongoDB
PostgreSQL
MySQL
SQLite
Prisma
Supabase
Firebase
```

Persistence is provided entirely by:

```text
backend/data/reviews.json
```

This makes the project easy to run locally without additional infrastructure.

---

# Important JSON Storage Limitation

JSON-file storage works well for:

```text
Assignments
Prototypes
Small local projects
Learning REST APIs
```

but it is not ideal for a production application.

Problems can include:

```text
Concurrent writes
Large files
No indexing
Limited querying
No transactions
Potential file corruption
Scaling difficulties
```

A future version should use a database if the application grows.

---

# CORS

The backend includes Cross-Origin Resource Sharing configuration.

The allowed frontend URL is:

```js
const FRONTEND_URL =
    process.env.FRONTEND_URL ||
    'http://localhost:3000';
```

The backend sends:

```text
Access-Control-Allow-Origin
Access-Control-Allow-Headers
Access-Control-Allow-Methods
```

Allowed methods are currently:

```text
GET
POST
OPTIONS
```

---

# Default URLs

Frontend:

```text
http://localhost:3000
```

Backend:

```text
http://localhost:4000
```

---

# Frontend API Configuration

API configuration is stored in:

```text
frontend/lib/api.js
```

The base URL is:

```js
export const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:4000';
```

This means the application works locally without an environment file if the backend is running on port 4000.

---

# Recommended Environment Variables

For the frontend, create:

```text
frontend/.env.local
```

with:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

For the backend, environment variables may include:

```env
PORT=4000
FRONTEND_URL=http://localhost:3000
```

---

# Server Components and Client Components

The project uses both Next.js server and client components.

For example:

```text
app/page.jsx
app/reviews/page.jsx
```

are server-rendered components.

They can call:

```js
getReviews()
```

directly during rendering.

---

# Client Components

Interactive components contain:

```js
'use client';
```

Examples include:

```text
AddReviewForm.jsx
SearchReviews.jsx
```

These components use React features such as:

```text
useState
useRouter
form events
browser fetch
```

---

# Next.js Data Fetching

The helper:

```js
getReviews()
```

uses:

```js
fetch(...)
```

with:

```js
cache: 'no-store'
```

This tells Next.js not to reuse cached review data.

As a result, reviews are retrieved fresh from the API whenever the page is rendered.

---

# Styling

The frontend uses:

```text
frontend/app/globals.css
```

for its styling.

There is no Tailwind CSS, Bootstrap, Material UI, or other component framework.

The design is completely custom CSS.

---

# Visual Design

The project uses a dark movie-journal aesthetic.

Main design variables include:

```css
--background: #0c0c13;
--surface: #171722;
--surface-light: #212132;
--text: #f7f4ff;
--muted: #b7b2c8;
--accent: #b98cff;
--accent-strong: #8f5ee8;
```

The interface uses:

```text
Dark backgrounds
Purple accent colors
Rounded review cards
Responsive grid layout
Sticky navigation
Gradient backgrounds
```

---

# Responsive Review Grid

Review cards use:

```css
grid-template-columns:
    repeat(
        auto-fit,
        minmax(280px, 1fr)
    );
```

This allows the review grid to automatically adapt to available screen width.

---

# Footer

The root layout includes:

```text
© Current Year Reel Reviews · Amanda Hezekiah
```

The year is generated dynamically with:

```js
new Date().getFullYear()
```

---

# Running the Project Locally

Because the frontend and backend are separate Node applications, you need to run both.

---

# Requirements

Install:

```text
Node.js
npm
Git
```

A current Node.js LTS version is recommended.

---

# Clone the Repository

```bash
git clone <YOUR-REPOSITORY-URL>
```

Enter the repository:

```bash
cd reel-review-main
```

If you downloaded a ZIP instead, extract it and open the extracted project directory.

---

# Install Backend Dependencies

Open a terminal:

```bash
cd backend
npm install
```

---

# Start the Backend

Run:

```bash
npm run dev
```

The development command uses:

```text
node --watch
```

so the backend restarts when source files change.

The backend should print:

```text
Movie Review API running at http://localhost:4000
```

---

# Backend Production Command

You can also run:

```bash
npm start
```

which executes:

```text
node src/server.js
```

---

# Test the Backend

Open:

```text
http://localhost:4000
```

You should receive:

```json
{
  "message": "Movie Review API is running."
}
```

Reviews are available at:

```text
http://localhost:4000/api/reviews
```

---

# Install Frontend Dependencies

Open a second terminal:

```bash
cd frontend
npm install
```

---

# Start the Frontend

Run:

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

---

# Recommended Development Setup

Use two terminals.

## Terminal 1

```bash
cd backend
npm install
npm run dev
```

## Terminal 2

```bash
cd frontend
npm install
npm run dev
```

Then open:

```text
http://localhost:3000
```

---

# Frontend Commands

Development:

```bash
npm run dev
```

Production build:

```bash
npm run build
```

Production server:

```bash
npm start
```

Lint:

```bash
npm run lint
```

---

# Backend Commands

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

---

# Building the Frontend

To create a production Next.js build:

```bash
cd frontend
npm run build
```

After the build succeeds:

```bash
npm start
```

The production frontend will run on port:

```text
3000
```

unless configured otherwise.

---

# How to Use Reel Reviews

## 1. Start Both Servers

Start:

```text
Express backend
+
Next.js frontend
```

---

## 2. Open Reel Reviews

Navigate to:

```text
http://localhost:3000
```

---

## 3. Browse Reviews

The home page displays the latest three reviews.

Select:

```text
View All
```

or:

```text
All Reviews
```

to browse the complete collection.

---

## 4. Write a Review

Select:

```text
Add Review
```

or:

```text
Write a Review
```

Enter:

```text
Movie Title
Your Name
Rating
Review
```

and click:

```text
Submit Review
```

---

## 5. Search Reviews

Open:

```text
Search Reviews
```

Enter part of a movie title.

For example:

```text
spider
```

and click:

```text
Search
```

Matching reviews will appear below the search form.

---

# Current Limitations

The current version does not include:

* User accounts
* Login
* Registration
* Authentication
* Authorization
* Movie API integration
* Movie posters
* Movie metadata
* User profiles
* Editing reviews
* Deleting reviews
* Likes
* Comments
* Favorites
* Review detail pages
* Database storage
* Pagination
* Sort controls
* Rating filters
* Reviewer search
* Automated tests
* Admin features

The project focuses on:

```text
Creating reviews
Displaying reviews
Searching reviews
Persisting reviews
```

---

# Important Backend Limitation

The API includes:

```http
GET /api/reviews/:id
```

but the frontend currently does not use that endpoint.

There is no dedicated route such as:

```text
/reviews/[id]
```

for displaying one review.

That would be a useful future feature.

---

# Recommended Future Improvements

Possible improvements include:

* Add MongoDB, PostgreSQL, or SQLite
* Add Prisma ORM
* Add review editing
* Add review deletion
* Add individual review pages
* Add movie posters
* Integrate TMDB
* Add movie search
* Add user registration
* Add login
* Add JWT or session authentication
* Associate reviews with users
* Add likes
* Add comments
* Add favorites/watchlist
* Add rating filters
* Add reviewer search
* Add pagination
* Add sorting options
* Add confirmation before deletion
* Add loading skeletons
* Add automated tests
* Add API tests
* Add form length limits
* Add rate limiting
* Add centralized environment configuration
* Add production deployment configuration

---

# Recommended Database Upgrade

A future architecture could look like:

```text
Next.js
   ↓
Express API
   ↓
Prisma
   ↓
PostgreSQL
```

A review table could contain:

```text
id
movieTitle
reviewerName
rating
reviewText
createdAt
updatedAt
```

This would provide more reliable persistence than JSON files.

---

# API Documentation

## `GET /`

### Description

Checks whether the API is running.

### Response

```json
{
  "message": "Movie Review API is running."
}
```

---

## `GET /api/reviews`

### Description

Returns all reviews sorted newest first.

### Example

```http
GET http://localhost:4000/api/reviews
```

---

## `GET /api/reviews?search=spider`

### Description

Searches reviews by movie title.

Search is:

```text
Case-insensitive
Partial-match enabled
```

---

## `GET /api/reviews/:id`

### Description

Returns a specific review by ID.

### Not Found

```json
{
  "error": "Review not found."
}
```

---

## `POST /api/reviews`

### Description

Creates a new movie review.

### Request

```json
{
  "movieTitle": "The Dark Knight",
  "reviewerName": "Movie Fan",
  "rating": 5,
  "reviewText": "One of the strongest superhero movies ever made."
}
```

### Success

```text
HTTP 201 Created
```

### Validation Error

```text
HTTP 400 Bad Request
```

---

# Educational Concepts Demonstrated

Reel Reviews demonstrates:

```text
Next.js
React
Next.js App Router
Server Components
Client Components
React State
React Forms
Next Navigation
Express
REST APIs
HTTP GET Requests
HTTP POST Requests
HTTP Status Codes
CORS
JSON
Node File System
Async / Await
Fetch API
UUID Generation
Input Validation
Search Filtering
Array Sorting
Component Reuse
Responsive CSS Grid
Environment Variables
Full-Stack Development
Client / Server Architecture
```

---

# Data Flow

Reading reviews:

```text
Page Request
    ↓
Next.js
    ↓
getReviews()
    ↓
GET /api/reviews
    ↓
Express
    ↓
reviewStore.getReviews()
    ↓
reviews.json
    ↓
JSON Response
    ↓
ReviewList
    ↓
ReviewCard
```

Creating a review:

```text
AddReviewForm
      ↓
POST /api/reviews
      ↓
Express Validation
      ↓
UUID + Timestamp
      ↓
addReview()
      ↓
reviews.json
      ↓
HTTP 201
      ↓
/reviews?added=true
```

Searching:

```text
Search Form
     ↓
Search Query
     ↓
GET /api/reviews?search=...
     ↓
Express
     ↓
Lowercase Movie Titles
     ↓
.includes(search)
     ↓
Matching Reviews
```

---

# Quick Start

Start the backend:

```bash
cd backend
npm install
npm run dev
```

Then start the frontend in another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

Backend:

```text
http://localhost:4000
```

---

# Summary

**Reel Reviews** is a full-stack movie review application built with:

```text
Next.js 16
React 19
JavaScript
Express 5
JSON file persistence
Custom CSS
```

The primary application flow is:

```text
Browse Reviews
      ↓
Write Review
      ↓
Submit to Express API
      ↓
Validate Review
      ↓
Store in reviews.json
      ↓
Display Review
```

Users can also:

```text
Search by movie title
View all reviews
See star ratings
See reviewer names
See review dates
```

The current project does not require a traditional database.

Reviews persist in:

```text
backend/data/reviews.json
```

To run the application:

```text
Terminal 1
backend → npm run dev

Terminal 2
frontend → npm run dev
```

Then visit:

```text
http://localhost:3000
```
