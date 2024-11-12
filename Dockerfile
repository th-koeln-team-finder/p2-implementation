# Use the official Node.js image as the base image
FROM node:22-alpine

# Set the working directory
WORKDIR /app

# Copy the rest of the application code
COPY . .

ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

# Install dependencies
RUN npm i -g pnpm
RUN pnpm install

# Build the Next.js application
RUN pnpm build

# Expose the port that Next.js will run on
EXPOSE 3000

# Start the Next.js application
CMD ["pnpm", "start"]
