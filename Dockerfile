# Use an official Nginx base image
FROM nginx:alpine

# Copy your web app files to the Nginx document root
COPY public/ /usr/share/nginx/html

# Copy the services folder into the container
COPY services/ /usr/share/nginx/html/services

# Expose port 80
EXPOSE 80
