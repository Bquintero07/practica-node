# 📘 API Documentation — Ticket Management System

**Base URL:** `http://localhost:3000/api`  
**Version:** `1.0.0`  
**Runtime:** Node.js + Express 5 + Prisma + PostgreSQL

---

## 📑 Table of Contents

- [Project Setup](#-project-setup)
- [Available Scripts](#-available-scripts)
- [Authentication](#-authentication)
- [Tickets](#-tickets)
- [Comments](#-comments)
- [Data Models](#-data-models)
- [Enums](#-enums)
- [Error Handling](#-error-handling)
- [Authorization](#-authorization)

---

## ⚙️ Project Setup

### Prerequisites

Make sure you have installed:

- Node.js
- pnpm
- PostgreSQL database, for example Supabase

---

### 1. Install dependencies

From the backend project folder, run:

```bash
pnpm install
```

---

### 2. Configure environment variables

Create a `.env` file in the project root using `.env.example` as reference:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"
DIRECT_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"
JWT_SECRET="your_secret_key"
PORT=3000
```

For Supabase, use the pooler URL for `DATABASE_URL` and the direct connection URL for `DIRECT_URL`:

```env
DATABASE_URL="postgresql://postgres.PROJECT_REF:PASSWORD@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require"
DIRECT_URL="postgresql://postgres:PASSWORD@db.PROJECT_REF.supabase.co:5432/postgres?sslmode=require"
JWT_SECRET="your_secret_key"
PORT=3000
```

---

### 3. Generate Prisma client

```bash
pnpm run db:generate
```

---

### 4. Run database migrations

```bash
pnpm run db:migrate
```

---

### 5. Start development server

```bash
pnpm run dev
```

The API will be available at:

```text
http://localhost:3000/api
```

---

### Production start

```bash
pnpm run start
```

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `pnpm run dev` | Starts the server in development mode with nodemon |
| `pnpm run start` | Starts the server with Node.js |
| `pnpm run db:migrate` | Runs Prisma migrations in development |
| `pnpm run db:generate` | Generates Prisma client |
| `pnpm run db:deploy` | Applies migrations in production |
| `pnpm run db:studio` | Opens Prisma Studio |

---

## 🔐 Authentication

All protected routes require a JWT token in the `Authorization` header:

```http
Authorization: Bearer <token>
```

The token is obtained via `/api/auth/login` and expires in **8 hours**.

---

### `POST /api/auth/register`

Registers a new user in the system.

**Authentication required:** ❌ No

#### Request Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | `string` | ✅ Yes | Full name of the user |
| `email` | `string` | ✅ Yes | Unique email address |
| `password` | `string` | ✅ Yes | Plain text password, hashed with bcrypt internally |

#### Response `201 Created`

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "email": "john@example.com"
}
```

#### Error Responses

| Status | Description | Body |
|---|---|---|
| `400` | Email already in use | `{ "error": "Email ya registrado" }` |

---

### `POST /api/auth/login`

Authenticates a user and returns a JWT token.

**Authentication required:** ❌ No

#### Request Body

```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `email` | `string` | ✅ Yes | Registered email |
| `password` | `string` | ✅ Yes | User's password |

#### Response `200 OK`

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Error Responses

| Status | Description | Body |
|---|---|---|
| `401` | User not found | `{ "error": "Usuario no encontrado" }` |
| `401` | Wrong password | `{ "error": "Contraseña incorrecta" }` |

---

## 🎫 Tickets

All ticket endpoints require authentication.

---

### `GET /api/tickets`

Returns all tickets belonging to the authenticated user, ordered by creation date descending.

**Authentication required:** ✅ Yes

#### Headers

```http
Authorization: Bearer <token>
```

#### Response `200 OK`

```json
[
  {
    "id": "uuid",
    "title": "Server is down",
    "description": "Production server is not responding",
    "status": "ABIERTO",
    "priority": "ALTA",
    "userId": "uuid",
    "createdAt": "2026-06-11T23:36:11.000Z",
    "updatedAt": "2026-06-11T23:36:11.000Z",
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
]
```

---

### `GET /api/tickets/:id`

Returns a single ticket by its ID, including its comments and user.

**Authentication required:** ✅ Yes

#### Headers

```http
Authorization: Bearer <token>
```

#### Path Parameters

| Parameter | Type | Description |
|---|---|---|
| `id` | `string` | UUID of the ticket |

#### Response `200 OK`

```json
{
  "id": "uuid",
  "title": "Server is down",
  "description": "Production server is not responding",
  "status": "ABIERTO",
  "priority": "ALTA",
  "userId": "uuid",
  "createdAt": "2026-06-11T23:36:11.000Z",
  "updatedAt": "2026-06-11T23:36:11.000Z",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "comments": [
    {
      "id": "uuid",
      "content": "Working on it",
      "ticketId": "uuid",
      "userId": "uuid",
      "createdAt": "2026-06-11T23:40:00.000Z"
    }
  ]
}
```

---

### `POST /api/tickets`

Creates a new ticket for the authenticated user.

**Authentication required:** ✅ Yes

#### Headers

```http
Authorization: Bearer <token>
```

#### Request Body

```json
{
  "title": "Server is down",
  "description": "Production server is not responding",
  "status": "ABIERTO",
  "priority": "ALTA"
}
```

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `title` | `string` | ✅ Yes | — | Short title for the ticket |
| `description` | `string` | ✅ Yes | — | Detailed description of the issue |
| `status` | `string` | ❌ No | `ABIERTO` | Ticket status. See [Enums](#-enums) |
| `priority` | `string` | ❌ No | `MEDIA` | Ticket priority. See [Enums](#-enums) |

#### Response `201 Created`

```json
{
  "id": "uuid",
  "title": "Server is down",
  "description": "Production server is not responding",
  "status": "ABIERTO",
  "priority": "ALTA",
  "userId": "uuid",
  "createdAt": "2026-06-11T23:36:11.000Z",
  "updatedAt": "2026-06-11T23:36:11.000Z"
}
```

---

### `PUT /api/tickets/:id`

Updates an existing ticket by its ID.

**Authentication required:** ✅ Yes

#### Headers

```http
Authorization: Bearer <token>
```

#### Path Parameters

| Parameter | Type | Description |
|---|---|---|
| `id` | `string` | UUID of the ticket |

#### Request Body

```json
{
  "title": "Updated title",
  "status": "EN_PROCESO",
  "priority": "BAJA"
}
```

> All fields are optional. Only provided fields will be updated.

| Field | Type | Description |
|---|---|---|
| `title` | `string` | New title |
| `description` | `string` | New description |
| `status` | `string` | New status. See [Enums](#-enums) |
| `priority` | `string` | New priority. See [Enums](#-enums) |

#### Response `200 OK`

```json
{
  "id": "uuid",
  "title": "Updated title",
  "description": "Production server is not responding",
  "status": "EN_PROCESO",
  "priority": "BAJA",
  "userId": "uuid",
  "createdAt": "2026-06-11T23:36:11.000Z",
  "updatedAt": "2026-06-11T23:50:00.000Z"
}
```

---

### `DELETE /api/tickets/:id`

Deletes a ticket by its ID.

**Authentication required:** ✅ Yes

#### Headers

```http
Authorization: Bearer <token>
```

#### Path Parameters

| Parameter | Type | Description |
|---|---|---|
| `id` | `string` | UUID of the ticket |

#### Response `204 No Content`

No response body.

---

## 💬 Comments

All comment endpoints require authentication.

---

### `GET /api/tickets/:id/comments`

Returns all comments for a ticket.

**Authentication required:** ✅ Yes

#### Headers

```http
Authorization: Bearer <token>
```

#### Path Parameters

| Parameter | Type | Description |
|---|---|---|
| `id` | `string` | UUID of the ticket |

#### Response `200 OK`

```json
[
  {
    "id": "uuid",
    "content": "Working on it",
    "ticketId": "uuid",
    "userId": "uuid",
    "createdAt": "2026-06-11T23:40:00.000Z",
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
]
```

---

### `POST /api/tickets/:id/comments`

Creates a comment for a ticket.

**Authentication required:** ✅ Yes

#### Headers

```http
Authorization: Bearer <token>
```

#### Path Parameters

| Parameter | Type | Description |
|---|---|---|
| `id` | `string` | UUID of the ticket |

#### Request Body

```json
{
  "content": "Working on it"
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `content` | `string` | ✅ Yes | Comment content |

#### Response `201 Created`

```json
{
  "id": "uuid",
  "content": "Working on it",
  "ticketId": "uuid",
  "userId": "uuid",
  "createdAt": "2026-06-11T23:40:00.000Z",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

---

## 🧩 Data Models

### User

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique user ID |
| `name` | `string` | User full name |
| `email` | `string` | Unique user email |
| `password` | `string` | Hashed password |
| `role` | `string` | User role |
| `createdAt` | `DateTime` | Creation date |

### Ticket

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique ticket ID |
| `title` | `string` | Ticket title |
| `description` | `string` | Ticket description |
| `status` | `Status` | Ticket status |
| `priority` | `Priority` | Ticket priority |
| `userId` | `string` | Owner user ID |
| `createdAt` | `DateTime` | Creation date |
| `updatedAt` | `DateTime` | Last update date |

### Comment

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique comment ID |
| `content` | `string` | Comment content |
| `ticketId` | `string` | Related ticket ID |
| `userId` | `string` | Author user ID |
| `createdAt` | `DateTime` | Creation date |

---

## 🏷️ Enums

### Status

| Value | Description |
|---|---|
| `ABIERTO` | Ticket is open |
| `EN_PROCESO` | Ticket is in progress |
| `CERRADO` | Ticket is closed |

### Priority

| Value | Description |
|---|---|
| `BAJA` | Low priority |
| `MEDIA` | Medium priority |
| `ALTA` | High priority |

---

## ⚠️ Error Handling

Common error response format:

```json
{
  "error": "Error message"
}
```

| Status | Description |
|---|---|
| `400` | Bad request or validation error |
| `401` | Authentication error |
| `404` | Resource not found |
| `500` | Internal server error |

---

## 🔒 Authorization

Protected endpoints require a valid JWT token in the request header:

```http
Authorization: Bearer <token>
```

Use the token returned by:

```http
POST /api/auth/login
```