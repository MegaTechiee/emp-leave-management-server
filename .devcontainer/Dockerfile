# .devcontainer/Dockerfile
FROM node:22
# ENV DEBIAN_FRONTEND=noninteractive
WORKDIR /home/app

# Install Dependencies
RUN apt-get update && \
  apt-get install -y --no-install-recommends \
  curl \
  git \
  nano \
  vim && \
  rm -rf /var/lib/apt/lists/*


# Install Project Deps
# COPY package.json package-lock.json ./
# RUN npm install


# Default command
# CMD ["npm", "run", "dev"]
