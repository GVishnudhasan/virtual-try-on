# Use an official Nginx image to serve the React app
FROM nginx:alpine

# Copy the build output to the Nginx container
COPY build/ /usr/share/nginx/html/

# Copy custom Nginx config
COPY default.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for the Nginx server
EXPOSE 80

# Run Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
