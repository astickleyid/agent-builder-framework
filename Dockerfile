# Multi-stage build for stick.ai agents
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY packages/runtime/package*.json ./packages/runtime/
COPY packages/cli/package*.json ./packages/cli/

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build packages
RUN npm run build --workspaces

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy built files
COPY --from=builder /app/packages/runtime/dist ./packages/runtime/dist
COPY --from=builder /app/packages/cli/dist ./packages/cli/dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/runtime/node_modules ./packages/runtime/node_modules
COPY --from=builder /app/packages/cli/node_modules ./packages/cli/node_modules

# Expose default port
EXPOSE 3000

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Run the server
CMD ["node", "packages/cli/dist/server.js"]
