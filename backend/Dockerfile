# Use Node.js LTS version
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm ci --only=production

# Copy the rest of the application
COPY . .

# Create necessary directories with proper permissions
RUN mkdir -p /usr/src/app/public/uploads/delivery-images \
    && mkdir -p /usr/src/app/log/delivery \
    && mkdir -p /usr/src/app/log/donation \
    && chown -R node:node /usr/src/app

# Switch to non-root user
USER node

# Environment variables
ENV NODE_ENV=production
ENV PORT=9500

# Expose the application port
EXPOSE 9500

# Healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD node -e "fetch('http://localhost:9500').then(r => process.exit(r.ok ? 0 : 1))"

# Start the application
CMD ["npm", "run" , "dev"]
