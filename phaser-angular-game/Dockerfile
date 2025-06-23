# Use a Node.js image with npm (Angular CLI requires Node.js)
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
# This means npm install won't re-run unless dependencies change
COPY package.json package-lock.json ./

# Install project dependencies
RUN npm install

# Install Angular CLI globally
RUN npm install -g @angular/cli

# Copy the rest of your Angular application code
COPY . .

# Expose port 4200, which is the default for ng serve
EXPOSE 4200

# Command to run the Angular development server
# --host 0.0.0.0 makes the server accessible from outside the container
# --port 4200 specifies the port (default, but good to be explicit)
# You might want to add --disable-host-check if you're getting host errors
CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "4200"]