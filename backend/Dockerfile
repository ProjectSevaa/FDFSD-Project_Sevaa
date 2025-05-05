# Use Node.js LTS version
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install production dependencies only
RUN npm install --production

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

# Pass Redis environment variables
ENV REDIS_HOST=${REDIS_HOST}
ENV REDIS_PORT=${REDIS_PORT}
ENV REDIS_PASSWORD=${REDIS_PASSWORD}
ENV REDIS_TLS=${REDIS_TLS}

# Expose the application port
EXPOSE 9500

# Start the application
CMD ["npm", "start"]
