# Use the official Nginx image as a base image
FROM nginx:alpine

# Copy your HTML files to the Nginx default directory
COPY . /usr/share/nginx/html

# Expose port 80 to make the server accessible
EXPOSE 80