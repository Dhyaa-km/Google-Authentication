# Google OAuth Authentication

A full-stack authentication project built to understand and implement **Google OAuth 2.0**, **Passport.js**, **JWT authentication**, **HTTP-only cookies**, and protected API routes.

The project uses a **React + TypeScript** frontend and a **Node.js + Express + MongoDB** backend. Authentication is handled by the backend, while the frontend communicates with it through a REST API.

## 🚀 Live Demo

* **Frontend:** https://google-authentication-gilt.vercel.app
* **Backend:** https://google-authentication-ru47.onrender.com

## ✨ Features

* Google OAuth 2.0 authentication
* Google account email verification
* Automatic user creation on first Google login
* Automatic linking of existing accounts by email
* Protection against conflicting Google accounts
* JWT-based authentication
* JWT stored in an HTTP-only cookie
* Protected `/users/me` endpoint
* Logout functionality
* React authentication context
* Protected frontend routes
* CORS configuration
* MongoDB persistence with Mongoose
* Production deployment with Vercel and Render
* Environment-based configuration
* TypeScript throughout the project

## 🛠️ Tech Stack

### Frontend

* React
* TypeScript
* Vite
* React Router
* Axios
* Tailwind CSS

### Backend

* Node.js
* Express
* TypeScript
* Passport.js
* Passport Google OAuth 2.0
* JSON Web Token (JWT)
* Mongoose
* MongoDB
* Cookie Parser
* CORS
* Dotenv

### Deployment

* **Frontend:** Vercel
* **Backend:** Render
* **Database:** MongoDB Atlas

## 🔐 Authentication Flow

The authentication flow is handled entirely by the backend.

```text
┌──────────────┐
│   Frontend   │
│   React/Vite │
└──────┬───────┘
       │
       │ 1. Login with Google
       ▼
┌─────────────────────┐
│      Backend        │
│ Node + Express      │
│ Passport.js         │
└─────────┬───────────┘
          │
          │ 2. Redirect to Google
          ▼
┌─────────────────────┐
│       Google        │
│     OAuth 2.0       │
└─────────┬───────────┘
          │
          │ 3. User authorizes
          ▼
┌─────────────────────┐
│      Callback       │
│ /auth/google/       │
│ callback            │
└─────────┬───────────┘
          │
          │ 4. Find/create user
          ▼
┌─────────────────────┐
│      MongoDB        │
│       User          │
└─────────┬───────────┘
          │
          │ 5. Create JWT
          ▼
┌─────────────────────┐
│  HTTP-only Cookie   │
│       token         │
└─────────┬───────────┘
          │
          │ 6. Redirect to dashboard
          ▼
┌─────────────────────┐
│      Frontend       │
│     Dashboard       │
└─────────┬───────────┘
          │
          │ 7. GET /users/me
          ▼
┌─────────────────────┐
│ Authentication      │
│ Middleware          │
└─────────────────────┘
```

### Authentication Process

1. The user clicks **Login with Google**.
2. The frontend navigates to `/auth/google`.
3. Passport redirects the user to Google's OAuth authorization page.
4. Google redirects the user back to `/auth/google/callback`.
5. Passport provides the Google profile to the backend.
6. The backend verifies that the Google email exists and is verified.
7. The backend finds the existing user or creates a new user.
8. A JWT containing the user's ID is generated.
9. The JWT is stored in an **HTTP-only cookie**.
10. The backend redirects the user to the frontend dashboard.
11. The frontend calls `/users/me`.
12. The authentication middleware reads and verifies the JWT cookie.
13. The authenticated user's public information is returned.

## 👤 User Account Linking

The backend supports linking an existing user account to Google.

```text
                Google Login
                     │
                     ▼
              Google Email
                     │
          ┌──────────┴──────────┐
          │                     │
     User exists?          User doesn't exist
          │                     │
         YES                   NO
          │                     │
          ▼                     ▼
   Has googleId?          Create new user
      │       │
     YES      NO
      │        │
      │        ▼
      │   Link Google ID
      │        │
      └────────┘
           │
           ▼
       Create JWT
```

When a Google user authenticates:

* If the user does not exist, a new account is created.
* If the email exists but has no `googleId`, the Google account is linked.
* If the existing `googleId` matches, the user is authenticated.
* If the email is linked to a different Google account, the request is rejected.

This prevents duplicate accounts and account conflicts.

## 📁 Project Structure

```text
OAuth/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── config.ts
│   │   │   ├── db.ts
│   │   │   └── Passport.ts
│   │   │
│   │   ├── controllers/
│   │   │   └── authController.ts
│   │   │
│   │   ├── errors/
│   │   │   └── authErrors.ts
│   │   │
│   │   ├── middleware/
│   │   │   └── authMiddleware.ts
│   │   │
│   │   ├── models/
│   │   │   └── User.ts
│   │   │
│   │   ├── routes/
│   │   │   ├── auth.route.ts
│   │   │   └── user.route.ts
│   │   │
│   │   ├── services/
│   │   │   ├── authService.ts
│   │   │   └── userService.ts
│   │   │
│   │   ├── types/
│   │   │   ├── auth.ts
│   │   │   └── express.d.ts
│   │   │
│   │   └── server.ts
│   │
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── src/
    ├── public/
    ├── .env
    ├── package.json
    ├── vercel.json
    └── ...
```

## 📡 API Endpoints

### Authentication

#### Start Google Authentication

```http
GET /auth/google
```

Redirects the user to Google's OAuth authorization page.

#### Google OAuth Callback

```http
GET /auth/google/callback
```

Handles Google's OAuth callback, finds or creates the user, generates a JWT, and redirects to the frontend.

#### Authentication Failure

```http
GET /auth/failed
```

Returns an authentication failure response.

#### Logout

```http
POST /auth/logout
```

Clears the authentication cookie.

### User

#### Get Current User

```http
GET /users/me
```

Returns the currently authenticated user.

Authentication is required.

Example response:

```json
{
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "https://..."
  }
}
```

If the user is not authenticated:

```json
{
  "message": "Authentication required"
}
```

## 🗄️ Database

The project uses **MongoDB** with **Mongoose**.

### User Model

```text
User
├── name
├── email
├── password
├── googleId
├── avatar
├── createdAt
└── updatedAt
```

### Fields

| Field       | Type   | Description                                                 |
| ----------- | ------ | ----------------------------------------------------------- |
| `name`      | String | User's display name                                         |
| `email`     | String | User's email address                                        |
| `password`  | String | Optional field reserved for accounts that may use passwords |
| `googleId`  | String | Google account ID                                           |
| `avatar`    | String | Google profile image URL                                    |
| `createdAt` | Date   | Account creation date                                       |
| `updatedAt` | Date   | Last update date                                            |

## ⚙️ Environment Variables

### Backend

Create a `.env` file inside the `backend` directory:

```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

MONGO_URI=mongodb://127.0.0.1:27017/oauth_db

JWT_SECRET=your_jwt_secret

NODE_ENV=development

FRONTEND_URL=http://localhost:5173
```

### Production

For production, use:

```env
GOOGLE_CALLBACK_URL=https://google-authentication-ru47.onrender.com/auth/google/callback

FRONTEND_URL=https://google-authentication-gilt.vercel.app

NODE_ENV=production
```

### Frontend

Create a `.env` file inside the `frontend` directory:

```env
VITE_API_URL=http://localhost:3000
```

For production:

```env
VITE_API_URL=https://google-authentication-ru47.onrender.com
```

> **Never commit `.env` files or expose your Google OAuth client secret or JWT secret.**

## 🔑 Google Cloud OAuth Configuration

The project uses a Google OAuth 2.0 Web Application.

### Authorized JavaScript Origins

Development:

```text
http://localhost:5173
```

Production:

```text
https://google-authentication-gilt.vercel.app
```

### Authorized Redirect URIs

Development:

```text
http://localhost:3000/auth/google/callback
```

Production:

```text
https://google-authentication-ru47.onrender.com/auth/google/callback
```

## 💻 Running Locally

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd OAuth
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Configure Backend Environment Variables

Create:

```text
backend/.env
```

and add the required environment variables.

### 4. Start the Backend

```bash
npm run dev
```

The backend will run on:

```text
http://localhost:3000
```

### 5. Install Frontend Dependencies

Open another terminal:

```bash
cd frontend
npm install
```

### 6. Configure Frontend Environment Variables

Create:

```text
frontend/.env
```

with:

```env
VITE_API_URL=http://localhost:3000
```

### 7. Start the Frontend

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

## 🔒 Security

### HTTP-only Cookie

The JWT is stored in an HTTP-only cookie instead of:

```text
localStorage
sessionStorage
```

This prevents normal client-side JavaScript from directly accessing the JWT.

### Secure Cookie

In production, the authentication cookie uses:

```text
Secure: true
```

so it is only transmitted over HTTPS.

### SameSite

Because the deployed frontend and backend are hosted on different sites, the production cookie uses:

```text
SameSite=None
```

### CORS

The backend explicitly allows the production frontend:

```ts
cors({
  origin: "https://google-authentication-gilt.vercel.app",
  credentials: true,
});
```

### JWT Verification

Protected requests pass through authentication middleware that:

1. Reads the JWT from the cookie.
2. Verifies the JWT signature.
3. Validates the token payload.
4. Extracts the user's ID.
5. Allows the request to continue.

## 🌐 Deployment

### Frontend

The frontend is deployed on **Vercel**.

Production environment variable:

```env
VITE_API_URL=https://google-authentication-ru47.onrender.com
```

A Vercel rewrite is configured so React Router routes work correctly after deployment.

### Backend

The backend is deployed on **Render**.

Production environment variables are configured through Render's environment settings.

### Database

The production database is hosted on **MongoDB Atlas**.

## 🌍 Browser Privacy Considerations

Because the frontend and backend are deployed on different domains:

```text
Vercel Frontend
      │
      │ Cross-site request
      ▼
Render Backend
```

The authentication cookie uses:

```text
SameSite=None
Secure=true
```

Some browsers or privacy features may restrict cross-site cookies.

For example, aggressive browser privacy settings can prevent the JWT cookie from being sent with requests to the backend.

A production application can avoid much of this complexity by hosting the frontend and backend under the same site/domain.

## 📚 What I Learned

This project was built primarily to understand authentication architecture rather than simply use an authentication service.

Through this project, I learned:

* OAuth 2.0 authentication flow
* Google OAuth with Passport.js
* OAuth callback handling
* User creation and account linking
* JWT authentication
* HTTP-only cookies
* Secure cookies
* SameSite cookies
* CORS and credentials
* Authentication middleware
* Express route organization
* Controller/service separation
* Custom authentication errors
* MongoDB/Mongoose user modeling
* Environment variables
* Production authentication configuration
* Backend deployment with Render
* Frontend deployment with Vercel
* Cross-origin authentication
* Debugging authentication and cookie issues

## 🎯 Project Goal

The main goal of this project was to understand how authentication works behind the scenes.

Instead of relying on third-party authentication services such as **Firebase**, **Clerk**, or **Auth0**, the authentication flow was implemented directly using:

```text
Google OAuth
     ↓
Passport.js
     ↓
Express
     ↓
MongoDB
     ↓
JWT
     ↓
HTTP-only Cookie
     ↓
Authentication Middleware
     ↓
Protected API
```

This project is part of my backend development learning journey and was built to strengthen my understanding of **authentication, security, API architecture, and production deployment**.
