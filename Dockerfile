# Stage 1: Build the frontend
FROM node:20-slim AS builder

WORKDIR /app
COPY package*.json ./
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve with Node.js
FROM node:20-slim

WORKDIR /app
COPY package*.json ./
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*
RUN npm install --omit=dev

# Copy built frontend
COPY --from=builder /app/dist ./dist
# Copy backend files
COPY server ./server
# Copy DB (if exists during build) or ignore
# Copy entrypoint/config
EXPOSE 3001

CMD ["node", "server/index.js"]
