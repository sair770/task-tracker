# Base image
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies (only required for build)
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code
COPY . .

# Build Next.js app
RUN npm run build

# --- Production Image ---
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

# Create a volume mount point for data persistence
VOLUME /app/data

# Copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "start"]
