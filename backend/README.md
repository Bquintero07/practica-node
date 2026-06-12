# 📘 API Documentation — Ticket Management System

**Base URL:** `http://localhost:3000/api`  
**Version:** `1.0.0`  
**Runtime:** Node.js + Express 5 + Prisma + PostgreSQL

---

## 📑 Table of Contents

- [Authentication](#-authentication)
- [Tickets](#-tickets)
- [Comments](#-comments)
- [Data Models](#-data-models)
- [Enums](#-enums)
- [Error Handling](#-error-handling)
- [Authorization](#-authorization)
- [Setup & Scripts](#-setup--scripts)

---

## 🔐 Authentication

All protected routes require a JWT token in the `Authorization` header:

```
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

| Field      | Type     | Required | Description                                         |
|------------|----------|----------|-----------------------------------------------------|
| `name`     | `string` | ✅ Yes   | Full name of the user                               |
| `email`    | `string` | ✅ Yes   | Unique email address                                |
| `password` | `string` | ✅ Yes   | Plain text password (hashed with bcrypt internally) |

#### Response `201 Created`

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "email": "john@example.com"
}
```

#### Error Responses

| Status | Description            | Body                                  |
|--------|------------------------|---------------------------------------|
| `400`  | Email already in use   | `{ "error": "Email ya registrado" }` |

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

| Field      | Type     | Required | Description      |
|------------|----------|----------|------------------|
| `email`    | `string` | ✅ Yes   | Registered email |
| `password` | `string` | ✅ Yes   | User's password  |

#### Response `200 OK`

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Error Responses

| Status | Description    | Body                                       |
|--------|----------------|--------------------------------------------|
| `401`  | User not found | `{ "error": "Usuario no encontrado" }`    |
| `401`  | Wrong password | `{ "error": "Contraseña incorrecta" }`    |

---

## 🎫 Tickets

All ticket endpoints require authentication.

---

### `GET /api/tickets`

Returns all tickets belonging to the authenticated user, ordered by creation date (descending).

**Authentication required:** ✅ Yes

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

#### Path Parameters

| Parameter | Type     | Description        |
|-----------|----------|--------------------|
| `id`      | `string` | UUID of the ticket |

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

#### Request Body

```json
{
  "title": "Server is down",
  "description": "Production server is not responding",
  "status": "ABIERTO",
  "priority": "ALTA"
}
```

| Field         | Type     | Required | Default   | Description                           |
|---------------|----------|----------|-----------|---------------------------------------|
| `title`       | `string` | ✅ Yes   | —         | Short title for the ticket            |
| `description` | `string` | ✅ Yes   | —         | Detailed description of the issue     |
| `status`      | `string` | ❌ No    | `ABIERTO` | Ticket status. See [Enums](#-enums)   |
| `priority`    | `string` | ❌ No    | `MEDIA`   | Ticket priority. See [Enums](#-enums) |

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

#### Path Parameters

| Parameter | Type     | Description        |
|-----------|----------|--------------------|
| `id`      | `string` | UUID of the ticket |

#### Request Body

```json
{
  "title": "Updated title",
  "status": "EN_PROCESO",
  "priority": "BAJA"
}
```

> All fields are optional. Only provided fields will be updated.

| Field         | Type     | Description                          |
|---------------|----------|--------------------------------------|
| `title`       | `string` | New title                            |
| `description` | `string` | New description                      |
| `status`      | `string` | New status. See [Enums](#-enums)     |
| `priority`    | `string` | New priority. See [Enums](#-enums)   |

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

#### Path Parameters