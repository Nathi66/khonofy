# Authentication

## Mechanisms

- Email/password registration and login
- JWT access tokens (`Authorization: Bearer <token>`)
- Forgot / reset password via reset tokens (1 hour expiry)
- Optional SMTP for reset email; in development reset URL is also logged by the backend

## Endpoints

| Method | Path | Auth | Notes |
|--------|------|------|-------|
| POST | `/api/auth/register` | No | Creates `staff`; returns token + user |
| POST | `/api/auth/login` | No | Returns token + user |
| GET | `/api/auth/me` | Yes | Current user |
| PATCH | `/api/auth/me` | Yes | Update `phone`, `fullName` |
| POST | `/api/auth/forgot-password` | No | Always ok response; sets hashed token if user exists |
| POST | `/api/auth/reset-password` | No | Body: `resetToken`, `newPassword` |

## Frontend

- Routes: `/login`, `/register`, `/forgot-password`, `/reset-password`
- Protected routes wrap app layout; unauthenticated users redirect to login
- Profile: `/profile` — view name, email, role, department; edit phone; theme toggle app-wide

## Security notes

- Passwords stored as hashes (`passwordHash`)
- Reset tokens stored hashed; never log plaintext passwords
- See `roles-permissions.md` for post-auth authorization
