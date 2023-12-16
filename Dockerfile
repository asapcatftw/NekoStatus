# Use an official Nginx base image
FROM nginx:alpine

# Copy your web app files to the Nginx document root
COPY public/ /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Command to start Nginx (it starts automatically in the official Nginx image)
CMD ["nginx", "-g", "daemon off;"]
