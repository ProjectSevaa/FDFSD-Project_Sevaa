# Use Node.js LTS version
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Install dependencies first (better caching)
COPY package*.json ./

# Install all dependencies including devDependencies
RUN npm install

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

# Remove the healthcheck as it's causing issues
# Start the application
CMD ["npm", "start"]
