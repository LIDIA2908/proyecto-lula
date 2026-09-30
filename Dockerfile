# Stage 1: Build application
FROM node:20-alpine AS build

WORKDIR /app

# Copy package manifests and install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build arguments for Vite environment variables
ARG VITE_GEMINI_API_KEY
ARG VITE_ELEVENLABS_API_KEY
ARG VITE_ELEVENLABS_VOICE_ID

ENV VITE_GEMINI_API_KEY=$VITE_GEMINI_API_KEY
ENV VITE_ELEVENLABS_API_KEY=$VITE_ELEVENLABS_API_KEY
ENV VITE_ELEVENLABS_VOICE_ID=$VITE_ELEVENLABS_VOICE_ID

# Build static production assets
RUN npm run build

# Stage 2: Production Nginx Server
FROM nginx:alpine

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built static files from Stage 1
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
