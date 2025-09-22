# ---------- Base Image ----------
# Use a small, stable Node runtime image
FROM node:22-alpine AS base

# Set working directory inside the container
WORKDIR /home/app

# Define build arguments for environment variables
ARG NODE_ENV


# ---------- Dependencies Layer ----------
# Only copy package files first (better caching)
COPY package*.json ./

# Install ONLY production dependencies
RUN npm ci --only=production

# ---------- App Layer ----------
# Copy the rest of the project
COPY . .

# Expose the port your Node app listens on (adjust if needed)
EXPOSE 5000

# Set NODE_ENV to production
ENV NODE_ENV=$NODE_ENV

# ---------- Start Command ----------
CMD ["node", "server.js"]
