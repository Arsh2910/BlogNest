# BlogNest API

A RESTful blog platform API built with Node.js, Express, and MongoDB.

## Features

- JWT-based authentication with role system (user / admin)
- Full CRUD for blog posts with slugified URLs
- Tag management (admin only)
- Nested comments on posts
- Cover image upload via ImageKit
- Full-text search on posts
- Zod input validation
- Centralized error handling

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express
- **Database:** MongoDB + Mongoose
- **Auth:** JWT + bcrypt
- **Validation:** Zod
- **File Upload:** Multer + ImageKit
- **Slugs:** slugify

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/blognest.git
cd blognest
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
```

### 4. Start the server

```bash
node server.js
```

Server runs on `http://localhost:3000`

---

## API Reference

### Auth

| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | `/api/auth/register` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Login |
| POST | `/api/auth/logout` | Public | Logout |

### Tags

| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | `/api/tags` | Admin | Create a tag |
| GET | `/api/tags` | Public | Get all tags |
| DELETE | `/api/tags/:id` | Admin | Delete a tag |

### Posts

| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | `/api/posts` | Admin | Create a post |
| GET | `/api/posts` | User | Get all posts (paginated) |
| GET | `/api/posts/search?q=` | User | Search posts |
| GET | `/api/posts/:slug` | User | Get post by slug |
| PATCH | `/api/posts/:slug` | Admin | Update a post |
| DELETE | `/api/posts/:slug` | Admin | Delete a post |
| POST | `/api/posts/:postId/cover` | Admin | Upload cover image |

### Comments

| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | `/api/posts/:postId/comments` | User | Add a comment |
| GET | `/api/posts/:postId/comments` | User | Get comments on a post |
| DELETE | `/api/posts/:postId/comments/:commentId` | User/Admin | Delete a comment |

---

## Project Structure

```
src/
├── controllers/
│   ├── auth.controller.js
│   ├── post.controller.js
│   ├── comment.controller.js
│   ├── cover.controller.js
│   └── tag.controller.js
├── middleware/
│   ├── auth.middleware.js
│   ├── error.middleware.js
│   └── validate.middleware.js
├── model/
│   ├── user.model.js
│   ├── post.model.js
│   ├── comment.model.js
│   └── tag.model.js
├── routes/
│   ├── auth.routes.js
│   ├── post.routes.js
│   └── tag.routes.js
├── services/
│   └── storage.service.js
├── validators/
│   ├── auth.validators.js
│   ├── post.validator.js
│   └── tag.validator.js
├── utils/
│   └── AppError.js
├── db/
│   └── db.js
└── app.js
server.js
```

## Notes

- Only admins can create, update, and delete posts
- Draft posts are only visible to admins
- Comments can be deleted by the comment author or an admin
- Cover images are stored on ImageKit under `blognest/covers/`

