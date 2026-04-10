![GitHub language count](https://img.shields.io/github/languages/count/smcclean4/Yap)
![GitHub top language](https://img.shields.io/github/languages/top/smcclean4/Yap?color=blue)
![GitHub issues](https://img.shields.io/github/issues/smcclean4/Yap)
![GitHub forks](https://img.shields.io/github/forks/smcclean4/Yap?style=social)
![GitHub Repo stars](https://img.shields.io/github/stars/smcclean4/Yap?style=social)

# Yap
Welcome to Yap! 😊

<img src="https://img.icons8.com/64/FFAE42/globe" alt="Yap chat" style="height: 115px" />

A social chat app where you can share short posts (“yaps”), react with likes, and stay in touch with friends through direct messages. Sign in with Discord, browse a home feed of updates, manage friend requests, and see who’s online in real time.

# Features

* ***Yaps feed:*** post messages, optionally with images; like posts and edit or delete your own content.

* ***Friends:*** send and accept friend requests, with support for pending, accepted, and blocked connections.

* ***Messenger:*** chat in threads with friends, with real-time updates powered by Socket.io.

* ***Presence:*** see who’s online with live presence broadcast over the socket server.

* ***Home updates:*** read curated news and announcements on the home page.

* ***Profiles:*** view and customize your profile with heading, bio, and avatar.

* ***Authentication:*** sign in with Discord via NextAuth.js.

* ***Mobile-friendly UI:*** responsive layout with Tailwind CSS so you can use Yap on different screen sizes.

# Technology Used

<img src="https://img.icons8.com/color/48/000000/typescript.png"/> <img src="https://img.icons8.com/color/48/000000/react-native.png"/> <img src="https://img.icons8.com/color/48/000000/nodejs.png"/> <img src="https://img.icons8.com/color/48/000000/postgresql.png"/> <img src="https://img.icons8.com/color/48/000000/discord.png"/>

<img src="https://axios-http.com/assets/logo.svg" alt="Axios" height="48"/>

<img width="422" height="360" alt="image" src="https://github.com/user-attachments/assets/e5f944bf-ac32-4eb2-996d-ed6ccd63892e" />

## Frontend

* ***Next.js:*** React framework for the web app, routing, and API routes.

* ***React & TypeScript:*** typed UI components and hooks.

* ***Tailwind CSS:*** utility-first styling for a consistent, responsive layout.

* ***tRPC & TanStack Query:*** end-to-end typesafe APIs with cached server state.

* ***Font Awesome:*** icons for actions and UI affordances.

* ***React Hot Toast:*** lightweight notifications for user feedback.

* ***Socket.io Client:*** real-time events for yaps and chat.

* ***UploadThing:*** file uploads for images attached to yaps.

## Backend

* ***Node.js:*** JavaScript runtime for the Next.js server and the standalone Socket.io server.

* ***Express:*** HTTP server used alongside Socket.io for the realtime service.

* ***Prisma:*** database toolkit and migrations with a type-safe client.

* ***PostgreSQL:*** relational database for users, yaps, friendships, messages, and sessions.

* ***NextAuth.js:*** authentication with the Prisma adapter and Discord provider.

* ***Nodemailer:*** sending email from the server when configured with SMTP.

* ***Zod:*** environment and input validation.

* ***Socket.io:*** WebSockets for presence, messaging, and live yap updates.

# Installation

1. Clone the repository to your local machine:

```bash
git clone https://github.com/Smcclean4/Yap.git
```

2. Go into the app directory and install dependencies:

```bash
cd Yap/yap-chat
npm install
```

3. Create a `.env` file in `yap-chat` (you can start from `.env.example`) and set at least:

   - `DATABASE_URL` — PostgreSQL connection string (see [Prisma docs](https://www.prisma.io/docs/reference/database-reference/connection-urls))
   - `NEXTAUTH_SECRET` — e.g. `openssl rand -base64 32`
   - `NEXTAUTH_URL` — e.g. `http://localhost:3000` for local dev
   - `DISCORD_CLIENT_ID` and `DISCORD_CLIENT_SECRET` — from the [Discord Developer Portal](https://discord.com/developers/applications)
   - Email variables (`EMAIL_SERVER_HOST`, `EMAIL_SERVER_PORT`, `EMAIL_SERVER_USER`, `EMAIL_SERVER_PASSWORD`, `EMAIL_FROM`) for Nodemailer

4. Apply the database schema (from `yap-chat`):

```bash
npx prisma migrate dev
```

5. Start the Next.js development server:

```bash
npm run dev
```

6. In another terminal, start the Socket.io server (from `yap-chat`):

```bash
node src/server/socket-server.js
```

7. Open your browser at [http://localhost:3000](http://localhost:3000) (the socket server defaults to port `3001`; set `PORT` / `CORS_ORIGIN` as needed for deployment).

# Contributing

If you want to contribute to this project, you're welcome to submit a pull request or open an issue to discuss any changes you'd like.

# Project Status

Immediate updates for the project may include:

> - Further polish on dashboards and profile customization.
> - Additional realtime features and notification channels as the app grows.
