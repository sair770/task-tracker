# --- Stage 1: Build Frontend (Node) ---
FROM node:20-alpine AS frontend-builder
WORKDIR /app-frontend
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# --- Stage 2: Build Backend (Go) ---
FROM golang:1.21-alpine AS backend-builder
WORKDIR /app-backend
COPY server/go.mod ./server/
COPY server/main.go ./server/
WORKDIR /app-backend/server
RUN go build -o main .

# --- Stage 3: Production Runtime (Alpine) ---
FROM alpine:latest
WORKDIR /app

# Install certificates for HTTPS calls if needed (though we only serve HTTP)
RUN apk --no-cache add ca-certificates

# Copy from builders
COPY --from=frontend-builder /app-frontend/dist ./dist
COPY --from=backend-builder /app-backend/server/main ./server

# Create data directory
RUN mkdir -p data
VOLUME /app/data

# Expose port
EXPOSE 8080
ENV PORT=8080

# Run the Go binary
CMD ["./server"]
