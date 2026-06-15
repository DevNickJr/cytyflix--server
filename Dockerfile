# Use Node.js LTS version
# FROM node:20-alpine
FROM node:20-bookworm-slim

# Install curl for health checks
RUN apk add --no-cache curl

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript code
RUN npm run build

# Remove devDependencies after build
RUN npm prune --production

# Set production environment
ENV NODE_ENV=production
ENV PORT=3200

# Expose port (default from server.ts is 3200)
EXPOSE 3200

# Health check (ECS will use task definition health check, but this is good for local testing)
HEALTHCHECK --interval=15s --timeout=5s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:3200/ping || exit 1

# Start the application
CMD ["npm", "start"]

