# Use the official Node.js image as the base image
FROM node:22-alpine

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package.json ./

# Install dependencies
RUN npm i -g pnpm
RUN pnpm install

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN pnpm run build

# Expose the port that Next.js will run on
EXPOSE 3000

# Start the Next.js application
CMD ["pnpm", "start"]
