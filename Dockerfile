FROM node:20-alpine

WORKDIR /app

# Copy package files first to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application source code
COPY . .

# Expose web server port
EXPOSE 3000

# Default command to run with watch mode
CMD ["npm", "run", "dev"]

