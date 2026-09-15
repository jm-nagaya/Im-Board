# Im-Board
An anonymous, ephemeral image board with a freeform canvas.

***Note.*** This repo contains the frontend for Im-Board. The backend is in a separate repo: https://github.com/jm-nagaya/Im-Board-Backend

Im-Board is a minimalist image board inspired by early image boards but with a different philosophy. There are no threads, no replies, and no infinite scrolling. Every post is ephemeral and disappears after 24 hours. Users can post images, GIFs, and drawings on a freeform canvas that behaves more like a board than a feed.

[Click here for a live demo](https://main.d6fc2prq7p0u4.amplifyapp.com/)
(To save costs, servers are down between 7:30 PM and 6:45 AM JST)

## Features
- **Anonymous posting**: No usernames or profiles are displayed. Users are identified only by their usernames for daily limits and ownership, but this information is never exposed to other users.
<p align="center">
<img width="496" height="278" alt="posts" src="https://github.com/user-attachments/assets/a3f715e7-df92-4c84-9870-b5f90088652f" />
</p>

- **Multiple post types**: Upload images from your device, select a GIF from Klipy, or draw directly on the canvas.
<p align="center">
<img width="496" height="278" alt="drawing" src="https://github.com/user-attachments/assets/c5780789-8944-41c4-9842-e603e6efc08e" />
</p>

- **One post per day**: Each authenticated user can post one image per 24-hour period. This is enforced server-side.
- **Ephemeral content**: All posts and associated files are automatically deleted after 24 hours. No archive or history is kept.
- **Freeform canvas**: Images are placed anywhere on the board. You can drag them, bring them to front, and zoom or pan. There is no scrolling feed.
<p align="center">
<img width="496" height="278" alt="dragdroppan" src="https://github.com/user-attachments/assets/bd1aac0c-8163-459d-a4d3-891864afd7b0" />
</p>

- **No threads or replies**: Every post stands alone. There is no conversation structure.
- **Moderation**: Users can flag posts. Posts that receive enough flags are automatically filtered.
- **Secure authentication**: Sign in with Google OAuth or email/password via AWS Cognito. Email uniqueness is enforced.

## Tech Stack
- **Frontend**: React, TypeScript, Zustand, AWS Amplify UI, react-zoom-pan-pinch, dnd-kit
- **Backend**: Node.js, Express
- **Database**: PostgreSQL on AWS RDS
- **Authentication**: AWS Cognito (Google OAuth and email/password)
- **File Storage**: AWS S3 with presigned URLs for uploads
- **CDN and Proxy**: AWS CloudFront (routes `/api` to backend, `/uploads` to S3)
- **Serverless**: AWS Lambda for Cognito triggers, daily cleanup, and user sync
- **Deployment**: AWS Elastic Beanstalk (backend), AWS Amplify (frontend)

## Live Demo
To save costs, servers are down between 7:30 PM and 6:45 AM JST.
[main.d6fc2prq7p0u4.amplifyapp.com](https://main.d6fc2prq7p0u4.amplifyapp.com/)

## Getting Started

### Prerequisites

- Node.js 18 or later
- A running backend API (separate repository)
- AWS Cognito User Pool with Google and email/password sign-in enabled
- AWS S3 instance or S3 API emulator
- PostgreSQL instance
- Klipy API key

### Installation

```
git clone https://github.com/jm-nagaya/Im-Board.git
cd Im-Board
npm install
```

### Environment Variables
Create a .env file in the project root. Its contents should look something like this:

```
REACT_APP_BACKEND_URL=http://your-backend-url
REACT_APP_REDIRECT_URL=http://your-oauth2-redirect-url
REACT_APP_KLIPY_API_KEY=yourKlipyApiKey
```

### Running Locally
```
npm start
```
The app will open at `http://localhost:3000`.

### Building for Production
```
npm run build
```
The build output is in the `build` folder.

## Backend
The backend is a separate Node.js and Express API. You can find it in the following repo: https://github.com/jm-nagaya/Im-Board-Backend

## Contribution
This is a personal project, but suggestions and bug reports are welcome. Feel free to open an issue or submit a pull request.

## License
MIT
