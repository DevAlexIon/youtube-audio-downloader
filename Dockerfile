# ----- Build React (Frontend) -----
FROM node:18 as build-frontend
WORKDIR /app
COPY client ./client
WORKDIR /app/client
RUN npm install && npm run build

# ----- Backend + ffmpeg + yt-dlp -----
FROM node:18

# Install ffmpeg and yt-dlp
RUN apt-get update && \
    apt-get install -y ffmpeg curl && \
    curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp && \
    chmod +x /usr/local/bin/yt-dlp

WORKDIR /app

# Copy server
COPY server ./server
WORKDIR /app/server

# Copy built frontend to public folder (used by express)
COPY --from=build-frontend /app/client/dist ./public

# Install backend dependencies
RUN npm install

EXPOSE 5000
CMD ["node", "index.js"]