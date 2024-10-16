# Use a lightweight nginx base image
FROM nginx:alpine

# Copy your static HTML files to the nginx directory
COPY ./html /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
