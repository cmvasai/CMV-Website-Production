FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

ARG VITE_CLOUDINARY_CLOUD_NAME
ARG VITE_CLOUDINARY_API_KEY
ARG VITE_CLOUDINARY_API_SECRET
ARG VITE_ADMIN_USERNAME
ARG VITE_ADMIN_PASSWORD
ARG MAIL_ACCESS_KEY

ENV VITE_CLOUDINARY_CLOUD_NAME=$VITE_CLOUDINARY_CLOUD_NAME
ENV VITE_CLOUDINARY_API_KEY=$VITE_CLOUDINARY_API_KEY
ENV VITE_CLOUDINARY_API_SECRET=$VITE_CLOUDINARY_API_SECRET
ENV VITE_ADMIN_USERNAME=$VITE_ADMIN_USERNAME
ENV VITE_ADMIN_PASSWORD=$VITE_ADMIN_PASSWORD
ENV MAIL_ACCESS_KEY=$MAIL_ACCESS_KEY

RUN npm run build

# Serve stage
FROM node:18-alpine

WORKDIR /app

# Copy the built files from the builder stage
COPY --from=builder /app/dist ./dist

# Install a lightweight server for testing
RUN npm install -g serve

# Expose the port (default for serve is 3000)
EXPOSE 3000

# Command to serve the app
CMD ["serve", "-s", "dist", "-l", "3000"]