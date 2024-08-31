# Stage 1: Build the NestJS application
FROM node:18-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the NestJS application
RUN npm run build

# Stage 2: Set up the production environment
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy the build files from the builder stage
COPY --from=builder /app/dist ./dist

# Copy any other necessary files, like environment variables
COPY .env .env

# Expose the application port
EXPOSE 3006

# Start the NestJS application
CMD ["node", "dist/main"]
