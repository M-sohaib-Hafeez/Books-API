# 📚 Books API

A RESTful **Book Inventory API** built with **Node.js**, **Express 5**, **Prisma ORM**, and **MySQL**. It provides full CRUD operations for managing a collection of books, including availability tracking and unique ISBN enforcement.

![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.x-000000?logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-5.x-2D3748?logo=prisma&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.x-4479A1?logo=mysql&logoColor=white)
![License](https://img.shields.io/badge/License-ISC-blue)

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Database Schema](#-database-schema)
- [API Reference](#-api-reference)
- [Testing the API](#-testing-the-api)
- [Error Handling](#-error-handling)
- [Known Limitations & Roadmap](#-known-limitations--roadmap)
- [Author](#-author)

---

## ✨ Features

- Full **CRUD** for books (Create, Read, Update, Delete)
- **Availability tracking** with an `isAvailable` flag (defaults to `true`)
- **Unique ISBN** constraint at the database level
- Clean, layered architecture: **routes → controllers → Prisma client**
- **Prisma migrations** for reproducible database setup
- **CORS** enabled for frontend integration
- Centralized **404** and **500** error handlers
- Ready-to-use **`requests.http`** file for quick manual testing

---

## 🛠 Tech Stack

| Layer          | Technology                 |
| -------------- | -------------------------- |
| Runtime        | Node.js (ES Modules)       |
| Framework      | Express `^5.3.0`           |
| ORM            | Prisma `^5.22.0`           |
| Database       | MySQL                      |
| Config         | dotenv                     |
| Middleware     | cors, express.json         |
| Dev tooling    | Prisma CLI, tsx            |

---

## 📁 Project Structure

```
Books-API/
├── prisma/
│   ├── migrations/
│   │   ├── 20261108221022_init/
│   │   │   └── migration.sql      # Initial Book table
│   │   └── migration_lock.toml
│   └── schema.prisma              # Data model & datasource
├── src/
│   ├── config/
│   │   └── db.js                  # Shared PrismaClient instance
│   ├── controllers/
│   │   └── bookController.js      # Business logic for each endpoint
│   ├── routes/
│   │   └── bookRoutes.js          # Route definitions for /api/books
│   └── app.js                     # Express app, middleware, error handlers
├── server.js                      # Entry point (loads env, starts server)
├── requests.http                  # Sample requests (VS Code REST Client)
├── .env.example                   # Environment variable template
├── package.json
└── .gitignore
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- [MySQL](https://dev.mysql.com/downloads/) server running locally (or a remote MySQL instance)
- npm (bundled with Node.js)

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/M-sohaib-Hafeez/Books-API.git
cd Books-API
```

**2. Install dependencies**

```bash
npm install
```

**3. Configure environment variables**

```bash
cp .env.example .env
```

Then open `.env` and fill in your own MySQL credentials (see [Environment Variables](#-environment-variables)).

**4. Create the database**

Make sure the database named in your `DATABASE_URL` exists, for example:

```sql
CREATE DATABASE book_inventory;
```

**5. Run the migrations and generate the Prisma client**

```bash
npx prisma migrate deploy
npx prisma generate
```

> 💡 During development you can use `npx prisma migrate dev` instead, which also applies pending migrations and regenerates the client.

**6. Start the server**

```bash
node server.js
```

You should see:

```
Server is running on port http://localhost:3000
API available at http://localhost:3000/api/books
```

---

## 🔐 Environment Variables

Create a `.env` file in the project root:

| Variable       | Required | Description                                         | Example                                              |
| -------------- | -------- | --------------------------------------------------- | ---------------------------------------------------- |
| `PORT`         | No       | Port the server listens on (defaults to `3000`)     | `3000`                                               |
| `DATABASE_URL` | **Yes**  | MySQL connection string used by Prisma              | `mysql://user:yourpassword@localhost:3306/book_inventory` |

Connection string format:

```
mysql://USER:PASSWORD@HOST:PORT/DATABASE
```

> ⚠️ Never commit your real `.env` file. It is already listed in `.gitignore`.

---

## 🗄 Database Schema

Defined in [`prisma/schema.prisma`](prisma/schema.prisma):

```prisma
model Book {
  id          Int      @id @default(autoincrement())
  title       String
  author      String
  isbn        String   @unique
  isAvailable Boolean  @default(true)
  createdAt   DateTime @default(now())
}
```

| Field         | Type       | Constraints                | Description                          |
| ------------- | ---------- | -------------------------- | ------------------------------------ |
| `id`          | `Int`      | Primary key, auto-increment | Unique book identifier              |
| `title`       | `String`   | Required                   | Title of the book                    |
| `author`      | `String`   | Required                   | Author's name                        |
| `isbn`        | `String`   | Required, **unique**       | International Standard Book Number   |
| `isAvailable` | `Boolean`  | Default `true`             | Whether the book is currently available |
| `createdAt`   | `DateTime` | Default `now()`            | Record creation timestamp            |

---

## 📡 API Reference

**Base URL:** `http://localhost:3000`

| Method   | Endpoint           | Description              |
| -------- | ------------------ | ------------------------ |
| `GET`    | `/`                | Welcome message          |
| `POST`   | `/api/books`       | Create a new book        |
| `GET`    | `/api/books`       | Get all books            |
| `GET`    | `/api/books/:id`   | Get a single book by ID  |
| `PUT`    | `/api/books/:id`   | Update a book            |
| `DELETE` | `/api/books/:id`   | Delete a book            |

---

### `GET /`

Health/welcome check.

**Response `200 OK`**

```json
{
  "message": "Welcome to the Book Store API"
}
```

---

### `POST /api/books`

Create a new book.

**Request body**

| Field    | Type   | Required | Notes                    |
| -------- | ------ | -------- | ------------------------ |
| `title`  | string | Yes      |                          |
| `author` | string | Yes      |                          |
| `isbn`   | string | Yes      | Must be unique           |

```json
{
  "title": "The Pragmatic Programmer",
  "author": "Andy Hunt",
  "isbn": "978-0201616224"
}
```

**Response `201 Created`**

```json
{
  "id": 1,
  "title": "The Pragmatic Programmer",
  "author": "Andy Hunt",
  "isbn": "978-0201616224",
  "isAvailable": true,
  "createdAt": "2026-11-09T10:15:30.123Z"
}
```

**Error `500`** — missing required fields or duplicate ISBN:

```json
{
  "error": "Failed to create Book",
  "detail": "<error message>"
}
```

---

### `GET /api/books`

Retrieve all books.

**Response `200 OK`**

```json
[
  {
    "id": 1,
    "title": "The Pragmatic Programmer",
    "author": "Andy Hunt",
    "isbn": "978-0201616224",
    "isAvailable": true,
    "createdAt": "2026-11-09T10:15:30.123Z"
  }
]
```

---

### `GET /api/books/:id`

Retrieve a single book by its numeric ID.

**Response `200 OK`** — the book object.

**Response `404 Not Found`**

```json
{
  "error": "Book not found"
}
```

---

### `PUT /api/books/:id`

Update a book. Send only the fields you want to change — omitted fields are left untouched.

**Request body (all optional)**

| Field         | Type    |
| ------------- | ------- |
| `title`       | string  |
| `author`      | string  |
| `isbn`        | string  |
| `isAvailable` | boolean |

```json
{
  "isAvailable": false
}
```

**Response `200 OK`** — the updated book object.

**Error `500`**

```json
{
  "error": "Failed to update Book",
  "detail": "<error message>"
}
```

---

### `DELETE /api/books/:id`

Delete a book by ID.

**Response `200 OK`** — returns the deleted book object.

**Error `500`**

```json
{
  "error": "Failed to Delete Book",
  "detail": "<error message>"
}
```

---

## 🧪 Testing the API

### Option 1: VS Code REST Client

Install the [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) extension, open [`requests.http`](requests.http), and click **Send Request** above any request.

### Option 2: cURL

```bash
# Create a book
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{"title":"The Pragmatic Programmer","author":"Andy Hunt","isbn":"978-0201616224"}'

# Get all books
curl http://localhost:3000/api/books

# Get one book
curl http://localhost:3000/api/books/1

# Mark a book as unavailable
curl -X PUT http://localhost:3000/api/books/1 \
  -H "Content-Type: application/json" \
  -d '{"isAvailable":false}'

# Delete a book
curl -X DELETE http://localhost:3000/api/books/1
```

### Option 3: Postman / Insomnia

Import the endpoints from the [API Reference](#-api-reference) above, using `http://localhost:3000` as the base URL.

### Inspecting the database

```bash
npx prisma studio
```

Opens a browser-based GUI to view and edit your data.

---

## ⚠️ Error Handling

| Status | Where                | Meaning                                        |
| ------ | -------------------- | ---------------------------------------------- |
| `201`  | Controllers          | Resource created                               |
| `200`  | Controllers          | Request succeeded                              |
| `404`  | `getBookById`, app   | Book not found / unknown route (`{"error":"Route not found"}`) |
| `500`  | Controllers, app     | Database or unexpected error                   |

Controller-level errors include a `detail` field with the underlying error message. Unhandled errors are caught by a global handler that responds with `{"error": "Something went wrong!"}`.

---

## 🔧 Known Limitations & Roadmap

This project is a clean foundation, and these are natural next steps:

- [ ] **Input validation** — validate required fields and types (e.g., with Zod or Joi) and return `400` instead of `500`
- [ ] **Better status codes** — return `409 Conflict` for duplicate ISBNs and `404` when updating/deleting a non-existent book
- [ ] **Fix `DELETE` response** — the controller currently calls both `res.json()` and `res.status(204).send()`, so only one should be kept (either `200` with the body, or `204` with no body)
- [ ] **Pagination, search & filtering** — e.g. `GET /api/books?author=...&available=true&page=1`
- [ ] **`npm start` / `npm run dev` scripts** — add scripts to `package.json` (e.g., using `node --watch server.js`)
- [ ] **Authentication** — protect write endpoints with JWT
- [ ] **Automated tests** — Jest/Vitest + Supertest
- [ ] **Docker support** — `Dockerfile` + `docker-compose.yml` with MySQL
- [ ] **API documentation** — Swagger / OpenAPI

---

## 👤 Author

**Muhammad Sohaib Hafeez**

- GitHub: [@M-sohaib-Hafeez](https://github.com/M-sohaib-Hafeez)

---

## 📄 License

This project is licensed under the **ISC License**.

---

⭐ If you found this project helpful, consider giving it a star!
